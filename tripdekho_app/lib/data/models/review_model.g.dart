// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'review_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReviewModel _$ReviewModelFromJson(Map<String, dynamic> json) => ReviewModel(
  id: json['id'] as String,
  userName: json['userName'] as String,
  userAvatar: json['userAvatar'] as String?,
  rating: (json['rating'] as num).toDouble(),
  content: json['content'] as String,
  tripName: json['tripName'] as String?,
  tripId: json['tripId'] as String?,
);

Map<String, dynamic> _$ReviewModelToJson(ReviewModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userName': instance.userName,
      'userAvatar': instance.userAvatar,
      'rating': instance.rating,
      'content': instance.content,
      'tripName': instance.tripName,
      'tripId': instance.tripId,
    };
