import { Controller, Post, Get, Body, Param, Query, BadRequestException } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from './entities/review.entity';
import { TripEntity } from '../entities/trip.entity';
import { UserEntity } from '../entities/user.entity';
import { BookingEntity } from '../entities/booking.entity';
import { CreateReviewDto, RespondToReviewDto } from './dto/reviews.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
    @InjectRepository(TripEntity)
    private readonly tripRepo: Repository<TripEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
  ) {}

  @Public()
  @Get('top')
  async getTopReviews(@Query('limit') limit: number = 6) {
    const reviews = await this.reviewRepo.find({
      where: { status: 'approved' },
      relations: { user: true, trip: true },
      order: { rating: 'DESC', createdAt: 'DESC' },
      take: Number(limit) || 6,
    });
    return { success: true, data: reviews };
  }

  @Post()
  async createReview(
    @CurrentUser('id') userId: string,
    @Body() body: CreateReviewDto & { bookingId?: string },
  ) {
    const trip = await this.tripRepo.findOne({ where: { id: body.tripId } });
    if (!trip) throw new BadRequestException('Trip not found');

    let booking: BookingEntity | null = null;
    
    if (body.bookingId) {
      booking = await this.bookingRepo.findOne({
        where: { id: body.bookingId, user: { id: userId }, trip: { id: trip.id } },
      });
    } else {
      // Find any completed, unreviewed booking for this user and trip
      booking = await this.bookingRepo.findOne({
        where: { user: { id: userId }, trip: { id: trip.id }, status: 'completed' as any, reviewed: false },
      });
    }

    if (!booking) throw new BadRequestException('No eligible completed booking found for this trip');
    if (booking.status !== 'completed') throw new BadRequestException('You can only review completed trips');
    if (booking.reviewed) throw new BadRequestException('You have already reviewed this booking');

    const review = this.reviewRepo.create({
      rating: body.rating,
      comment: body.comment,
      trip: { id: trip.id },
      user: { id: userId } as UserEntity,
    });
    await this.reviewRepo.save(review);

    if (booking) {
      booking.reviewed = true;
      await this.bookingRepo.save(booking);
    }

    return {
      success: true,
      message: 'Review created successfully',
      data: review,
    };
  }

  @Public()
  @Get('trip/:tripId')
  async getReviewsByTrip(
    @Param('tripId') tripId: string,
    @Query() query: Record<string, unknown>,
  ) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const [reviews, total] = await this.reviewRepo.findAndCount({
      where: { trip: { id: tripId }, status: 'approved' },
      relations: { user: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      success: true,
      data: {
        reviews,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  @Get('vendor')
  async getVendorReviews(
    @CurrentUser('id') userId: string,
    @Query() query: Record<string, unknown>,
  ) {
    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;

    const [reviews, total] = await this.reviewRepo.findAndCount({
      where: { trip: { vendor: { user: { id: userId } } } },
      relations: { user: true, trip: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      success: true,
      data: {
        reviews,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  @Post(':id/respond')
  async respondToReview(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: RespondToReviewDto,
  ) {
    await this.reviewRepo.update(id, { response: body.response });
    return {
      success: true,
      message: 'Responded to review',
      data: { id, response: body.response },
    };
  }
}
