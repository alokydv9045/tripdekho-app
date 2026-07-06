import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './reviews.controller';
import { ReviewEntity } from './entities/review.entity';
import { TripEntity } from '../entities/trip.entity';
import { BookingEntity } from '../entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, TripEntity, BookingEntity])],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
