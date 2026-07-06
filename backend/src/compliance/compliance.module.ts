import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplianceController } from './compliance.controller';
import { UserEntity } from '../entities/user.entity';
import { BookingEntity } from '../entities/booking.entity';
import { ReviewEntity } from '../reviews/entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, BookingEntity, ReviewEntity]),
  ],
  controllers: [ComplianceController],
})
export class ComplianceModule {}
