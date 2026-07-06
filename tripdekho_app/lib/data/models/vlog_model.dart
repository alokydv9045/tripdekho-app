import 'package:json_annotation/json_annotation.dart';

part 'vlog_model.g.dart';

@JsonSerializable()
class VlogModel {
  final String id;
  final String title;
  final String videoUrl;
  final String? thumbnailUrl;
  final String? description;

  VlogModel({
    required this.id,
    required this.title,
    required this.videoUrl,
    this.thumbnailUrl,
    this.description,
  });

  factory VlogModel.fromJson(Map<String, dynamic> json) => _$VlogModelFromJson(json);
  Map<String, dynamic> toJson() => _$VlogModelToJson(this);
}
