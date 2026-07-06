import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../widgets/hero_carousel.dart';
import '../widgets/reveal_on_scroll.dart';
import '../widgets/upcoming_trips.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            floating: true,
            title: const Text('TripDekho', style: TextStyle(fontWeight: FontWeight.bold)),
            actions: [
              IconButton(icon: const Icon(Icons.notifications_outlined), onPressed: () {}),
              IconButton(icon: const Icon(Icons.person_outline), onPressed: () {}),
            ],
          ),
          SliverToBoxAdapter(
            child: Column(
              children: [
                const HeroCarousel(),
                const SizedBox(height: 32),
                const RevealOnScroll(
                  child: UpcomingTrips(),
                ),
                RevealOnScroll(
                  child: Container(
                    height: 200,
                    margin: const EdgeInsets.all(16),
                    color: Colors.blue.shade100,
                    alignment: Alignment.center,
                    child: const Text('Categories Section Placeholder'),
                  ),
                ),
                const SizedBox(height: 100),
              ],
            ),
          )
        ],
      ),
    );
  }
}
