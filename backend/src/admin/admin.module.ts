import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminVendorsController } from './controllers/admin-vendors.controller';
import { AdminTripsController } from './controllers/admin-trips.controller';
import { AdminFinanceController } from './controllers/admin-finance.controller';
import { AdminSystemController } from './controllers/admin-system.controller';
import { AdminSupportController } from './controllers/admin-support.controller';
import { AdminGrowthController } from './controllers/admin-growth.controller';
import { AdminMessagingController } from './controllers/admin-messaging.controller';
import { AdminBookingsController } from './controllers/admin-bookings.controller';
import { AdminPromoCodesController } from './controllers/admin-promo-codes.controller';
import { AdminReviewsController } from './controllers/admin-reviews.controller';
import { AdminCareersController } from './controllers/admin-careers.controller';

import { UserEntity } from '../entities/user.entity';
import { VendorEntity } from '../entities/vendor.entity';
import { TripEntity } from '../entities/trip.entity';
import { BookingEntity } from '../entities/booking.entity';
import { ReviewEntity } from '../reviews/entities/review.entity';
import { PaymentEntity } from '../entities/payment.entity';
import { PayoutEntity } from '../entities/payout.entity';
import { PromoCodeEntity } from '../entities/promo-code.entity';
import { AuditLogEntity } from '../entities/audit-log.entity';
import { CampaignEntity } from '../entities/campaign.entity';
import { GlobalSettingEntity } from '../entities/global-setting.entity';

import { AdminDeleteUserHandler } from './commands/handlers/admin-delete-user.handler';
import { AdminDeleteVendorHandler } from './commands/handlers/admin-delete-vendor.handler';
import { ApproveVendorHandler } from './commands/handlers/approve-vendor.handler';
import { VerifyVendorKycHandler } from './commands/handlers/verify-vendor-kyc.handler';
import { AdminUpdateTripStatusHandler } from './commands/handlers/admin-update-trip-status.handler';

import { IUserRepository } from '../auth/ports/user.repository.interface';
import { UserRepository } from '../auth/adapters/user.repository';

import { SupportTicketEntity } from '../support/entities/ticket.entity';
import { ContactsModule } from '../contacts/contacts.module';
import { CareersModule } from '../careers/careers.module';

const CommandHandlers = [
  AdminDeleteUserHandler,
  AdminDeleteVendorHandler,
  ApproveVendorHandler,
  VerifyVendorKycHandler,
  AdminUpdateTripStatusHandler,
];

@Module({
  imports: [
    CqrsModule,
    ContactsModule,
    CareersModule,
    TypeOrmModule.forFeature([
      UserEntity,
      VendorEntity,
      TripEntity,
      BookingEntity,
      ReviewEntity,
      PaymentEntity,
      PayoutEntity,
      PromoCodeEntity,
      SupportTicketEntity,
      AuditLogEntity,
      CampaignEntity,
      GlobalSettingEntity,
    ]),
  ],
  controllers: [
    AdminUsersController,
    AdminVendorsController,
    AdminTripsController,
    AdminFinanceController,
    AdminSystemController,
    AdminSupportController,
    AdminGrowthController,
    AdminMessagingController,
    AdminBookingsController,
    AdminPromoCodesController,
    AdminReviewsController,
    AdminCareersController,
  ],
  providers: [
    { provide: IUserRepository, useClass: UserRepository },
    ...CommandHandlers,
  ],
})
export class AdminModule {}
