import { Injectable, Inject, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { EventConstants } from '../../events/constants/events.constant';

@Injectable()
export class CacheInvalidationListener {
  private readonly logger = new Logger(CacheInvalidationListener.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  @OnEvent(EventConstants.TRIP_CREATED)
  async handleTripCreatedEvent(payload: { tripId: string }) {
    this.logger.log(
      `Trip created (${payload.tripId}), invalidating trips cache...`,
    );
    // Since searchTrips generates dynamic cache keys based on URL queries,
    // we need to clear the entire store or use a specific prefix if redis store allows.
    // For cache-manager, the simplest robust way to bust all dynamic routes is to reset the cache store.
    await this.cacheManager.clear();
    this.logger.log(`Trips cache completely invalidated.`);
  }
}
