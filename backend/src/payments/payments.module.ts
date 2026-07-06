import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { PaymentEntity } from '../entities/payment.entity';
import { PayoutEntity } from '../entities/payout.entity';
import { PayoutLedgerEntity } from '../entities/payout-ledger.entity';
import { BookingEntity } from '../entities/booking.entity';
import { VendorEntity } from '../entities/vendor.entity';
import { WebhooksController } from './webhooks.controller';
import { ProcessRazorpayWebhookHandler } from './commands/handlers/process-webhook.handler';
import { IPaymentRepository } from './ports/payment.repository.interface';
import { PaymentRepository } from './adapters/payment.repository';
import { IPayoutRepository } from './ports/payout.repository.interface';
import { PayoutRepository } from './adapters/payout.repository';
import { IPayoutLedgerRepository } from './ports/payout-ledger.repository.interface';
import { PayoutLedgerRepository } from './adapters/payout-ledger.repository';
import { BookingsModule } from '../bookings/bookings.module';
import { IBookingRepository } from '../bookings/ports/booking.repository.interface';
import { BookingRepository } from '../bookings/adapters/booking.repository';

const CommandHandlers = [ProcessRazorpayWebhookHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      PaymentEntity,
      PayoutEntity,
      PayoutLedgerEntity,
      BookingEntity,
      VendorEntity,
    ]),
  ],
  controllers: [WebhooksController],
  providers: [
    { provide: IPaymentRepository, useClass: PaymentRepository },
    { provide: IPayoutRepository, useClass: PayoutRepository },
    { provide: IPayoutLedgerRepository, useClass: PayoutLedgerRepository },
    { provide: IBookingRepository, useClass: BookingRepository },
    ...CommandHandlers,
  ],
})
export class PaymentsModule {}
