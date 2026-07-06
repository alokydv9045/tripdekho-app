import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class WeatherModel {
  final String city;
  final String currentTemp;
  final String currentCondition;
  final IconData currentIcon;
  final Color iconColor;
  final Color iconBg;
  final List<ForecastModel> forecasts;

  WeatherModel({
    required this.city,
    required this.currentTemp,
    required this.currentCondition,
    required this.currentIcon,
    required this.iconColor,
    required this.iconBg,
    required this.forecasts,
  });
}

class ForecastModel {
  final String day;
  final String temp;
  final IconData icon;

  ForecastModel({
    required this.day,
    required this.temp,
    required this.icon,
  });
}

class WeatherHelper {
  static Map<String, dynamic> getWeatherDetails(int code) {
    if (code == 0) {
      return {
        'condition': 'Clear sky',
        'icon': Icons.wb_sunny_rounded,
        'color': const Color(0xFFF59E0B),
        'bg': const Color(0xFFFFFBEB),
      };
    } else if (code == 1 || code == 2 || code == 3) {
      return {
        'condition': 'Partly cloudy',
        'icon': Icons.cloud_queue_rounded,
        'color': const Color(0xFFD97706),
        'bg': const Color(0xFFFFF7E6),
      };
    } else if (code >= 45 && code <= 48) {
      return {
        'condition': 'Fog / Mist',
        'icon': Icons.air_rounded,
        'color': const Color(0xFF6B7280),
        'bg': const Color(0xFFF3F4F6),
      };
    } else if (code >= 51 && code <= 67) {
      return {
        'condition': 'Rain shower',
        'icon': Icons.water_drop_rounded,
        'color': const Color(0xFF0EA5E9),
        'bg': const Color(0xFFE0F2FE),
      };
    } else if (code >= 71 && code <= 86) {
      return {
        'condition': 'Snow fall',
        'icon': Icons.cloudy_snowing,
        'color': const Color(0xFF6366F1),
        'bg': const Color(0xFFE0E7FF),
      };
    } else {
      return {
        'condition': 'Thunderstorm',
        'icon': Icons.thunderstorm_rounded,
        'color': const Color(0xFF7C3AED),
        'bg': const Color(0xFFEDE9FE),
      };
    }
  }
}
