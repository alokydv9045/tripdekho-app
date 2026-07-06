import {
  Controller,
  Get,
  Delete,
  Request,
  NotFoundException,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { UserEntity } from '../entities/user.entity';
import { BookingEntity } from '../entities/booking.entity';
import { ReviewEntity } from '../reviews/entities/review.entity';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Assume this exists

@Controller('compliance')
export class ComplianceController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingRepo: Repository<BookingEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepo: Repository<ReviewEntity>,
  ) {}

  // @UseGuards(JwtAuthGuard)
  @Get('export-data')
  async exportUserData(@Request() req: any) {
    const userId = req.user?.id;
    if (!userId)
      throw new NotFoundException('User identity not found in request');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found in database');

    const bookings = await this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: { trip: true },
    });
    const reviews = await this.reviewRepo.find({
      where: { user: { id: userId } },
      relations: { trip: true },
    });

    return {
      userId: user.id,
      requestedAt: new Date().toISOString(),
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone || null,
      },
      bookings: bookings.map((b) => ({
        id: b.id,
        bookingNumber: b.bookingNumber,
        trip: b.trip?.title,
        amount: b.totalPrice,
        date: b.createdAt,
      })),
      reviews: reviews.map((r) => ({
        id: r.id,
        trip: r.trip?.title,
        rating: r.rating,
        comment: r.comment,
      })),
    };
  }

  // @UseGuards(JwtAuthGuard)
  @Delete('anonymize')
  async anonymizeUser(@Request() req: any) {
    const userId = req.user?.id;
    if (!userId)
      throw new NotFoundException('User identity not found in request');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found in database');

    const hash = crypto
      .createHash('sha256')
      .update(userId)
      .digest('hex')
      .substring(0, 8);

    const anonymizedData = {
      name: `User_${hash}`,
      email: `deleted_${hash}@anonymized.local`,
      phone: '',
      isActive: false,
    };

    try {
      await this.userRepo.update(userId, anonymizedData);

      return {
        success: true,
        message:
          'Account successfully anonymized in compliance with GDPR Right to be Forgotten.',
        anonymizedData,
      };
    } catch (err) {
      throw new InternalServerErrorException('Failed to anonymize user data');
    }
  }
}
