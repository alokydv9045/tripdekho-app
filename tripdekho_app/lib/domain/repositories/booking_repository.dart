import '../entities/booking_entity.dart';

abstract class BookingRepository {
  Future<BookingEntity> createBooking(String tripId, int numGuests, DateTime date);
  Future<List<BookingEntity>> getMyBookings();
  Future<BookingEntity> getBookingDetails(String id);
}
