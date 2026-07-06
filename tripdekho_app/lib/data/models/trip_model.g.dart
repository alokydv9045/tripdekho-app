// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trip_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

TripModel _$TripModelFromJson(Map<String, dynamic> json) => TripModel(
  id: json['id'] as String,
  title: json['title'] as String,
  shortDescription: json['shortDescription'] as String?,
  description: json['description'] as String?,
  category: (json['category'] as List<dynamic>)
      .map((e) => e as String)
      .toList(),
  difficulty: json['difficulty'] as String?,
  durationDays: (json['durationDays'] as num).toInt(),
  durationNights: (json['durationNights'] as num).toInt(),
  highlights: (json['highlights'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  inclusions: (json['inclusions'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  exclusions: (json['exclusions'] as List<dynamic>?)
      ?.map((e) => e as String)
      .toList(),
  location: TripLocationModel.fromJson(
    json['location'] as Map<String, dynamic>,
  ),
  price: TripPriceModel.fromJson(json['price'] as Map<String, dynamic>),
  dates: (json['dates'] as List<dynamic>?)
      ?.map((e) => TripDateModel.fromJson(e as Map<String, dynamic>))
      .toList(),
  itinerary: (json['itinerary'] as List<dynamic>?)
      ?.map((e) => TripItineraryModel.fromJson(e as Map<String, dynamic>))
      .toList(),
  thumbnail: json['thumbnail'] == null
      ? null
      : TripMediaModel.fromJson(json['thumbnail'] as Map<String, dynamic>),
);

Map<String, dynamic> _$TripModelToJson(TripModel instance) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'shortDescription': instance.shortDescription,
  'description': instance.description,
  'category': instance.category,
  'difficulty': instance.difficulty,
  'durationDays': instance.durationDays,
  'durationNights': instance.durationNights,
  'highlights': instance.highlights,
  'inclusions': instance.inclusions,
  'exclusions': instance.exclusions,
  'location': instance.location,
  'price': instance.price,
  'dates': instance.dates,
  'itinerary': instance.itinerary,
  'thumbnail': instance.thumbnail,
};

TripLocationModel _$TripLocationModelFromJson(Map<String, dynamic> json) =>
    TripLocationModel(
      city: json['city'] as String,
      state: json['state'] as String?,
      country: json['country'] as String,
    );

Map<String, dynamic> _$TripLocationModelToJson(TripLocationModel instance) =>
    <String, dynamic>{
      'city': instance.city,
      'state': instance.state,
      'country': instance.country,
    };

TripPriceModel _$TripPriceModelFromJson(Map<String, dynamic> json) =>
    TripPriceModel(
      amount: json['amount'] as num,
      currency: json['currency'] as String?,
      originalPrice: json['originalPrice'] as num?,
    );

Map<String, dynamic> _$TripPriceModelToJson(TripPriceModel instance) =>
    <String, dynamic>{
      'amount': instance.amount,
      'currency': instance.currency,
      'originalPrice': instance.originalPrice,
    };

TripDateModel _$TripDateModelFromJson(Map<String, dynamic> json) =>
    TripDateModel(
      id: json['id'] as String,
      startDate: DateTime.parse(json['startDate'] as String),
      endDate: DateTime.parse(json['endDate'] as String),
      price: json['price'] as num,
      totalSeats: (json['totalSeats'] as num).toInt(),
    );

Map<String, dynamic> _$TripDateModelToJson(TripDateModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'startDate': instance.startDate.toIso8601String(),
      'endDate': instance.endDate.toIso8601String(),
      'price': instance.price,
      'totalSeats': instance.totalSeats,
    };

TripItineraryModel _$TripItineraryModelFromJson(Map<String, dynamic> json) =>
    TripItineraryModel(
      dayNumber: (json['dayNumber'] as num).toInt(),
      title: json['title'] as String,
      description: json['description'] as String?,
    );

Map<String, dynamic> _$TripItineraryModelToJson(TripItineraryModel instance) =>
    <String, dynamic>{
      'dayNumber': instance.dayNumber,
      'title': instance.title,
      'description': instance.description,
    };

TripMediaModel _$TripMediaModelFromJson(Map<String, dynamic> json) =>
    TripMediaModel(url: json['url'] as String);

Map<String, dynamic> _$TripMediaModelToJson(TripMediaModel instance) =>
    <String, dynamic>{'url': instance.url};
