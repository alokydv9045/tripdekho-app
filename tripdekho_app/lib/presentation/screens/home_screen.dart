import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_colors.dart';
import '../widgets/upcoming_trips.dart';
import '../widgets/india_on_wheels_section.dart';
import '../widgets/trip_category_section.dart';
import '../widgets/hero_carousel.dart';
import '../widgets/live_weather_section.dart';
import '../widgets/vibe_with_us_section.dart';
import '../widgets/reviews_section.dart';
import '../widgets/blogs_section.dart';
import '../widgets/partner_with_us_section.dart';
import '../widgets/app_footer.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  final ScrollController _scrollController = ScrollController();

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToTop() {
    _scrollController.animateTo(
      0,
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
    );
  }

  Future<void> _launchUrl(String urlString) async {
    final uri = Uri.parse(urlString);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: SystemUiOverlayStyle.dark,
      child: Scaffold(
        backgroundColor: AppColors.bgCream,
        body: Stack(
          children: [
            CustomScrollView(
              controller: _scrollController,
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
                    padding: EdgeInsets.only(bottom: 32),
                    child: HeroCarousel(),
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
                const SliverToBoxAdapter(child: LiveWeatherSection()),
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

                // ── Vibe With Us ───────────────────────────────────────────
                const SliverToBoxAdapter(child: VibeWithUsSection()),
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

                // ── Hike ───────────────────────────────────────────────────
                const SliverToBoxAdapter(
                  child: TripCategorySection(
                    title: 'Hike',
                    category: 'hike',
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
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Reviews ────────────────────────────────────────────────
                const SliverToBoxAdapter(child: ReviewsSection()),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Blogs ──────────────────────────────────────────────────
                const SliverToBoxAdapter(child: BlogsSection()),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Partner With Us ────────────────────────────────────────
                const SliverToBoxAdapter(child: PartnerWithUsSection()),
                const SliverToBoxAdapter(child: SizedBox(height: 32)),

                // ── Footer ─────────────────────────────────────────────────
                const SliverToBoxAdapter(child: AppFooter()),
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
                  GestureDetector(
                    onTap: _scrollToTop,
                    child: Container(
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
                  ),
                  const SizedBox(height: 12),
                  // WhatsApp FAB
                  GestureDetector(
                    onTap: () => _launchUrl('https://wa.me/918115682129'),
                    child: Container(
                      width: 50,
                      height: 50,
                      decoration: BoxDecoration(
                        color: const Color(0xFF25D366),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(color: const Color(0xFF25D366).withAlpha(80), blurRadius: 12, offset: const Offset(0, 4))
                        ]
                      ),
                      child: const Icon(Icons.chat_bubble_outline_rounded, color: Colors.white, size: 24),
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Call FAB
                  GestureDetector(
                    onTap: () => _launchUrl('tel:+918115682129'),
                    child: Container(
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
