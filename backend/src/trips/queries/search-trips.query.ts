import { TripSearchParams } from '../ports/trip.repository.interface';

export class SearchTripsQuery {
  constructor(public readonly params: TripSearchParams) {}
}
