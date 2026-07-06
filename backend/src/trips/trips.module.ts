import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { TripEntity } from '../entities/trip.entity';
import { TripLocationEntity } from '../entities/trip-location.entity';
import { TripPriceEntity } from '../entities/trip-price.entity';
import { TripDateEntity } from '../entities/trip-date.entity';
import { TripItineraryEntity } from '../entities/trip-itinerary.entity';
import { TripMediaEntity } from '../entities/trip-media.entity';
import { VendorEntity } from '../entities/vendor.entity';
import { TripsController } from './trips.controller';
import { CreateTripHandler } from './commands/handlers/create-trip.handler';
import { SearchTripsHandler } from './queries/handlers/search-trips.handler';
import { ITripRepository } from './ports/trip.repository.interface';
import { TripRepository } from './adapters/trip.repository';
import { CacheInvalidationListener } from './listeners/cache-invalidation.listener';
import { InjectRepository } from '@nestjs/typeorm';

const CommandHandlers = [CreateTripHandler];
const QueryHandlers = [SearchTripsHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      TripEntity,
      TripLocationEntity,
      TripPriceEntity,
      TripDateEntity,
      TripItineraryEntity,
      TripMediaEntity,
      VendorEntity,
    ]),
  ],
  controllers: [TripsController],
  providers: [
    {
      provide: ITripRepository,
      useClass: TripRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
    CacheInvalidationListener,
  ],
})
export class TripsModule implements OnModuleInit {
  private readonly logger = new Logger(TripsModule.name);

  constructor(
    @InjectRepository(TripEntity)
    private readonly tripRepo: import('typeorm').Repository<TripEntity>,
  ) {}

  onModuleInit() {
    // Run cleanup task every hour to auto-complete past trips
    setInterval(
      () => {
        this.autoCompleteTrips().catch((err) =>
          this.logger.error('Failed to auto complete trips', err),
        );
      },
      1000 * 60 * 60,
    );

    // Also run once on startup after 10 seconds
    setTimeout(() => {
      this.autoCompleteTrips().catch((err) =>
        this.logger.error('Failed to auto complete trips on startup', err),
      );
    }, 10000);
  }

  private async autoCompleteTrips() {
    this.logger.log('Running auto-complete trips task...');
    const now = new Date();

    // Find published trips that have dates
    const trips = await this.tripRepo.find({
      where: { status: 'published' as any },
      relations: { dates: true },
    });

    let completedCount = 0;
    const tripsToSave = [];

    for (const trip of trips) {
      if (trip.dates && trip.dates.length > 0) {
        const allDatesPast = trip.dates.every((d) => new Date(d.endDate) < now);
        if (allDatesPast) {
          trip.status = 'completed' as any;
          tripsToSave.push(trip);
          completedCount++;
        }
      }
    }

    if (tripsToSave.length > 0) {
      await this.tripRepo.save(tripsToSave);
      this.logger.log(
        `Auto-completed ${completedCount} trips whose dates have passed.`,
      );
    }
  }
}
