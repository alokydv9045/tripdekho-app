import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../providers/trip_provider.dart';
import '../../widgets/trip_card.dart';

class VendorTripsScreen extends ConsumerWidget {
  const VendorTripsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final tripsAsyncValue = ref.watch(vendorTripsProvider);

    return Scaffold(
      backgroundColor: theme.colorScheme.surface,
      appBar: AppBar(
        title: const Text('My Listings'),
        backgroundColor: theme.colorScheme.surface,
        elevation: 0,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/vendor/add-trip'),
        backgroundColor: theme.colorScheme.primary,
        child: const Icon(Icons.add),
      ),
      body: tripsAsyncValue.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Error: $error')),
        data: (trips) {
          if (trips.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.landscape, size: 64, color: theme.colorScheme.onSurface.withOpacity(0.5)),
                  const SizedBox(height: 16),
                  Text(
                    'No trips listed yet',
                    style: theme.textTheme.titleLarge?.copyWith(
                      color: theme.colorScheme.onSurface.withOpacity(0.5),
                    ),
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => context.push('/vendor/add-trip'),
                    child: const Text('Create Your First Trip'),
                  )
                ],
              ),
            ).animate().fade();
          }

          return RefreshIndicator(
            onRefresh: () async {
              ref.refresh(vendorTripsProvider);
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: trips.length,
              itemBuilder: (context, index) {
                final trip = trips[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16.0),
                  child: TripCard(
                    title: trip.title,
                    location: trip.location,
                    price: trip.price,
                    originalPrice: null,
                    duration: '4n 5d', // Placeholder
                    rating: trip.rating,
                    reviewsCount: trip.reviews,
                    imageUrl: trip.imageUrl,
                    slug: trip.id,
                    categories: null,
                    dates: null,
                    onTap: () {
                      // Vendor shouldn't book their own trip, maybe open edit screen?
                      // context.push('/vendor/edit-trip/${trip.id}');
                    },
                  ).animate().fade(delay: (index * 100).ms).slideY(begin: 0.1),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
