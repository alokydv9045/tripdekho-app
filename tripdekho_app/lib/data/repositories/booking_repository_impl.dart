import '../../core/network/api_client.dart';
import '../../core/network/api_endpoints.dart';
import '../../domain/entities/booking_entity.dart';
import '../../domain/repositories/booking_repository.dart';

class BookingRepositoryImpl implements BookingRepository {
  final ApiClient apiClient;

  BookingRepositoryImpl(this.apiClient);

  @override
  Future<BookingEntity> createBooking(String tripId, int numGuests, DateTime date) async {
    final response = await apiClient.post(
      ApiEndpoints.bookings,
      data: {
        'tripId': tripId,
        'numGuests': numGuests,
        'bookingDate': date.toIso8601String(),
      },
    );

    final data = response is Map && response.containsKey('data') ? response['data'] : response;
    return BookingEntity.fromJson(data as Map<String, dynamic>);
  }

  @override
  Future<List<BookingEntity>> getMyBookings() async {
    final response = await apiClient.get(ApiEndpoints.bookings);
    
    final List<dynamic> data = response is Map ? response['data'] ?? response['items'] ?? response : response;
    return data.map((json) => BookingEntity.fromJson(json as Map<String, dynamic>)).toList();
  }

  @override
  Future<BookingEntity> getBookingDetails(String id) async {
    final response = await apiClient.get(ApiEndpoints.bookingDetails(id));
    final data = response is Map && response.containsKey('data') ? response['data'] : response;
    return BookingEntity.fromJson(data as Map<String, dynamic>);
  }
}
