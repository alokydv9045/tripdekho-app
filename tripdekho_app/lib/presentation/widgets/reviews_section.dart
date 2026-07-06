import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/theme/app_colors.dart';
import '../providers/review_provider.dart';

class ReviewsSection extends ConsumerWidget {
  const ReviewsSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final reviewsAsync = ref.watch(fetchTopReviewsProvider(limit: 6));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              RichText(
                text: TextSpan(
                  text: 'What Our Travelers ',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    color: AppColors.darkText,
                    letterSpacing: -0.5,
                  ),
                  children: [
                    TextSpan(
                      text: 'Say',
                      style: GoogleFonts.caveat(
                        fontSize: 34,
                        fontWeight: FontWeight.w700,
                        color: AppColors.goldPrimary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Real experiences from real explorers',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.surfaceVariantText,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        
        reviewsAsync.when(
          data: (reviews) {
            if (reviews.isEmpty) {
              return const SizedBox.shrink();
            }
            return ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: (reviews.length / 2).ceil(),
              itemBuilder: (context, index) {
                final int first = index * 2;
                final int second = first + 1;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: _ReviewCard(
                          name: reviews[first].userName,
                          avatar: reviews[first].userAvatar,
                          rating: reviews[first].rating,
                          content: reviews[first].content,
                          tripName: reviews[first].tripName,
                        ),
                      ),
                      const SizedBox(width: 16),
                      if (second < reviews.length)
                        Expanded(
                          child: _ReviewCard(
                            name: reviews[second].userName,
                            avatar: reviews[second].userAvatar,
                            rating: reviews[second].rating,
                            content: reviews[second].content,
                            tripName: reviews[second].tripName,
                          ),
                        )
                      else
                        const Expanded(child: SizedBox.shrink()),
                    ],
                  ),
                );
              },
            );
          },
          loading: () => const SizedBox(
            height: 200,
            child: Center(child: CircularProgressIndicator(color: AppColors.goldPrimary)),
          ),
          error: (err, stack) => const SizedBox.shrink(),
        ),
      ],
    );
  }
}

class _ReviewCard extends StatelessWidget {
  final String name;
  final String? avatar;
  final double rating;
  final String content;
  final String? tripName;

  const _ReviewCard({
    required this.name,
    this.avatar,
    required this.rating,
    required this.content,
    this.tripName,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.outline.withAlpha(40)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(5),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.surfaceLow,
                  image: avatar != null && avatar!.startsWith('http')
                      ? DecorationImage(image: CachedNetworkImageProvider(avatar!), fit: BoxFit.cover)
                      : const DecorationImage(image: AssetImage('assets/images/sm-logo.png'), fit: BoxFit.cover),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      name,
                      style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, fontSize: 13, color: AppColors.darkText),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: List.generate(5, (index) {
                        return Icon(
                          index < rating.floor() ? Icons.star_rounded : Icons.star_border_rounded,
                          color: AppColors.goldPrimary,
                          size: 14,
                        );
                      }),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Content
          Text(
            '"$content"',
            style: GoogleFonts.plusJakartaSans(
              fontSize: 13,
              color: AppColors.surfaceVariantText,
              height: 1.5,
              fontWeight: FontWeight.w500,
            ),
            maxLines: 4,
            overflow: TextOverflow.ellipsis,
          ),
          if (tripName != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: const Color(0xFFF1F5F9), // slate-100
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  const Icon(Icons.location_on_rounded, size: 12, color: AppColors.grey500),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      tripName!,
                      style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, fontSize: 11, color: AppColors.textMuted),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ]
        ],
      ),
    );
  }
}
