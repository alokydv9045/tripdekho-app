import 'package:flutter/foundation.dart';

class ApiEndpoints {
  // Base URL
  static String get baseUrl => kIsWeb ? 'http://127.0.0.1:5001/api/v2' : 'http://10.0.2.2:5001/api/v2';
  
  // Auth
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String profile = '/auth/profile';

  // Trips
  static const String trips = '/trips';
  static const String featuredTrips = '/trips/featured';
  static String tripDetails(String id) => '/trips/$id';

  // Bookings
  static const String bookings = '/bookings';
  static String bookingDetails(String id) => '/bookings/$id';
}
