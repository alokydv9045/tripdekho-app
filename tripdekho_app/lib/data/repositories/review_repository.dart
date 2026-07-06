import 'package:dio/dio.dart';
import '../models/review_model.dart';

class ReviewRepository {
  final Dio _dio;

  ReviewRepository(this._dio);

  Future<List<ReviewModel>> getTopReviews({int limit = 10}) async {
    try {
      final response = await _dio.get('/reviews/top', queryParameters: {'limit': limit});
      if (response.data != null) {
        var data = response.data['data'] ?? response.data;
        if (data is Map && data.containsKey('items')) {
          data = data['items'];
        } else if (data is Map && data.containsKey('reviews')) {
          data = data['reviews'];
        }
        
        if (data is List) {
          return data.map((json) => ReviewModel.fromJson(json)).toList();
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}
