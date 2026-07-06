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
    final tripsAsync = ref.watch(fetchTripsProvider(category: null, search: null));

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
                        location: '${trip.location.city}, ${trip.location.country}',
                        price: trip.price.amount.toDouble(),
                        originalPrice: trip.price.originalPrice?.toDouble(),
                        duration: '${trip.durationNights}n ${trip.durationDays}d',
                        rating: 4.8, // placeholder
                        reviewsCount: 120, // placeholder
                        imageUrl: trip.thumbnail?.url ?? 'assets/images/trips/ladakh.png',
                        slug: trip.slug ?? trip.id,
                        categories: trip.category,
                        dates: trip.dates?.map((d) => DateFormat('MMM d').format(d.startDate)).toList(),
                        onTap: () => context.push('/trips/${trip.slug ?? trip.id}'),
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
