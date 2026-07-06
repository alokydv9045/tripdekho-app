import 'package:dio/dio.dart';
import '../models/booking_model.dart';

class BookingRepository {
  final Dio _dio;

  BookingRepository(this._dio);

  Future<List<BookingModel>> getMyBookings() async {
    try {
      final response = await _dio.get('/bookings/my-bookings');
      if (response.data != null) {
        var data = response.data['data'] ?? response.data;
        if (data is Map && data.containsKey('items')) {
          data = data['items'];
        } else if (data is Map && data.containsKey('bookings')) {
          data = data['bookings'];
        }
        
        if (data is List) {
          return data.map((json) => BookingModel.fromJson(json)).toList();
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<BookingModel?> getBookingById(String id) async {
    try {
      final response = await _dio.get('/bookings/$id');
      if (response.data != null) {
        var data = response.data['data'] ?? response.data;
        if (data is Map && data.containsKey('booking')) {
          data = data['booking'];
        }
        return BookingModel.fromJson(data);
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
