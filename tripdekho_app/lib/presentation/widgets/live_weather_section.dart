import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';
import '../providers/weather_provider.dart';

class LiveWeatherSection extends ConsumerWidget {
  const LiveWeatherSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final weatherAsync = ref.watch(fetchWeatherProvider);

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.symmetric(vertical: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Cursive Header
          Text(
            'Live Weather Forecasts',
            style: GoogleFonts.caveat(
              fontSize: 36,
              fontWeight: FontWeight.w700,
              color: AppColors.darkText,
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Check the live weather and upcoming 3-day forecast for some of our most popular destinations before you pack your bags!',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.surfaceVariantText,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 24),

          weatherAsync.when(
            data: (weatherList) {
              if (weatherList.isEmpty) {
                return const SizedBox.shrink();
              }
              return Column(
                children: weatherList.map((weather) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: _WeatherCard(
                      city: weather.city,
                      temp: weather.currentTemp,
                      condition: weather.currentCondition,
                      mainIcon: weather.currentIcon,
                      iconColor: weather.iconColor,
                      iconBg: weather.iconBg,
                      forecasts: weather.forecasts.map((f) => _ForecastMiniCard(
                        day: f.day,
                        temp: f.temp,
                        icon: f.icon,
                      )).toList(),
                    ),
                  );
                }).toList(),
              );
            },
            loading: () => const Center(
              child: Padding(
                padding: EdgeInsets.all(32),
                child: CircularProgressIndicator(color: AppColors.goldPrimary),
              ),
            ),
            error: (err, stack) => const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}

class _WeatherCard extends StatelessWidget {
  final String city;
  final String temp;
  final String condition;
  final IconData mainIcon;
  final Color iconColor;
  final Color iconBg;
  final List<_ForecastMiniCard> forecasts;

  const _WeatherCard({
    required this.city,
    required this.temp,
    required this.condition,
    required this.mainIcon,
    required this.iconColor,
    required this.iconBg,
    required this.forecasts,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withAlpha(10), blurRadius: 20, offset: const Offset(0, 10))
        ]
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('LIVE WEATHER', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 10, color: AppColors.textMuted, letterSpacing: 1.5)),
                  const SizedBox(height: 4),
                  Text(city, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 20, color: AppColors.darkText)),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: iconBg,
                  shape: BoxShape.circle,
                ),
                child: Icon(mainIcon, color: iconColor),
              )
            ],
          ),
          const SizedBox(height: 16),
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Text(temp, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 42, color: AppColors.darkText, height: 1.0)),
              const SizedBox(width: 12),
              Expanded(
                child: Text(condition, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, fontSize: 13, color: AppColors.surfaceVariantText, height: 1.3)),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Text('FORECAST', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 10, color: AppColors.textMuted, letterSpacing: 1.5)),
          const SizedBox(height: 12),
          Row(
            children: [
              if (forecasts.isNotEmpty) forecasts[0],
              if (forecasts.isNotEmpty) const SizedBox(width: 12),
              if (forecasts.length > 1) forecasts[1],
              if (forecasts.length > 1) const SizedBox(width: 12),
              if (forecasts.length > 2) forecasts[2],
            ],
          )
        ],
      ),
    );
  }
}

class _ForecastMiniCard extends StatelessWidget {
  final String day;
  final String temp;
  final IconData icon;

  const _ForecastMiniCard({required this.day, required this.temp, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xFFF9FAFB),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Text(day, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, fontSize: 12, color: AppColors.surfaceVariantText)),
            const SizedBox(height: 6),
            Icon(icon, color: AppColors.grey500, size: 20),
            const SizedBox(height: 6),
            Text(temp, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 15, color: AppColors.darkText)),
          ],
        ),
      ),
    );
  }
}
