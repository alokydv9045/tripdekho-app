import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchTripsQuery } from '../search-trips.query';
import { ITripRepository } from '../../ports/trip.repository.interface';
import { Inject } from '@nestjs/common';

@QueryHandler(SearchTripsQuery)
export class SearchTripsHandler implements IQueryHandler<SearchTripsQuery> {
  constructor(
    @Inject(ITripRepository)
    private readonly tripRepository: ITripRepository,
  ) {}

  async execute(query: SearchTripsQuery) {
    let [trips, total] = await this.tripRepository.search(query.params);

    // Lazy Evaluation: Automatically mark published trips as completed if all dates have passed
    let needsSave = false;
    const now = new Date();
    for (const trip of trips) {
      if (trip.status === 'published' && trip.dates && trip.dates.length > 0) {
        const allDatesPast = trip.dates.every(d => new Date(d.endDate) < now);
        if (allDatesPast) {
          trip.status = 'completed' as any;
          needsSave = true;
        }
      }
    }
    
    if (needsSave) {
      // Save updated trips asynchronously so we don't block the response
      const completedTrips = trips.filter(t => t.status === 'completed');
      Promise.all(completedTrips.map(t => this.tripRepository.save(t))).catch(console.error);
      
      // Filter them out of the current response so they don't show up on the homepage right now
      trips = trips.filter(t => t.status !== 'completed');
      
      // Update pagination total correctly
      total -= completedTrips.length;
    }
    
    // Attach vendor stats
    const vendorIds = [...new Set(trips.map(t => t.vendor?.id).filter(Boolean))];
    if (vendorIds.length > 0) {
      const stats = await this.tripRepository.getVendorStats(vendorIds);
      for (const trip of trips) {
        if (trip.vendor) {
          const vStats = stats[trip.vendor.id] || { rating: 0, count: 0 };
          (trip as any).stats = {
            rating: vStats.rating,
            reviews: vStats.count,
          };
        }
      }
    }

    return {
      trips,
      pagination: {
        total,
        limit: query.params.limit,
        skip: query.params.skip,
      },
    };
  }
}
