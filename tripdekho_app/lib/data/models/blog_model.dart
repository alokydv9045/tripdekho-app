import 'package:json_annotation/json_annotation.dart';

part 'blog_model.g.dart';

@JsonSerializable()
class BlogModel {
  final String id;
  final String title;
  final String? coverImage;
  final String? excerpt;
  final String? authorName;
  final String? authorAvatar;
  final DateTime? publishedAt;
  final int? readTimeMinutes;

  BlogModel({
    required this.id,
    required this.title,
    this.coverImage,
    this.excerpt,
    this.authorName,
    this.authorAvatar,
    this.publishedAt,
    this.readTimeMinutes,
  });

  factory BlogModel.fromJson(Map<String, dynamic> json) => _$BlogModelFromJson(json);
  Map<String, dynamic> toJson() => _$BlogModelToJson(this);
}
