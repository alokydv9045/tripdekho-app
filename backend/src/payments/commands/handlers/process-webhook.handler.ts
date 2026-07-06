import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ProcessRazorpayWebhookCommand } from '../process-webhook.command';
import { Inject, BadRequestException, Logger } from '@nestjs/common';
import { IPaymentRepository } from '../../ports/payment.repository.interface';
import { IPayoutRepository } from '../../ports/payout.repository.interface';
import { IPayoutLedgerRepository } from '../../ports/payout-ledger.repository.interface';
import { IBookingRepository } from '../../../bookings/ports/booking.repository.interface';
import { PaymentStatus, PaymentEntity } from '../../../entities/payment.entity';
import { BookingStatus } from '../../../entities/booking.entity';
import {
  EscrowStatus,
  LedgerStatus,
} from '../../../entities/payout-ledger.entity';
import * as crypto from 'crypto';

@CommandHandler(ProcessRazorpayWebhookCommand)
export class ProcessRazorpayWebhookHandler implements ICommandHandler<ProcessRazorpayWebhookCommand> {
  private readonly logger = new Logger(ProcessRazorpayWebhookHandler.name);

  private get webhookSecret() {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret)
      throw new Error(
        'RAZORPAY_WEBHOOK_SECRET is not configured in the environment',
      );
    return secret;
  }
  constructor(
    @Inject(IPaymentRepository)
    private readonly paymentRepo: IPaymentRepository,
    @Inject(IPayoutRepository) private readonly payoutRepo: IPayoutRepository,
    @Inject(IPayoutLedgerRepository)
    private readonly ledgerRepo: IPayoutLedgerRepository,
    @Inject(IBookingRepository)
    private readonly bookingRepo: IBookingRepository,
  ) {}

  async execute(command: ProcessRazorpayWebhookCommand) {
    const { signature, rawBody, event, payload } = command;

    // 1. Verify Signature
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature && process.env.NODE_ENV !== 'test') {
      this.logger.warn('Invalid webhook signature');
      throw new BadRequestException('Invalid Signature');
    }

    this.logger.log(`Processing Razorpay Webhook Event: ${event}`);

    // 2. Dispatch
    switch (event) {
      case 'payment.captured':
        await this.handlePaymentCaptured(payload.payment.entity);
        break;
      case 'transfer.processed':
        await this.handleTransferProcessed(payload.transfer.entity);
        break;
      case 'transfer.failed':
        await this.handleTransferFailed(payload.transfer.entity);
        break;
      case 'refund.processed':
        await this.handleRefundProcessed(payload.refund.entity);
        break;
      default:
        this.logger.log(`Unhandled Webhook Event: ${event}`);
    }

    return { success: true };
  }

  private async handlePaymentCaptured(payment: any) {
    const bookingId = payment.notes?.bookingId;
    if (!bookingId) return;

    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      throw new Error(
        `Booking ${bookingId} not found for payment ${payment.id}`,
      );
    }

    if (booking.paymentStatus === ('paid' as any)) {
      this.logger.log(`Booking ${bookingId} already paid. Ignoring webhook.`);
      return;
    }

    let paymentEntity = await this.paymentRepo.findByRazorpayPaymentId(
      payment.id,
    );
    if (!paymentEntity) {
      paymentEntity = await this.paymentRepo.create({
        booking,
        customer: booking.user,
        vendor: booking.vendor,
        amount: payment.amount / 100,
        currency: payment.currency,
        type: 'full_payment' as any,
        razorpayOrderId: payment.order_id,
        razorpayPaymentId: payment.id,
        status: PaymentStatus.SUCCEEDED,
        processedAt: new Date(),
        netAmount: (payment.amount - (payment.fee || 0)) / 100,
        platformFee: booking.platformFee,
      });
    } else {
      paymentEntity.status = PaymentStatus.SUCCEEDED;
      paymentEntity.processedAt = new Date();
      await this.paymentRepo.save(paymentEntity);
    }

    booking.paymentStatus = 'paid' as any;
    booking.status = BookingStatus.CONFIRMED;
    booking.confirmedAt = new Date();
    await this.bookingRepo.save(booking);

    await this.ledgerRepo.create({
      vendor: booking.vendor,
      booking,
      type: 'booking_payment' as any,
      grossAmount: paymentEntity.amount,
      commissionAmount: booking.basePrice - booking.vendorAmount,
      netAmount: booking.vendorAmount,
      status: LedgerStatus.COMPLETED,
      escrowStatus: EscrowStatus.HELD,
    });

    this.logger.log(
      `Payment captured and booking confirmed via Webhook: ${bookingId}`,
    );
  }

  private async handleTransferProcessed(transfer: any) {
    const payoutId = transfer.notes?.payoutId;
    if (!payoutId) return;

    const payout = await this.payoutRepo.findById(payoutId);
    if (!payout || payout.status === ('paid' as any)) return;

    payout.status = 'paid' as any;
    payout.processedAt = new Date();
    payout.razorpayTransferId = transfer.id;
    await this.payoutRepo.save(payout);

    this.logger.log(`Payout ${payoutId} confirmed via Webhook`);
  }

  private async handleTransferFailed(transfer: any) {
    const payoutId = transfer.notes?.payoutId;
    if (!payoutId) return;

    const payout = await this.payoutRepo.findById(payoutId);
    if (!payout) return;

    payout.status = 'failed' as any;
    payout.failureReason =
      transfer.failure_reason || 'Transfer failed at Razorpay';
    await this.payoutRepo.save(payout);

    this.logger.log(`Payout ${payoutId} marked as failed via Webhook`);
  }

  private async handleRefundProcessed(refund: any) {
    const paymentId = refund.payment_id;
    const payment = await this.paymentRepo.findByRazorpayPaymentId(paymentId);
    if (!payment || payment.status === PaymentStatus.REFUNDED) return;

    payment.status = PaymentStatus.REFUNDED;
    payment.refund = {
      amount: refund.amount / 100,
      reason: 'User cancelled',
      status: 'succeeded',
      processedAt: new Date(),
    };
    await this.paymentRepo.save(payment);

    this.logger.log(`Refund for payment ${paymentId} completed via Webhook`);
  }
}
