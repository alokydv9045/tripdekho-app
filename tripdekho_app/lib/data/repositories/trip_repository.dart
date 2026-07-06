import 'package:dio/dio.dart';
import '../models/trip_model.dart';

class TripRepository {
  final Dio _dio;

  TripRepository(this._dio);

  Future<List<TripModel>> getTrips({int page = 1, int limit = 10, String? category, String? search, String? tags}) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit,
      };
      if (category != null && category.isNotEmpty) queryParams['category'] = category;
      if (search != null && search.isNotEmpty) queryParams['search'] = search;
      if (tags != null && tags.isNotEmpty) queryParams['tags'] = tags;

      final response = await _dio.get(
        '/trips',
        queryParameters: queryParams,
      );
      
      if (response.data != null) {
        var data = response.data['data'] ?? response.data;
        if (data is Map && data.containsKey('items')) {
          data = data['items'];
        } else if (data is Map && data.containsKey('trips')) {
          data = data['trips'];
        }
        
        if (data is List) {
          return data.map((json) => TripModel.fromJson(json)).toList();
        }
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
      if (response.data != null) {
        var data = response.data['data'] ?? response.data;
        if (data is Map && data.containsKey('trip')) {
          data = data['trip'];
        }
        return TripModel.fromJson(data);
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
