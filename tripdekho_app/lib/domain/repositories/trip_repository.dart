import '../entities/trip_entity.dart';

abstract class TripRepository {
  Future<List<TripEntity>> getFeaturedTrips();
  Future<List<TripEntity>> getAllTrips({String? search, String? category});
  Future<TripEntity> getTripById(String id);
  Future<List<TripEntity>> getVendorTrips();
  Future<TripEntity> createTrip(Map<String, dynamic> tripData);
}
