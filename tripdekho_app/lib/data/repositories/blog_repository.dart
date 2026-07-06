import 'package:dio/dio.dart';
import '../models/blog_model.dart';

class BlogRepository {
  final Dio _dio;

  BlogRepository(this._dio);

  Future<List<BlogModel>> getBlogs({int limit = 10}) async {
    try {
      final response = await _dio.get('/cms/blogs', queryParameters: {'limit': limit});
      if (response.data != null) {
        var data = response.data['data'] ?? response.data;
        if (data is Map && data.containsKey('items')) {
          data = data['items'];
        } else if (data is Map && data.containsKey('blogs')) {
          data = data['blogs'];
        }
        
        if (data is List) {
          return data.map((json) => BlogModel.fromJson(json)).toList();
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}
