import 'package:json_annotation/json_annotation.dart';

part 'trip_model.g.dart';

@JsonSerializable()
class TripModel {
  final String id;
  final String title;
  final String? shortDescription;
  final String? description;
  final List<String> category;
  final String? difficulty;
  final int durationDays;
  final int durationNights;
  final List<String>? highlights;
  final List<String>? inclusions;
  final List<String>? exclusions;
  final TripLocationModel location;
  final TripPriceModel price;
  final List<TripDateModel>? dates;
  final List<TripItineraryModel>? itinerary;
  final TripMediaModel? thumbnail;

  TripModel({
    required this.id,
    required this.title,
    this.shortDescription,
    this.description,
    required this.category,
    this.difficulty,
    required this.durationDays,
    required this.durationNights,
    this.highlights,
    this.inclusions,
    this.exclusions,
    required this.location,
    required this.price,
    this.dates,
    this.itinerary,
    this.thumbnail,
  });

  factory TripModel.fromJson(Map<String, dynamic> json) => _$TripModelFromJson(json);
  Map<String, dynamic> toJson() => _$TripModelToJson(this);
}

@JsonSerializable()
class TripLocationModel {
  final String city;
  final String? state;
  final String country;

  TripLocationModel({
    required this.city,
    this.state,
    required this.country,
  });

  factory TripLocationModel.fromJson(Map<String, dynamic> json) => _$TripLocationModelFromJson(json);
  Map<String, dynamic> toJson() => _$TripLocationModelToJson(this);
}

@JsonSerializable()
class TripPriceModel {
  final num amount;
  final String? currency;
  final num? originalPrice;

  TripPriceModel({
    required this.amount,
    this.currency,
    this.originalPrice,
  });

  factory TripPriceModel.fromJson(Map<String, dynamic> json) => _$TripPriceModelFromJson(json);
  Map<String, dynamic> toJson() => _$TripPriceModelToJson(this);
}

@JsonSerializable()
class TripDateModel {
  final String id;
  final DateTime startDate;
  final DateTime endDate;
  final num price;
  final int totalSeats;

  TripDateModel({
    required this.id,
    required this.startDate,
    required this.endDate,
    required this.price,
    required this.totalSeats,
  });

  factory TripDateModel.fromJson(Map<String, dynamic> json) => _$TripDateModelFromJson(json);
  Map<String, dynamic> toJson() => _$TripDateModelToJson(this);
}

@JsonSerializable()
class TripItineraryModel {
  final int dayNumber;
  final String title;
  final String? description;

  TripItineraryModel({
    required this.dayNumber,
    required this.title,
    this.description,
  });

  factory TripItineraryModel.fromJson(Map<String, dynamic> json) => _$TripItineraryModelFromJson(json);
  Map<String, dynamic> toJson() => _$TripItineraryModelToJson(this);
}

@JsonSerializable()
class TripMediaModel {
  final String url;

  TripMediaModel({required this.url});

  factory TripMediaModel.fromJson(Map<String, dynamic> json) => _$TripMediaModelFromJson(json);
  Map<String, dynamic> toJson() => _$TripMediaModelToJson(this);
}
