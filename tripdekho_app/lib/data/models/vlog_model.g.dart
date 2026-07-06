// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'vlog_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VlogModel _$VlogModelFromJson(Map<String, dynamic> json) => VlogModel(
  id: json['id'] as String,
  title: json['title'] as String,
  videoUrl: json['videoUrl'] as String,
  thumbnailUrl: json['thumbnailUrl'] as String?,
  description: json['description'] as String?,
);

Map<String, dynamic> _$VlogModelToJson(VlogModel instance) => <String, dynamic>{
  'id': instance.id,
  'title': instance.title,
  'videoUrl': instance.videoUrl,
  'thumbnailUrl': instance.thumbnailUrl,
  'description': instance.description,
};
