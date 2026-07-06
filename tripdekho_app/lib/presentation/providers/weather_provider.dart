import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import '../../data/models/weather_model.dart';
import 'auth_provider.dart';

part 'weather_provider.g.dart';

final List<Map<String, dynamic>> _cities = [
  {'name': 'Manali', 'lat': 32.2396, 'lon': 77.1887},
  {'name': 'Goa', 'lat': 15.2993, 'lon': 74.1240},
  {'name': 'Jaipur', 'lat': 26.9124, 'lon': 75.7873},
  {'name': 'Gulmarg', 'lat': 34.0484, 'lon': 74.3805},
];

@riverpod
Future<List<WeatherModel>> fetchWeather(FetchWeatherRef ref) async {
  final dio = ref.watch(apiClientProvider).publicDio;
  List<WeatherModel> results = [];
  
  for (var city in _cities) {
    try {
      final response = await dio.get(
        'https://api.open-meteo.com/v1/forecast',
        queryParameters: {
          'latitude': city['lat'],
          'longitude': city['lon'],
          'current': 'temperature_2m,weather_code',
          'daily': 'weather_code,temperature_2m_max',
          'timezone': 'auto',
          'forecast_days': 3,
        },
      );
      
      final data = response.data;
      final currentCode = data['current']['weather_code'] as int;
      final currentTemp = (data['current']['temperature_2m'] as num).round().toString();
      final details = WeatherHelper.getWeatherDetails(currentCode);
      
      final dailyTime = data['daily']['time'] as List;
      final dailyCode = data['daily']['weather_code'] as List;
      final dailyTempMax = data['daily']['temperature_2m_max'] as List;
      
      List<ForecastModel> forecasts = [];
      for (int i = 0; i < 3; i++) {
        final dDetails = WeatherHelper.getWeatherDetails(dailyCode[i] as int);
        String dayName = '';
        if (i == 0) {
          dayName = 'Today';
        } else {
          final date = DateTime.parse(dailyTime[i] as String);
          dayName = DateFormat('E').format(date);
        }
        
        forecasts.add(ForecastModel(
          day: dayName,
          temp: '${(dailyTempMax[i] as num).round()}°',
          icon: dDetails['icon'],
        ));
      }
      
      results.add(WeatherModel(
        city: city['name'] as String,
        currentTemp: '$currentTemp°C',
        currentCondition: details['condition'] as String,
        currentIcon: details['icon'],
        iconColor: details['color'],
        iconBg: details['bg'],
        forecasts: forecasts,
      ));
    } catch (e) {
      // If error, skip or provide fallback
    }
  }
  
  return results;
}
