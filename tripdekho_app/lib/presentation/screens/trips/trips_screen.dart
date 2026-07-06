import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/trip_card.dart';
import 'package:go_router/go_router.dart';
import '../../providers/trip_provider.dart';

class TripsScreen extends ConsumerStatefulWidget {
  const TripsScreen({super.key});

  @override
  ConsumerState<TripsScreen> createState() => _TripsScreenState();
}

class _TripsScreenState extends ConsumerState<TripsScreen> {
  final List<String> _filters = ['All', 'Adventure', 'Relaxing', 'Nature', 'Culture', 'Wildlife'];
  String _selectedFilter = 'All';

  @override
  Widget build(BuildContext context) {
    // Determine category to fetch
    final category = _selectedFilter == 'All' ? null : _selectedFilter;
    // Watch the live trips provider
    final tripsAsyncValue = ref.watch(fetchTripsProvider(category: category, search: null));

    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('Explore Trips', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => context.push('/search'),
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Chips
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _filters.map((filter) {
                  final isSelected = filter == _selectedFilter;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ChoiceChip(
                      label: Text(filter, style: TextStyle(color: isSelected ? AppColors.darkText : AppColors.grey500)),
                      selected: isSelected,
                      selectedColor: AppColors.primaryYellow,
                      backgroundColor: Colors.white,
                      onSelected: (selected) {
                        if (selected) setState(() => _selectedFilter = filter);
                      },
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          
          // Trips List
          Expanded(
            child: tripsAsyncValue.when(
              data: (trips) {
                if (trips.isEmpty) {
                  return const Center(
                    child: Text('No trips found for this category.', style: TextStyle(color: AppColors.grey500)),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: trips.length,
                  itemBuilder: (context, index) {
                    final trip = trips[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: TripCard(
                        title: trip.title,
                        location: '${trip.location.city}, ${trip.location.state ?? trip.location.country}',
                        price: trip.price.amount.toDouble(),
                        duration: '${trip.durationNights}n ${trip.durationDays}d',
                        rating: 4.5, // placeholder
                        reviewsCount: 0,
                        imageUrl: trip.thumbnail?.url ?? 'https://res.cloudinary.com/dphw0c5r5/image/upload/v1719665671/india-hero_xkf3c8.jpg',
                        onTap: () => context.push('/trips/${trip.id}'),
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primaryYellow)),
              error: (err, stack) => Center(child: Text('Error: $err')),
            ),
          )
        ],
      ),
    );
  }
}
