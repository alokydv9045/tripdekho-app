import 'package:dio/dio.dart';
import '../models/trip_model.dart';

class TripRepository {
  final Dio _dio;

  TripRepository(this._dio);

  Future<List<TripModel>> getTrips({int page = 1, int limit = 10, String? category, String? search}) async {
    try {
      final response = await _dio.get(
        '/trips',
        queryParameters: {
          'page': page,
          'limit': limit,
          'category': ?category,
          'search': ?search,
        },
      );
      
      if (response.data != null && response.data['data'] != null) {
        final List<dynamic> tripsJson = response.data['data']['items'] ?? response.data['data'];
        return tripsJson.map((json) => TripModel.fromJson(json)).toList();
      }
      return [];
    } catch (e) {
      // Return empty list on failure for now
      return [];
    }
  }

  Future<TripModel?> getTripById(String id) async {
    try {
      final response = await _dio.get('/trips/$id');
      if (response.data != null && response.data['data'] != null) {
        return TripModel.fromJson(response.data['data']);
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
