import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import 'trip_card.dart';
import 'section_header.dart';
import 'package:go_router/go_router.dart';
import '../providers/trip_provider.dart';
import 'package:intl/intl.dart';

class TripCategorySection extends ConsumerWidget {
  final String title;
  final String? highlightText;
  final IconData? icon;
  final String? category;
  final String? tags;
  final String? viewAllRoute;

  const TripCategorySection({
    super.key,
    required this.title,
    this.highlightText,
    this.icon,
    this.category,
    this.tags,
    this.viewAllRoute,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch trips based on filters. Limit to 8 by default as per the web design.
    final tripsAsync = ref.watch(allTripsProvider({'category': category ?? '', 'search': tags ?? ''}));
    // Always fetch a fallback set of all trips so we never show empty sections
    final allTripsAsync = ref.watch(allTripsProvider({'category': '', 'search': ''}));

    return tripsAsync.when(
      data: (trips) {
        // If filtered trips are empty, fall back to all trips (same as web behavior)
        final displayTrips = trips.isNotEmpty ? trips : (allTripsAsync.valueOrNull ?? []);

        if (displayTrips.isEmpty) {
          // If even all trips are empty, show nothing
          return const SizedBox.shrink();
        }

        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 4),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SectionHeader(
                title: title,
                highlightText: highlightText,
                icon: icon,
                viewAllText: 'View All →',
                onViewAll: viewAllRoute != null
                    ? () => context.push(viewAllRoute!)
                    : () => context.push('/trips'),
              ),
              const SizedBox(height: 16),

              SizedBox(
                height: 480,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: displayTrips.length,
                  itemBuilder: (context, index) {
                    final trip = displayTrips[index];
                    return Padding(
                      padding: const EdgeInsets.only(right: 16),
                      child: SizedBox(
                        width: 270,
                        child: TripCard(
                          title: trip.title,
                          location: trip.location,
                          price: trip.price,
                          originalPrice: null, // Removed from entity
                          duration: '4n 5d', // Placeholder
                          rating: trip.rating,
                          reviewsCount: trip.reviews,
                          imageUrl: trip.imageUrl,
                          slug: trip.id,
                          categories: category != null ? [category!] : null,
                          dates: null,
                          onTap: () => context.push('/trip/${trip.id}'),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
      loading: () => const SizedBox(
        height: 200,
        child: Center(child: CircularProgressIndicator(color: AppColors.goldPrimary)),
      ),
      error: (err, stack) => const SizedBox.shrink(),
    );
  }
}
