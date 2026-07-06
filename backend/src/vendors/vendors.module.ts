import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorEntity } from '../entities/vendor.entity';
import { UserEntity } from '../entities/user.entity';
import { TripEntity } from '../entities/trip.entity';
import { ReviewEntity } from '../reviews/entities/review.entity';
import { BookingEntity } from '../entities/booking.entity';
import { IVendorRepository } from './ports/vendor.repository.interface';
import { VendorRepository } from './adapters/vendor.repository';
import { CreateVendorHandler } from './commands/handlers/create-vendor.handler';
import { GetVendorHandler } from './queries/handlers/get-vendor.handler';

const CommandHandlers = [CreateVendorHandler];
const QueryHandlers = [GetVendorHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      VendorEntity,
      UserEntity,
      TripEntity,
      ReviewEntity,
      BookingEntity,
    ]),
  ],
  controllers: [VendorsController],
  providers: [
    {
      provide: IVendorRepository,
      useClass: VendorRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
})
export class VendorsModule {}
