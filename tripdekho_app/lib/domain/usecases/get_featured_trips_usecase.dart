import '../entities/trip_entity.dart';
import '../repositories/trip_repository.dart';

class GetFeaturedTripsUseCase {
  final TripRepository repository;

  GetFeaturedTripsUseCase(this.repository);

  Future<List<TripEntity>> execute() async {
    return await repository.getFeaturedTrips();
  }
}
