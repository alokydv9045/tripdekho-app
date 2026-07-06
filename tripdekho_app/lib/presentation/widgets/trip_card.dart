import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';

class TripCard extends StatefulWidget {
  final String title;
  final String location;
  final double price;
  final double? originalPrice;
  final String duration;
  final double rating;
  final int reviewsCount;
  final String imageUrl;
  final String? slug;
  final List<String>? categories;
  final List<String>? dates;
  final String? vendorName;
  final String? vendorAvatar;
  final VoidCallback onTap;

  const TripCard({
    super.key,
    required this.title,
    required this.location,
    required this.price,
    this.originalPrice,
    required this.duration,
    required this.rating,
    required this.reviewsCount,
    required this.imageUrl,
    this.slug,
    this.categories,
    this.dates,
    this.vendorName,
    this.vendorAvatar,
    required this.onTap,
  });

  @override
  State<TripCard> createState() => _TripCardState();
}

class _TripCardState extends State<TripCard> {
  bool _isWishlisted = false;

  @override
  Widget build(BuildContext context) {
    final displayUrl = widget.imageUrl.trim().isEmpty ? 'assets/images/trips/ladakh.png' : widget.imageUrl;

    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(10),
              blurRadius: 15,
              offset: const Offset(0, 5),
            )
          ],
        ),
        clipBehavior: Clip.hardEdge,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ── Image Header ─────────────────────────────────────
            SizedBox(
              height: 190,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  displayUrl.startsWith('http')
                      ? CachedNetworkImage(
                          imageUrl: displayUrl,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => Container(
                            color: AppColors.surfaceLow,
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: AppColors.surfaceLow,
                            child: const Icon(Icons.image_outlined, color: AppColors.grey400, size: 36),
                          ),
                        )
                      : Image.asset(
                          displayUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            color: AppColors.surfaceLow,
                            child: const Icon(Icons.image_outlined, color: AppColors.grey400, size: 36),
                          ),
                        ),

                  // Free Goodies badge (top-left)
                  Positioned(
                    top: 16,
                    left: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFF333333).withAlpha(210), // Dark grey
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        'Free Goodies 🎁',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),

                  // Wishlist heart (top-right)
                  Positioned(
                    top: 16,
                    right: 16,
                    child: GestureDetector(
                      onTap: () => setState(() => _isWishlisted = !_isWishlisted),
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.black.withAlpha(80),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          _isWishlisted ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                          size: 20,
                          color: _isWishlisted ? AppColors.heartRed : Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // ── Content ───────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Duration
                  Row(
                    children: [
                      const Icon(Icons.calendar_today_outlined, size: 14, color: AppColors.grey500),
                      const SizedBox(width: 6),
                      Text(
                        widget.duration,
                        style: GoogleFonts.plusJakartaSans(
                          color: AppColors.surfaceVariantText,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Title
                  Text(
                    widget.title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: AppColors.darkText,
                      letterSpacing: -0.2,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Location
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, size: 16, color: AppColors.amber500),
                      const SizedBox(width: 4),
                      Text(
                        widget.location,
                        style: GoogleFonts.plusJakartaSans(
                          color: AppColors.amber500,
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Category Badges
                  if (widget.categories != null && widget.categories!.isNotEmpty)
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: widget.categories!.take(3).map((cat) {
                        return _Badge(
                          text: cat.toUpperCase(),
                          textColor: const Color(0xFFD97706),
                          bgColor: const Color(0xFFFEF3C7),
                        );
                      }).toList(),
                    ),
                  const SizedBox(height: 16),

                  // Price
                  Row(
                    children: [
                      Text(
                        '₹${widget.price.toStringAsFixed(0)}',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: AppColors.darkText,
                        ),
                      ),
                      const SizedBox(width: 8),
                      if (widget.originalPrice != null && widget.originalPrice! > widget.price) ...[
                        Text(
                          '₹${widget.originalPrice!.toStringAsFixed(0)}',
                          style: GoogleFonts.plusJakartaSans(
                            decoration: TextDecoration.lineThrough,
                            color: AppColors.grey400,
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          '₹${(widget.originalPrice! - widget.price).toStringAsFixed(0)} Off',
                          style: GoogleFonts.plusJakartaSans(
                            color: const Color(0xFFEA580C), // Orange-red
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ]
                    ],
                  ),
                  // Upcoming Dates
                  if (widget.dates != null && widget.dates!.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        const Icon(Icons.calendar_today_outlined, size: 14, color: AppColors.grey500),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            widget.dates!.take(3).join(', '),
                            style: GoogleFonts.plusJakartaSans(
                              color: AppColors.surfaceVariantText,
                              fontSize: 13,
                              fontWeight: FontWeight.w500,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                  
                  const SizedBox(height: 20),
                  Container(height: 1, color: AppColors.outlineVariant.withAlpha(70)),
                  const SizedBox(height: 16),
                  
                  // Footer (Partner info)
                  Row(
                    children: [
                      // Avatar
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.surfaceLow,
                          image: (widget.vendorAvatar != null && widget.vendorAvatar!.startsWith('http')) 
                            ? DecorationImage(
                                image: CachedNetworkImageProvider(widget.vendorAvatar!),
                                fit: BoxFit.cover,
                              )
                            : const DecorationImage(
                                image: AssetImage('assets/images/sm-logo.png'),
                                fit: BoxFit.cover,
                              )
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: RichText(
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          text: TextSpan(
                            text: 'By ',
                            style: GoogleFonts.plusJakartaSans(color: AppColors.grey500, fontSize: 13, fontWeight: FontWeight.w500),
                            children: [
                              TextSpan(
                                text: widget.vendorName ?? 'TripDekho',
                                style: GoogleFonts.plusJakartaSans(color: AppColors.darkText, fontWeight: FontWeight.w700),
                              )
                            ]
                          ),
                        ),
                      ),
                      const SizedBox(width: 4),
                      // New Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8FAFC),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.star_rounded, color: AppColors.goldPrimary, size: 12),
                            const SizedBox(width: 4),
                            Text('New', style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.darkText)),
                          ],
                        ),
                      )
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String text;
  final Color textColor;
  final Color bgColor;

  const _Badge({required this.text, required this.textColor, required this.bgColor});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor.withAlpha(100),
        border: Border.all(color: bgColor, width: 1),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        text,
        style: GoogleFonts.plusJakartaSans(
          color: textColor,
          fontSize: 10,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}


