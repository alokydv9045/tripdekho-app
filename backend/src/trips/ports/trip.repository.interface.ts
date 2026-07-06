import { TripEntity } from '../../entities/trip.entity';

export const ITripRepository = Symbol('ITripRepository');

export interface TripSearchParams {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  tags?: string[];
  featured?: boolean;
  sortBy?: string;
  startDate?: string;
  endDate?: string;
  userLat?: number;
  userLng?: number;
  limit: number;
  skip: number;
}

export interface ITripRepository {
  create(data: Partial<TripEntity>): Promise<TripEntity>;
  findById(id: string): Promise<TripEntity | null>;
  findBySlug(slug: string): Promise<TripEntity | null>;
  search(params: TripSearchParams): Promise<[TripEntity[], number]>;
  save(trip: TripEntity): Promise<TripEntity>;
  getVendorStats(vendorIds: string[]): Promise<Record<string, { rating: number, count: number }>>;
}
