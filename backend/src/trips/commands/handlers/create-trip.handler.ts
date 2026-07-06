import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTripCommand } from '../create-trip.command';
import { ITripRepository } from '../../ports/trip.repository.interface';
import {
  Inject,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripEntity, TripStatus } from '../../../entities/trip.entity';
import { TripLocationEntity } from '../../../entities/trip-location.entity';
import { TripPriceEntity } from '../../../entities/trip-price.entity';
import { TripDateEntity } from '../../../entities/trip-date.entity';
import { TripItineraryEntity } from '../../../entities/trip-itinerary.entity';
import { VendorEntity } from '../../../entities/vendor.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventConstants } from '../../../events/constants/events.constant';

@CommandHandler(CreateTripCommand)
export class CreateTripHandler implements ICommandHandler<CreateTripCommand> {
  constructor(
    @Inject(ITripRepository)
    private readonly tripRepository: ITripRepository,
    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(command: CreateTripCommand): Promise<TripEntity> {
    const { userId, createTripDto } = command;

    const vendor = await this.vendorRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!vendor) {
      throw new ForbiddenException('Only vendors can create trips');
    }

    const slug =
      createTripDto.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      '-' +
      Date.now().toString().slice(-4);

    const tripData: Partial<TripEntity> = {
      slug,
      title: createTripDto.title,
      shortDescription: createTripDto.shortDescription,
      description: createTripDto.description,
      category: createTripDto.category,
      difficulty: createTripDto.difficulty,
      durationDays: createTripDto.durationDays,
      durationNights: createTripDto.durationNights,
      minGroupSize: createTripDto.minGroupSize,
      maxGroupSize: createTripDto.maxGroupSize,
      highlights: createTripDto.highlights,
      inclusions: createTripDto.inclusions,
      exclusions: createTripDto.exclusions,
      requirements: createTripDto.requirements,
      thingsToCarry: createTripDto.thingsToCarry,
      tags: createTripDto.tags,
      importantNote: createTripDto.importantNote,
      pickupLocations: createTripDto.pickupLocations,
      travelingLocations: createTripDto.travelingLocations,
      thumbnail: createTripDto.thumbnail,
      routeMapImage: createTripDto.routeMapImage,
      isCustomizable: createTripDto.isCustomizable ?? false,
      status: TripStatus.PUBLISHED,
      vendor: vendor,
      location: createTripDto.location as TripLocationEntity,
      price: createTripDto.price as TripPriceEntity,
    };

    if (createTripDto.dates && createTripDto.dates.length > 0) {
      tripData.dates = createTripDto.dates as TripDateEntity[];
    }

    if (createTripDto.itinerary && createTripDto.itinerary.length > 0) {
      tripData.itinerary = createTripDto.itinerary as TripItineraryEntity[];
    }

    try {
      const createdTrip = await this.tripRepository.create(tripData);

      this.eventEmitter.emit(EventConstants.TRIP_CREATED, {
        tripId: createdTrip.id,
      });

      return createdTrip;
    } catch (error: unknown) {
      if ((error as any).code === '23505') {
        throw new BadRequestException(
          'A trip with a similar title already exists',
        );
      }
      throw error;
    }
  }
}
