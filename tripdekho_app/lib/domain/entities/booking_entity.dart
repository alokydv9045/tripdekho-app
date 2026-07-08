import 'trip_entity.dart';

class BookingEntity {
  final String id;
  final String status;
  final double totalAmount;
  final int numGuests;
  final DateTime bookingDate;
  final TripEntity? trip;

  BookingEntity({
    required this.id,
    required this.status,
    required this.totalAmount,
    required this.numGuests,
    required this.bookingDate,
    this.trip,
  });

  factory BookingEntity.fromJson(Map<String, dynamic> json) {
    return BookingEntity(
      id: json['id']?.toString() ?? '',
      status: json['status'] ?? 'pending',
      totalAmount: json['totalAmount']?.toDouble() ?? 0.0,
      numGuests: json['numGuests'] ?? 1,
      bookingDate: json['bookingDate'] != null 
          ? DateTime.parse(json['bookingDate']) 
          : DateTime.now(),
      trip: json['trip'] != null ? TripEntity.fromJson(json['trip']) : null,
    );
  }
}
