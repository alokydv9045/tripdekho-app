// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BookingModel _$BookingModelFromJson(Map<String, dynamic> json) => BookingModel(
  id: json['id'] as String,
  status: json['status'] as String,
  totalAmount: json['totalAmount'] as num?,
  paymentStatus: json['paymentStatus'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  trip: json['trip'] == null
      ? null
      : TripModel.fromJson(json['trip'] as Map<String, dynamic>),
  departureId: json['departureId'] as String?,
  guests: (json['guests'] as num?)?.toInt(),
);

Map<String, dynamic> _$BookingModelToJson(BookingModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'status': instance.status,
      'totalAmount': instance.totalAmount,
      'paymentStatus': instance.paymentStatus,
      'createdAt': instance.createdAt.toIso8601String(),
      'trip': instance.trip,
      'departureId': instance.departureId,
      'guests': instance.guests,
    };
