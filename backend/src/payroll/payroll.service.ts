import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { PayoutEntity, PayoutStatus } from '../entities/payout.entity';
import {
  PayoutLedgerEntity,
  LedgerEntryType,
  LedgerStatus,
  EscrowStatus,
} from '../entities/payout-ledger.entity';
import { BookingEntity, BookingStatus } from '../entities/booking.entity';
import { VendorEntity } from '../entities/vendor.entity';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(PayoutEntity)
    private payoutRepo: Repository<PayoutEntity>,
    @InjectRepository(PayoutLedgerEntity)
    private ledgerRepo: Repository<PayoutLedgerEntity>,
    @InjectRepository(BookingEntity)
    private bookingRepo: Repository<BookingEntity>,
    @InjectRepository(VendorEntity)
    private vendorRepo: Repository<VendorEntity>,
  ) {}

  private async resolveVendorId(id: string): Promise<string> {
    const vendor = await this.vendorRepo.findOne({ where: { user: { id } } });
    if (vendor) {
      return vendor.id;
    }
    // Check if it's already a valid vendor profile ID
    const directVendor = await this.vendorRepo.findOne({ where: { id } });
    if (directVendor) {
      return directVendor.id;
    }
    return id;
  }

  async getVendorPayouts(vendorId: string, params: any) {
    const resolvedVendorId = await this.resolveVendorId(vendorId);
    return this.payoutRepo.find({
      where: { vendor: { id: resolvedVendorId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getPayoutDetails(id: string) {
    const payout = await this.payoutRepo.findOne({
      where: { id },
      relations: { vendor: true },
    });
    if (!payout) throw new NotFoundException('Payout not found');
    return payout;
  }

  async getLedger(vendorId: string, params: any) {
    const resolvedVendorId = await this.resolveVendorId(vendorId);
    return this.ledgerRepo.find({
      where: { vendor: { id: resolvedVendorId } },
      relations: { vendor: true },
      order: { createdAt: 'DESC' },
    });
  }

  async requestPayout(
    vendorId: string,
    data: { amount?: number; bookingId?: string },
  ) {
    const resolvedVendorId = await this.resolveVendorId(vendorId);
    // Determine the available balance for the vendor (Escrow Released)
    const availableLedgers = await this.ledgerRepo.find({
      where: {
        vendor: { id: resolvedVendorId },
        escrowStatus: EscrowStatus.RELEASED,
        status: LedgerStatus.COMPLETED,
      },
    });

    let balance = 0;
    availableLedgers.forEach((l) => {
      balance += Number(l.netAmount); // netAmount can be positive (revenue) or negative (past payouts)
    });

    const requestAmount = data.amount || balance;

    if (requestAmount <= 0) {
      throw new BadRequestException('No available balance to request payout.');
    }

    if (requestAmount > balance) {
      throw new BadRequestException(
        'Requested amount exceeds available balance.',
      );
    }

    // Create the Payout
    const payout = this.payoutRepo.create({
      vendor: { id: resolvedVendorId },
      amount: requestAmount,
      status: PayoutStatus.HOLD,
      method: 'bank_transfer',
      note: 'Vendor initiated payout request',
    });

    await this.payoutRepo.save(payout);

    // Create a corresponding negative Ledger Entry to deduct from balance
    const ledgerEntry = this.ledgerRepo.create({
      vendor: { id: resolvedVendorId },
      payout: { id: payout.id },
      type: LedgerEntryType.PAYOUT,
      grossAmount: 0,
      netAmount: -requestAmount, // Deducting the amount
      status: LedgerStatus.PENDING,
      escrowStatus: EscrowStatus.RELEASED,
      description: `Payout request #${payout.id}`,
    });

    await this.ledgerRepo.save(ledgerEntry);

    return payout;
  }

  async getSummary(vendorId: string, period: string) {
    const resolvedVendorId = await this.resolveVendorId(vendorId);
    // Calculate total revenue, pending payouts, etc
    const ledgers = await this.ledgerRepo.find({
      where: {
        vendor: { id: resolvedVendorId },
        type: LedgerEntryType.BOOKING_PAYMENT,
      },
    });

    let totalRevenue = 0;
    let netEarnings = 0;
    ledgers.forEach((l) => {
      totalRevenue += Number(l.grossAmount);
      netEarnings += Number(l.netAmount);
    });

    const payouts = await this.payoutRepo.find({
      where: { vendor: { id: resolvedVendorId } },
    });

    let pending = 0;
    let completed = 0;
    payouts.forEach((p) => {
      if (p.status === PayoutStatus.PAID) completed += Number(p.amount);
      if (
        p.status === PayoutStatus.HOLD ||
        p.status === PayoutStatus.PROCESSING
      )
        pending += Number(p.amount);
    });

    return {
      period,
      totalRevenue,
      netEarnings,
      platformFees: totalRevenue - netEarnings,
      payouts: {
        pending,
        processing: 0,
        completed,
        failed: 0,
      },
      totalBookings: ledgers.length,
    };
  }

  // Admin methods
  async getAllPayouts(params: any) {
    return this.payoutRepo.find({
      relations: { vendor: true },
      order: { createdAt: 'DESC' },
    });
  }

  async processPayout(id: string) {
    const payout = await this.payoutRepo.findOne({
      where: { id },
      relations: { vendor: true },
    });
    if (!payout) throw new NotFoundException('Payout not found');

    payout.status = PayoutStatus.PAID;
    payout.processedAt = new Date();
    await this.payoutRepo.save(payout);

    // Update the ledger entry to completed
    const ledger = await this.ledgerRepo.findOne({
      where: { payout: { id: payout.id } },
    });
    if (ledger) {
      ledger.status = LedgerStatus.COMPLETED;
      await this.ledgerRepo.save(ledger);
    }

    return payout;
  }
}
