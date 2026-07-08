import '../../core/network/api_client.dart';
import '../../core/network/api_endpoints.dart';
import '../../domain/entities/trip_entity.dart';
import '../../domain/repositories/trip_repository.dart';

class TripRepositoryImpl implements TripRepository {
  final ApiClient apiClient;

  TripRepositoryImpl(this.apiClient);

  @override
  Future<List<TripEntity>> getFeaturedTrips() async {
    final response = await apiClient.get(ApiEndpoints.featuredTrips);
    
    final List<dynamic> data = response is Map ? response['data'] ?? response['items'] ?? response : response;
    return data.map((json) => TripEntity.fromJson(json as Map<String, dynamic>)).toList();
  }

  @override
  Future<List<TripEntity>> getAllTrips({String? search, String? category}) async {
    final queryParams = <String, dynamic>{};
    if (search != null && search.isNotEmpty) queryParams['search'] = search;
    if (category != null && category.isNotEmpty) queryParams['category'] = category;

    final response = await apiClient.get(ApiEndpoints.trips, queryParameters: queryParams);
    
    final List<dynamic> data = response is Map ? response['data'] ?? response['items'] ?? response : response;
    return data.map((json) => TripEntity.fromJson(json as Map<String, dynamic>)).toList();
  }

  @override
  Future<TripEntity> getTripById(String id) async {
    final response = await apiClient.get(ApiEndpoints.tripDetails(id));
    final data = response is Map && response.containsKey('data') ? response['data'] : response;
    return TripEntity.fromJson(data as Map<String, dynamic>);
  }

  @override
  Future<List<TripEntity>> getVendorTrips() async {
    // Assuming the backend has an endpoint for vendor trips, like /trips/vendor or /vendor/trips
    // If not, we might pass a user ID, but token usually determines this. Let's use /trips/vendor as a placeholder.
    final response = await apiClient.get('${ApiEndpoints.trips}/vendor');
    final List<dynamic> data = response is Map ? response['data'] ?? response['items'] ?? response : response;
    return data.map((json) => TripEntity.fromJson(json as Map<String, dynamic>)).toList();
  }

  @override
  Future<TripEntity> createTrip(Map<String, dynamic> tripData) async {
    final response = await apiClient.post(ApiEndpoints.trips, data: tripData);
    final data = response is Map && response.containsKey('data') ? response['data'] : response;
    return TripEntity.fromJson(data as Map<String, dynamic>);
  }
}
