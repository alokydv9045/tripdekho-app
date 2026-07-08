import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/api_client.dart';
import '../../domain/entities/trip_entity.dart';
import '../../data/repositories/trip_repository_impl.dart';
import '../../domain/usecases/get_featured_trips_usecase.dart';

// Providers for dependencies
final tripRepositoryProvider = Provider((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return TripRepositoryImpl(apiClient);
});

final getFeaturedTripsUseCaseProvider = Provider((ref) {
  final repository = ref.watch(tripRepositoryProvider);
  return GetFeaturedTripsUseCase(repository);
});

// State provider for the UI to consume
final featuredTripsProvider = FutureProvider<List<TripEntity>>((ref) async {
  final useCase = ref.watch(getFeaturedTripsUseCaseProvider);
  return await useCase.execute();
});

final allTripsProvider = FutureProvider.family<List<TripEntity>, Map<String, String>>((ref, filters) async {
  final repository = ref.watch(tripRepositoryProvider);
  return await repository.getAllTrips(
    search: filters['search'],
    category: filters['category'],
  );
});

final tripDetailsProvider = FutureProvider.family<TripEntity, String>((ref, id) async {
  final repository = ref.watch(tripRepositoryProvider);
  return await repository.getTripById(id);
});

final vendorTripsProvider = FutureProvider<List<TripEntity>>((ref) async {
  final repository = ref.watch(tripRepositoryProvider);
  return await repository.getVendorTrips();
});
