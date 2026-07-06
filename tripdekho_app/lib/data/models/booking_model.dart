import 'package:json_annotation/json_annotation.dart';
import 'trip_model.dart';

part 'booking_model.g.dart';

@JsonSerializable()
class BookingModel {
  final String id;
  final String status;
  final num? totalAmount;
  final String? paymentStatus;
  final DateTime createdAt;
  final TripModel? trip;
  final String? departureId;
  final int? guests;

  BookingModel({
    required this.id,
    required this.status,
    this.totalAmount,
    this.paymentStatus,
    required this.createdAt,
    this.trip,
    this.departureId,
    this.guests,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) => _$BookingModelFromJson(json);
  Map<String, dynamic> toJson() => _$BookingModelToJson(this);
}
