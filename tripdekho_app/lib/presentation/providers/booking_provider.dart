import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../../data/models/booking_model.dart';
import '../../data/repositories/booking_repository.dart';
import '../../data/datasources/api_client.dart';
import 'auth_provider.dart';

part 'booking_provider.g.dart';

@riverpod
BookingRepository bookingRepository(BookingRepositoryRef ref) {
  final dio = ref.watch(apiClientProvider).privateDio;
  return BookingRepository(dio);
}

@riverpod
Future<List<BookingModel>> fetchMyBookings(FetchMyBookingsRef ref) async {
  final repository = ref.watch(bookingRepositoryProvider);
  return repository.getMyBookings();
}

@riverpod
Future<BookingModel?> fetchBookingDetail(FetchBookingDetailRef ref, String id) async {
  final repository = ref.watch(bookingRepositoryProvider);
  return repository.getBookingById(id);
}
