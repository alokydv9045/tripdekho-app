import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/theme/app_colors.dart';
import 'trip_card.dart';
import 'package:go_router/go_router.dart';
import '../providers/trip_provider.dart';

class UpcomingTrips extends ConsumerWidget {
  const UpcomingTrips({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Fetch upcoming trips (we can pass a limit or category later, using null for now to get all)
    final tripsAsync = ref.watch(fetchTripsProvider(category: null, search: null));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Upcoming Trips', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.darkText)),
              TextButton(
                onPressed: () => context.push('/trips'),
                child: const Text('View All', style: TextStyle(color: AppColors.primaryYellow, fontWeight: FontWeight.bold)),
              )
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 280, // Height for the trip card
          child: tripsAsync.when(
            data: (trips) {
              if (trips.isEmpty) {
                return const Center(child: Text('No upcoming trips right now.', style: TextStyle(color: AppColors.grey500)));
              }
              // Only take top 5 for home screen
              final displayTrips = trips.take(5).toList();
              return ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: displayTrips.length,
                itemBuilder: (context, index) {
                  final trip = displayTrips[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 16),
                    child: SizedBox(
                      width: 260,
                      child: TripCard(
                        title: trip.title,
                        location: '${trip.location.city}, ${trip.location.country}',
                        price: trip.price.amount.toDouble(),
                        duration: '${trip.durationNights}n ${trip.durationDays}d',
                        rating: 4.8, // placeholder
                        reviewsCount: 120, // placeholder
                        imageUrl: trip.thumbnail?.url ?? 'https://res.cloudinary.com/dphw0c5r5/image/upload/v1719665671/india-hero_xkf3c8.jpg',
                        onTap: () => context.push('/trips/${trip.id}'),
                      ),
                    ),
                  );
                },
              );
            },
            loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primaryYellow)),
            error: (err, stack) => Center(child: Text('Error loading trips', style: TextStyle(color: AppColors.redBadge))),
          ),
        )
      ],
    );
  }
}
