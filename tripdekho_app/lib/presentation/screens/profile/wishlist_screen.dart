import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/trip_card.dart';

class WishlistScreen extends StatelessWidget {
  const WishlistScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // In reality, this would read from a Riverpod provider
    final bool isEmpty = true;

    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        backgroundColor: AppColors.bgCream,
        elevation: 0,
        scrolledUnderElevation: 0,
        iconTheme: const IconThemeData(color: AppColors.darkText),
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Page Header
                  Text(
                    'SAVED ADVENTURES',
                    style: GoogleFonts.spaceMono(fontWeight: FontWeight.w700, fontSize: 10, color: AppColors.amber500, letterSpacing: 2.0),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Transform.rotate(
                        angle: -0.05,
                        child: Text(
                          'My ',
                          style: GoogleFonts.caveat(fontSize: 36, color: AppColors.amber500),
                        ),
                      ),
                      Text(
                        'WISHLIST',
                        style: GoogleFonts.plusJakartaSans(fontSize: 32, fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -1.0),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
          
          if (isEmpty)
            SliverFillRemaining(
              hasScrollBody: false,
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Center(
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(40),
                      border: Border.all(color: Colors.grey.shade200, style: BorderStyle.solid),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: AppColors.amber500.withAlpha(20),
                            shape: BoxShape.circle,
                            border: Border.all(color: AppColors.amber500.withAlpha(50)),
                          ),
                          child: const Icon(Icons.favorite_rounded, size: 40, color: AppColors.amber500),
                        ),
                        const SizedBox(height: 24),
                        Text('YOUR WISHLIST IS EMPTY', style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -0.5)),
                        const SizedBox(height: 12),
                        Text('Looks like you haven\'t saved any trips yet. Start exploring and tap the heart icon to save your favorite adventures!', textAlign: TextAlign.center, style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textMuted)),
                        const SizedBox(height: 32),
                        ElevatedButton(
                          onPressed: () => context.push('/trips'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.amber500,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                            elevation: 0,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          child: Text('EXPLORE TRIPS', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                        )
                      ],
                    ),
                  ),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 24),
                      child: TripCard(
                        title: 'Himalayan Adventure',
                        location: 'Manali, Himachal Pradesh',
                        price: 15000,
                        duration: '4n 5d',
                        rating: 4.8,
                        reviewsCount: 124,
                        imageUrl: 'assets/images/trips/ladakh.png', // Fallback to local asset
                        onTap: () {},
                      ),
                    );
                  },
                  childCount: 4,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
