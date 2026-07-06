import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';
import '../widgets/upcoming_trips.dart';
import '../widgets/india_on_wheels_section.dart';
import '../widgets/trip_category_section.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark,
      child: Scaffold(
        backgroundColor: AppColors.bgCream,
        body: Stack(
          children: [
            CustomScrollView(
              physics: const BouncingScrollPhysics(),
              slivers: [
                // ── App Bar ─────────────────────────────────────────────
                SliverAppBar(
                  floating: true,
                  snap: true,
                  backgroundColor: AppColors.bgCream,
                  elevation: 0,
                  scrolledUnderElevation: 0,
                  title: Row(
                    children: [
                      Image.asset(
                        'assets/images/bg-logo.png',
                        height: 48,
                        fit: BoxFit.contain,
                      ),
                    ],
                  ),
                  actions: [
                    Container(
                      margin: const EdgeInsets.only(right: 16),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withAlpha(10),
                            blurRadius: 10,
                            offset: const Offset(0, 2),
                          )
                        ],
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.menu_rounded, color: AppColors.darkText),
                        onPressed: () {},
                      ),
                    ),
                  ],
                ),

                // ── Hero Section (Search) ────────────────────────────────
                const SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(16, 16, 16, 32),
                    child: _HeroSearchSection(),
                  ),
                ),

                // ── Upcoming Trips ────────────────────────────────────────
                const SliverToBoxAdapter(child: UpcomingTrips()),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Trips Near Bareilly ───────────────────────────────────
                const SliverToBoxAdapter(
                  child: TripCategorySection(
                    title: 'Trips Near',
                    highlightText: 'Bareilly',
                    icon: Icons.location_on_outlined,
                    tags: 'near-bareilly',
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Live Weather Forecasts ──────────────────────────────
                const SliverToBoxAdapter(child: _LiveWeatherSection()),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── India on Wheels ───────────────────────────────────────
                const SliverToBoxAdapter(child: IndiaOnWheelsSection()),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Destinations ──────────────────────────────────────────
                const SliverToBoxAdapter(
                  child: IndiaOnWheelsSection(
                    titlePrefix: 'Destinations',
                    titleHighlight: '',
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Budget Friendly ────────────────────────────────────────
                const SliverToBoxAdapter(
                  child: TripCategorySection(
                    title: 'Budget',
                    highlightText: 'Friendly',
                    tags: 'budget-stay',
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Weekend Escapes ────────────────────────────────────────
                const SliverToBoxAdapter(
                  child: TripCategorySection(
                    title: 'Weekend',
                    highlightText: 'Escapes',
                    tags: 'weekend',
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Top Trips For You ──────────────────────────────────────
                const SliverToBoxAdapter(
                  child: TripCategorySection(
                    title: 'Top Trips',
                    highlightText: 'For You',
                    category: 'top-trips',
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Explore Offbeat ────────────────────────────────────────
                const SliverToBoxAdapter(
                  child: TripCategorySection(
                    title: 'Explore',
                    highlightText: 'Offbeat',
                    tags: 'offbeat',
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Mountains ──────────────────────────────────────────────
                const SliverToBoxAdapter(
                  child: TripCategorySection(
                    title: 'Mountains',
                    category: 'mountain',
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Beach ──────────────────────────────────────────────────
                const SliverToBoxAdapter(
                  child: TripCategorySection(
                    title: 'Beach',
                    highlightText: 'Destinations',
                    category: 'beach',
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Spiritual ──────────────────────────────────────────────
                const SliverToBoxAdapter(
                  child: TripCategorySection(
                    title: 'Spiritual',
                    highlightText: 'Journeys',
                    category: 'spiritual',
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Heritage ───────────────────────────────────────────────
                const SliverToBoxAdapter(
                  child: TripCategorySection(
                    title: 'Heritage',
                    highlightText: '& Culture',
                    category: 'heritage',
                  ),
                ),
                const SliverToBoxAdapter(child: SizedBox(height: 100)), // Bottom padding for FABs
              ],
            ),

            // ── Floating Action Buttons ──────────────────────────────
            Positioned(
              right: 16,
              bottom: 32,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Scroll to top arrow
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF59E0B),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(color: Colors.black.withAlpha(20), blurRadius: 10, offset: const Offset(0, 4))
                      ]
                    ),
                    child: const Icon(Icons.keyboard_arrow_up_rounded, color: Colors.white),
                  ),
                  const SizedBox(height: 12),
                  // WhatsApp FAB
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: const Color(0xFF25D366),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(color: const Color(0xFF25D366).withAlpha(80), blurRadius: 12, offset: const Offset(0, 4))
                      ]
                    ),
                    child: const Icon(Icons.chat_bubble_outline_rounded, color: Colors.white, size: 24), // Approx whatsapp
                  ),
                  const SizedBox(height: 12),
                  // Call FAB
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: const Color(0xFF06B6D4), // Cyan
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(color: const Color(0xFF06B6D4).withAlpha(80), blurRadius: 12, offset: const Offset(0, 4))
                      ]
                    ),
                    child: const Icon(Icons.phone_in_talk_rounded, color: Colors.white, size: 24),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HeroSearchSection extends StatelessWidget {
  const _HeroSearchSection();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFF6C825), // Exact yellow from image
        borderRadius: BorderRadius.circular(24),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Find Your\nDream Trip',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 32,
              fontWeight: FontWeight.w900,
              height: 1.1,
              color: AppColors.darkText,
              letterSpacing: -1.0,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Get instant suggestions for your\nnext adventure',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: AppColors.surfaceVariantText,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 24),

          // Inner Search Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFAEDC6), // Light cream yellow
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                // Destination Dropdown
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.location_on_outlined, color: AppColors.grey500, size: 20),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'DESTINATION',
                          style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, fontSize: 13, letterSpacing: 0.5, color: AppColors.darkText),
                        ),
                      ),
                      const Icon(Icons.keyboard_arrow_down_rounded, color: AppColors.darkText),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                // Pickup Dropdown
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.location_on_outlined, color: AppColors.grey500, size: 20),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'PICKUP',
                          style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, fontSize: 13, letterSpacing: 0.5, color: AppColors.darkText),
                        ),
                      ),
                      const Icon(Icons.keyboard_arrow_down_rounded, color: AppColors.darkText),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // Search Button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF1B700),
                      foregroundColor: AppColors.darkText,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(
                      'SEARCH',
                      style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 14, letterSpacing: 1.0),
                    ),
                  ),
                )
              ],
            ),
          ),
          
          const SizedBox(height: 24),
          
          // Stats Row
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Rating Stat
              Column(
                children: [
                  Row(
                    children: [
                      const Icon(Icons.star_rounded, color: Color(0xFF059669), size: 22), // Green star
                      const SizedBox(width: 6),
                      Text(
                        '4.0/5',
                        style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 18, color: AppColors.darkText),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Based on\nReviews',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, fontSize: 12, color: AppColors.surfaceVariantText, height: 1.2),
                  )
                ],
              ),
              
              // Divider
              Container(
                margin: const EdgeInsets.symmetric(horizontal: 24),
                height: 40,
                width: 1,
                color: AppColors.outline.withAlpha(40),
              ),
              
              // Happy Customers Stat
              Column(
                children: [
                  const Icon(Icons.favorite_rounded, color: Color(0xFFE11D48), size: 20), // Red heart
                  const SizedBox(height: 6),
                  Text(
                    'Happy\nCustomers',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, fontSize: 12, color: AppColors.surfaceVariantText, height: 1.2),
                  )
                ],
              ),
            ],
          )
        ],
      ),
    );
  }
}

class _LiveWeatherSection extends StatelessWidget {
  const _LiveWeatherSection();

  @override
  Widget build(BuildContext context) {
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

          // Weather Cards
          _WeatherCard(
            city: 'Manali',
            temp: '13°C',
            condition: 'Light rain shower',
            mainIcon: Icons.cloudy_snowing,
            iconColor: const Color(0xFFD97706),
            iconBg: const Color(0xFFFFF7E6),
            forecasts: const [
              _ForecastMiniCard(day: 'Today', temp: '13°', icon: Icons.cloudy_snowing),
              _ForecastMiniCard(day: 'Tue', temp: '13°', icon: Icons.cloudy_snowing),
              _ForecastMiniCard(day: 'Wed', temp: '12°', icon: Icons.cloudy_snowing),
            ],
          ),
          const SizedBox(height: 16),
          _WeatherCard(
            city: 'Goa',
            temp: '27°C',
            condition: 'Moderate or heavy rain shower',
            mainIcon: Icons.water_drop_rounded,
            iconColor: const Color(0xFF0EA5E9),
            iconBg: const Color(0xFFE0F2FE),
            forecasts: const [
              _ForecastMiniCard(day: 'Today', temp: '27°', icon: Icons.water_drop_rounded),
              _ForecastMiniCard(day: 'Tue', temp: '28°', icon: Icons.water_drop_rounded),
              _ForecastMiniCard(day: 'Wed', temp: '27°', icon: Icons.water_drop_rounded),
            ],
          ),
          const SizedBox(height: 16),
          _WeatherCard(
            city: 'Jaipur',
            temp: '33°C',
            condition: 'Mist',
            mainIcon: Icons.air_rounded,
            iconColor: const Color(0xFFD97706),
            iconBg: const Color(0xFFFFF7E6),
            forecasts: const [
              _ForecastMiniCard(day: 'Today', temp: '39°', icon: Icons.cloud_queue_rounded),
              _ForecastMiniCard(day: 'Tue', temp: '37°', icon: Icons.cloud_queue_rounded),
              _ForecastMiniCard(day: 'Wed', temp: '34°', icon: Icons.cloud_queue_rounded),
            ],
          ),
          const SizedBox(height: 16),
          _WeatherCard(
            city: 'Gulmarg',
            temp: '26°C',
            condition: 'Sunny',
            mainIcon: Icons.wb_sunny_rounded,
            iconColor: const Color(0xFFF59E0B),
            iconBg: const Color(0xFFFFFBEB),
            forecasts: const [
              _ForecastMiniCard(day: 'Today', temp: '26°', icon: Icons.cloud_queue_rounded),
              _ForecastMiniCard(day: 'Tue', temp: '24°', icon: Icons.cloud_queue_rounded),
              _ForecastMiniCard(day: 'Wed', temp: '22°', icon: Icons.cloud_queue_rounded),
            ],
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
              forecasts[0],
              const SizedBox(width: 12),
              forecasts[1],
              const SizedBox(width: 12),
              forecasts[2],
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


