import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/trip_model.dart';
import '../../data/repositories/trip_repository.dart';
import 'auth_provider.dart';

part 'trip_provider.g.dart';

@riverpod
TripRepository tripRepository(TripRepositoryRef ref) {
  final dio = ref.watch(apiClientProvider).publicDio;
  return TripRepository(dio);
}

@riverpod
Future<List<TripModel>> fetchTrips(FetchTripsRef ref, {String? category, String? search, String? tags, int limit = 10}) async {
  final repository = ref.watch(tripRepositoryProvider);
  return repository.getTrips(category: category, search: search, tags: tags, limit: limit);
}

@riverpod
Future<TripModel?> fetchTripDetail(FetchTripDetailRef ref, String id) async {
  final repository = ref.watch(tripRepositoryProvider);
  return repository.getTripById(id);
}
