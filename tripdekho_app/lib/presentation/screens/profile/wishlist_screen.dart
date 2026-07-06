import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/trip_card.dart';

class WishlistScreen extends StatelessWidget {
  const WishlistScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // In reality, this would read from a Riverpod provider
    final bool isEmpty = false;

    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('My Wishlist', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.favorite_border, size: 64, color: AppColors.grey500),
                  const SizedBox(height: 16),
                  const Text('Your wishlist is empty', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.darkText)),
                  const SizedBox(height: 8),
                  const Text('Save your favorite trips to view them later.', style: TextStyle(color: AppColors.grey500)),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryYellow, foregroundColor: AppColors.darkText),
                    child: const Text('BROWSE TRIPS'),
                  )
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: 4,
              itemBuilder: (context, index) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: TripCard(
                    title: 'Favorite Adventure Trip $index',
                    location: 'Manali, Himachal Pradesh',
                    price: 15000,
                    duration: '4n 5d',
                    rating: 4.8,
                    reviewsCount: 124,
                    imageUrl: 'https://res.cloudinary.com/dphw0c5r5/image/upload/v1719665671/india-hero_xkf3c8.jpg',
                    onTap: () {},
                  ),
                );
              },
            ),
    );
  }
}
