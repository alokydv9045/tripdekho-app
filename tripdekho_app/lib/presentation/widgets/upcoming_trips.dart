import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import 'trip_card.dart';
import 'section_header.dart';
import 'package:go_router/go_router.dart';
import '../providers/trip_provider.dart';
import 'package:intl/intl.dart';

class UpcomingTrips extends ConsumerWidget {
  const UpcomingTrips({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Fetch upcoming trips (we can just fetch all trips for now and maybe limit on UI side if needed)
    final tripsAsync = ref.watch(allTripsProvider({'category': '', 'search': ''}));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHeader(
          title: 'Upcoming',
          highlightText: 'Trips',
          viewAllText: 'View All →',
          onViewAll: () => context.push('/trips'),
        ),
        const SizedBox(height: 16),

        tripsAsync.when(
          data: (trips) {
            if (trips.isEmpty) {
              return Container(
                height: 100,
                alignment: Alignment.center,
                child: const Text('No upcoming trips right now.', style: TextStyle(color: AppColors.grey500)),
              );
            }
            // Only take top 5 for home screen
            final displayTrips = trips.take(5).toList();
            return SizedBox(
              height: 480,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
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
                        originalPrice: null,
                        duration: '4n 5d',
                        rating: trip.rating,
                        reviewsCount: trip.reviews,
                        imageUrl: trip.imageUrl,
                        slug: trip.id,
                        categories: null,
                        dates: null,
                        onTap: () => context.push('/trip/${trip.id}'),
                      ),
                    ),
                  );
                },
              ),
            );
          },
          loading: () => const SizedBox(
            height: 480,
            child: Center(child: CircularProgressIndicator(color: AppColors.goldPrimary)),
          ),
          error: (err, stack) => SizedBox(
            height: 100,
            child: Center(child: Text('Error loading trips', style: TextStyle(color: AppColors.error))),
          ),
        )
      ],
    );
  }
}
