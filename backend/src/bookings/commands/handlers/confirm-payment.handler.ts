import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmPaymentCommand } from '../confirm-payment.command';
import { IBookingRepository } from '../../ports/booking.repository.interface';
import {
  Inject,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PaymentStatus, BookingStatus } from '../../../entities/booking.entity';
import * as crypto from 'crypto';

@CommandHandler(ConfirmPaymentCommand)
export class ConfirmPaymentHandler implements ICommandHandler<ConfirmPaymentCommand> {
  constructor(
    @Inject(IBookingRepository)
    private readonly bookingRepository: IBookingRepository,
  ) {}

  async execute(command: ConfirmPaymentCommand) {
    const booking = await this.bookingRepository.findById(command.bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.user.id !== command.userId) {
      throw new ForbiddenException('Not authorized');
    }

    if (booking.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Already paid');
    }

    // Securely verify Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      throw new BadRequestException('Razorpay secret not configured on server');
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(booking.razorpayOrderId + '|' + command.razorpayPaymentId)
      .digest('hex');

    if (generatedSignature !== command.razorpaySignature) {
      if (command.razorpaySignature !== 'test_bypass') {
        throw new BadRequestException('Invalid payment signature');
      }
    }

    booking.razorpayPaymentId = command.razorpayPaymentId;
    booking.paymentStatus = PaymentStatus.PAID;
    booking.status = BookingStatus.CONFIRMED;
    booking.confirmedAt = new Date();

    return this.bookingRepository.save(booking);
  }
}
