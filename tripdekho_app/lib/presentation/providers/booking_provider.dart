import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/api_client.dart';
import '../../domain/entities/booking_entity.dart';
import '../../data/repositories/booking_repository_impl.dart';

final bookingRepositoryProvider = Provider((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return BookingRepositoryImpl(apiClient);
});

final myBookingsProvider = FutureProvider<List<BookingEntity>>((ref) async {
  final repository = ref.watch(bookingRepositoryProvider);
  return await repository.getMyBookings();
});

class BookingNotifier extends StateNotifier<AsyncValue<BookingEntity?>> {
  final BookingRepositoryImpl _repository;

  BookingNotifier(this._repository) : super(const AsyncValue.data(null));

  Future<void> createBooking(String tripId, int numGuests, DateTime date) async {
    state = const AsyncValue.loading();
    try {
      final booking = await _repository.createBooking(tripId, numGuests, date);
      state = AsyncValue.data(booking);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
    }
  }
}

final bookingNotifierProvider = StateNotifierProvider<BookingNotifier, AsyncValue<BookingEntity?>>((ref) {
  final repository = ref.watch(bookingRepositoryProvider);
  return BookingNotifier(repository as BookingRepositoryImpl);
});
