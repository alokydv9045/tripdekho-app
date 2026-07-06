// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'blog_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

BlogModel _$BlogModelFromJson(Map<String, dynamic> json) => BlogModel(
  id: json['id'] as String,
  title: json['title'] as String,
  coverImage: json['coverImage'] as String?,
  excerpt: json['excerpt'] as String?,
  authorName: json['authorName'] as String?,
  authorAvatar: json['authorAvatar'] as String?,
  publishedAt: json['publishedAt'] == null
      ? null
      : DateTime.parse(json['publishedAt'] as String),
  readTimeMinutes: (json['readTimeMinutes'] as num?)?.toInt(),
);

Map<String, dynamic> _$BlogModelToJson(BlogModel instance) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'coverImage': instance.coverImage,
  'excerpt': instance.excerpt,
  'authorName': instance.authorName,
  'authorAvatar': instance.authorAvatar,
  'publishedAt': instance.publishedAt?.toIso8601String(),
  'readTimeMinutes': instance.readTimeMinutes,
};
