import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../../entities/payment.entity';
import { PayoutEntity, PayoutStatus } from '../../entities/payout.entity';
import { VendorEntity } from '../../entities/vendor.entity';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { SettleVendorDto } from '../dto/admin-finance.dto';

import { BookingEntity, PaymentStatus } from '../../entities/booking.entity';

@Roles(UserRole.SUPER_ADMIN, UserRole.FINANCE_ADMIN)
@Controller('admin/finance')
export class AdminFinanceController {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepo: Repository<PaymentEntity>,
    @InjectRepository(PayoutEntity)
    private readonly payoutRepo: Repository<PayoutEntity>,
    @InjectRepository(VendorEntity)
    private readonly vendorRepo: Repository<VendorEntity>,
  ) {}

  @Get('payments')
  async getPaymentAudit(@Query() query: Record<string, unknown>) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const qb = this.vendorRepo.manager
      .createQueryBuilder(BookingEntity, 'booking')
      .leftJoinAndSelect('booking.user', 'user')
      .leftJoinAndSelect('booking.vendor', 'vendor')
      .leftJoinAndSelect('booking.trip', 'trip')
      .where('booking.paymentStatus = :paymentStatus', {
        paymentStatus: PaymentStatus.PAID,
      })
      .orderBy('booking.createdAt', 'DESC');

    if (query.search && typeof query.search === 'string') {
      qb.andWhere(
        '(booking.bookingNumber ILIKE :search OR user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${query.search}%` },
      );
    }

    qb.skip((page - 1) * limit).take(limit);
    const [bookings, total] = await qb.getManyAndCount();

    const payments = bookings.map((b: any) => ({
      id: b.id,
      bookingNumber: b.bookingNumber,
      amount: b.totalPrice,
      netAmount: b.vendorAmount,
      commission: (b.basePrice || 0) - (b.vendorAmount || 0),
      taxes: b.taxes,
      currency: 'INR',
      status: 'succeeded',
      type: 'full_payment',
      paymentMethod: b.paymentMethod,
      createdAt: b.confirmedAt || b.createdAt,
      customer: b.user,
      vendor: b.vendor,
      trip: b.trip,
    }));

    return { success: true, data: { payments, total, page, limit } };
  }

  @Post('payments/sync-razorpay')
  @HttpCode(HttpStatus.OK)
  syncRazorpay() {
    return { success: true, data: { synced: 0 } };
  }

  @Get('payroll')
  async getPayroll() {
    const pendingPayouts = await this.payoutRepo.find({
      where: [
        { status: PayoutStatus.HOLD },
        { status: PayoutStatus.READY },
        { status: PayoutStatus.PROCESSING },
      ],
      relations: { vendor: true },
    });
    const stats = {
      totalPending: pendingPayouts.reduce(
        (sum, p) => sum + Number(p.amount),
        0,
      ),
    };
    return { success: true, data: { balances: pendingPayouts, stats } };
  }

  @Post('payroll/:vendorId/settle')
  @HttpCode(HttpStatus.OK)
  async settleVendor(
    @Param('vendorId') vendorId: string,
    @Body() body: SettleVendorDto,
  ) {
    const vendor = await this.vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) throw new NotFoundException('Vendor not found');

    const payout = this.payoutRepo.create({
      vendor,
      amount: body.amount,
      status: PayoutStatus.PAID,
      method: 'BANK_TRANSFER',
      externalId: 'manual_settle_' + Date.now(),
    });
    await this.payoutRepo.save(payout);

    return { success: true, data: { success: true, payout } };
  }

  @Get('payouts')
  async getAllPayouts(@Query() query: Record<string, unknown>) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const qb = this.payoutRepo
      .createQueryBuilder('payout')
      .leftJoinAndSelect('payout.vendor', 'vendor')
      .orderBy('payout.createdAt', 'DESC');

    if (query.status && typeof query.status === 'string') {
      qb.andWhere('payout.status = :status', { status: query.status });
    }

    qb.skip((page - 1) * limit).take(limit);
    const [payouts, total] = await qb.getManyAndCount();

    return {
      success: true,
      data: { payouts, total, totalPages: Math.ceil(total / limit), page },
    };
  }

  @Post('payouts/:id/process')
  @HttpCode(HttpStatus.OK)
  async processPayout(@Param('id') id: string) {
    const payout = await this.payoutRepo.findOne({ where: { id } });
    if (!payout) throw new NotFoundException('Payout not found');
    await this.payoutRepo.update(id, { status: PayoutStatus.PAID });
    return { success: true, data: { success: true } };
  }

  @Get('wallets')
  async getVendorWallets() {
    const vendors = await this.vendorRepo.find();

    const wallets = await Promise.all(
      vendors.map(async (vendor) => {
        const bookings = await this.vendorRepo.manager.find(BookingEntity, {
          where: {
            vendor: { id: vendor.id },
            paymentStatus: PaymentStatus.PAID,
          },
        });
        const payouts = await this.payoutRepo.find({
          where: { vendor: { id: vendor.id }, status: PayoutStatus.PAID },
        });

        const totalEarned = bookings.reduce(
          (sum, b) => sum + (Number(b.vendorAmount) || 0),
          0,
        );
        const totalPaid = payouts.reduce(
          (sum, p) => sum + (Number(p.amount) || 0),
          0,
        );

        return {
          id: vendor.id,
          vendor,
          balance: totalEarned - totalPaid,
          totalEarned,
          isActive: !vendor.isDeleted,
        };
      }),
    );

    return { success: true, data: { wallets, total: wallets.length } };
  }
}
