import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistEntity } from './entities/wishlist.entity';
import { TripEntity } from '../entities/trip.entity';

@Controller('wishlist')
export class WishlistController {
  constructor(
    @InjectRepository(WishlistEntity)
    private readonly wishlistRepo: Repository<WishlistEntity>,
    @InjectRepository(TripEntity)
    private readonly tripRepo: Repository<TripEntity>,
  ) {}

  @Get()
  async getWishlist(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const [items, total] = await this.wishlistRepo.findAndCount({
      where: { user: { id: userId } },
      relations: { trip: true },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      order: { createdAt: 'DESC' },
    });
    return {
      success: true,
      data: {
        items,
        total,
        pages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
      },
    };
  }

  @Post(':tripId')
  async toggleWishlist(
    @CurrentUser('id') userId: string,
    @Param('tripId') tripId: string,
  ) {
    const existing = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, trip: { id: tripId } },
    });
    if (existing) {
      await this.wishlistRepo.remove(existing);
      return {
        success: true,
        data: { added: false, message: 'Removed from wishlist' },
      };
    }
    const trip = await this.tripRepo.findOne({ where: { id: tripId } });
    if (!trip) throw new NotFoundException('Trip not found');
    const newWishlist = this.wishlistRepo.create({
      user: { id: userId },
      trip,
    });
    await this.wishlistRepo.save(newWishlist);
    return {
      success: true,
      data: { added: true, message: 'Added to wishlist' },
    };
  }

  @SkipThrottle()
  @Get('check/:tripId')
  async checkStatus(
    @CurrentUser('id') userId: string,
    @Param('tripId') tripId: string,
  ) {
    const existing = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, trip: { id: tripId } },
    });
    return { success: true, data: { inWishlist: !!existing } };
  }

  @Delete(':tripId')
  async removeFromWishlist(
    @CurrentUser('id') userId: string,
    @Param('tripId') tripId: string,
  ) {
    await this.wishlistRepo.delete({
      user: { id: userId },
      trip: { id: tripId },
    });
    return { success: true, message: 'Removed from wishlist' };
  }

  @Delete()
  async clearWishlist(@CurrentUser('id') userId: string) {
    await this.wishlistRepo.delete({ user: { id: userId } });
    return { success: true, message: 'Wishlist cleared' };
  }
}
