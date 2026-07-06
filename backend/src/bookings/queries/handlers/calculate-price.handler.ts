import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CalculatePriceQuery } from '../calculate-price.query';
import { ITripRepository } from '../../../trips/ports/trip.repository.interface';
import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { RewardsService } from '../../../rewards/rewards.service';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalSettingEntity } from '../../../entities/global-setting.entity';
import { Repository } from 'typeorm';

@QueryHandler(CalculatePriceQuery)
export class CalculatePriceHandler implements IQueryHandler<CalculatePriceQuery> {
  constructor(
    @Inject(ITripRepository)
    private readonly tripRepository: ITripRepository,
    private readonly rewardsService: RewardsService,
    @InjectRepository(GlobalSettingEntity)
    private readonly globalSettingRepo: Repository<GlobalSettingEntity>,
  ) {}

  async execute(query: CalculatePriceQuery) {
    const trip = await this.tripRepository.findById(query.tripId);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    const departure = trip.dates?.find((d) => d.id === query.departureId);
    if (!departure) {
      throw new NotFoundException('Departure date not found for this trip');
    }

    const settings = await this.globalSettingRepo.findOne({ where: { configName: 'default' } });
    const platformFee = Number(settings?.commissionRates?.platformFeeAmount || 0);

    const basePrice = departure.price * query.numberOfGuests;
    const serviceFee = 0;
    const taxes = 0;
    let discount = 0;

    if (query.userId && query.pointsToRedeem && query.pointsToRedeem > 0) {
      const balance = await this.rewardsService.getBalance(query.userId);
      if (balance.balance < query.pointsToRedeem) {
        throw new BadRequestException('Insufficient Wander Points');
      }
      // 1 point = 1 INR
      discount = query.pointsToRedeem;
    }

    const totalPrice = Math.max(0, basePrice + platformFee + serviceFee + taxes - discount);

    return {
      basePrice,
      platformFee,
      serviceFee,
      taxes,
      discount,
      totalPrice,
      currency: 'INR',
    };
  }
}
