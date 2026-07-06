import 'package:dio/dio.dart';
import '../models/vlog_model.dart';

class VlogRepository {
  final Dio _dio;

  VlogRepository(this._dio);

  Future<List<VlogModel>> getVlogs({int limit = 10}) async {
    try {
      final response = await _dio.get('/cms/vlogs', queryParameters: {'limit': limit});
      if (response.data != null) {
        var data = response.data['data'] ?? response.data;
        if (data is Map && data.containsKey('items')) {
          data = data['items'];
        } else if (data is Map && data.containsKey('vlogs')) {
          data = data['vlogs'];
        }
        
        if (data is List) {
          return data.map((json) => VlogModel.fromJson(json)).toList();
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }
}
