import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/trip_model.dart';
import '../../data/repositories/trip_repository.dart';
import '../../data/datasources/api_client.dart';

part 'trip_provider.g.dart';

@riverpod
TripRepository tripRepository(TripRepositoryRef ref) {
  final dio = ApiClient.dio; // use the globally configured dio client
  return TripRepository(dio);
}

@riverpod
Future<List<TripModel>> fetchTrips(FetchTripsRef ref, {String? category, String? search}) async {
  final repository = ref.watch(tripRepositoryProvider);
  return repository.getTrips(category: category, search: search);
}

@riverpod
Future<TripModel?> fetchTripDetail(FetchTripDetailRef ref, String id) async {
  final repository = ref.watch(tripRepositoryProvider);
  return repository.getTripById(id);
}
