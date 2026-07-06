import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistController } from './wishlist.controller';
import { WishlistEntity } from './entities/wishlist.entity';
import { TripEntity } from '../entities/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistEntity, TripEntity])],
  controllers: [WishlistController],
})
export class WishlistModule {}
