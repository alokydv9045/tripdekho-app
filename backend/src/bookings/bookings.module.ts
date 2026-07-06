import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { BookingEntity } from '../entities/booking.entity';
import { TripEntity } from '../entities/trip.entity';
import { TripDateEntity } from '../entities/trip-date.entity';
import { VendorEntity } from '../entities/vendor.entity';
import { UserEntity } from '../entities/user.entity';
import { GlobalSettingEntity } from '../entities/global-setting.entity';
import { BookingsController } from './bookings.controller';
import { CreateBookingHandler } from './commands/handlers/create-booking.handler';
import { ConfirmPaymentHandler } from './commands/handlers/confirm-payment.handler';
import { CancelBookingHandler } from './commands/handlers/cancel-booking.handler';
import { CalculatePriceHandler } from './queries/handlers/calculate-price.handler';
import { IBookingRepository } from './ports/booking.repository.interface';
import { BookingRepository } from './adapters/booking.repository';
import { ITripRepository } from '../trips/ports/trip.repository.interface';
import { TripRepository } from '../trips/adapters/trip.repository';
import { RewardsModule } from '../rewards/rewards.module';

const CommandHandlers = [
  CreateBookingHandler,
  ConfirmPaymentHandler,
  CancelBookingHandler,
];
const QueryHandlers = [CalculatePriceHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      BookingEntity,
      TripEntity,
      TripDateEntity,
      VendorEntity,
      UserEntity,
      GlobalSettingEntity,
    ]),
    RewardsModule,
  ],
  controllers: [BookingsController],
  providers: [
    {
      provide: IBookingRepository,
      useClass: BookingRepository,
    },
    {
      provide: ITripRepository,
      useClass: TripRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class BookingsModule {}
