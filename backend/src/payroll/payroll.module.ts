import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { PayoutEntity } from '../entities/payout.entity';
import { PayoutLedgerEntity } from '../entities/payout-ledger.entity';
import { BookingEntity } from '../entities/booking.entity';
import { VendorEntity } from '../entities/vendor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PayoutEntity,
      PayoutLedgerEntity,
      BookingEntity,
      VendorEntity,
    ]),
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
