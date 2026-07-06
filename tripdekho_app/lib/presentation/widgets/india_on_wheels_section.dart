import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../core/theme/app_colors.dart';

class IndiaOnWheelsSection extends StatelessWidget {
  final String titlePrefix;
  final String titleHighlight;
  
  const IndiaOnWheelsSection({
    super.key,
    this.titlePrefix = 'India on ',
    this.titleHighlight = 'Wheels',
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: [
              Text(
                titlePrefix,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: AppColors.darkText,
                  letterSpacing: -0.5,
                  height: 1.1,
                ),
              ),
              if (titleHighlight.isNotEmpty)
                Text(
                  titleHighlight,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 26,
                    fontWeight: FontWeight.w900,
                    color: AppColors.goldPrimary,
                    letterSpacing: -0.5,
                    height: 1.1,
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          height: 280,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            physics: const BouncingScrollPhysics(),
            children: [
              _buildCard(
                'Andhra Pradesh',
                'The Essence of Incredible India',
                'assets/images/destinations/andhra-pradesh.png',
              ),
              const SizedBox(width: 16),
              _buildCard(
                'Assam',
                'Experience Awesome Assam',
                'assets/images/destinations/assam.png',
              ),
              const SizedBox(width: 16),
              _buildCard(
                'Chhattisgarh',
                'Full of Surprises',
                'assets/images/destinations/chhattisgarh.png',
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCard(String title, String subtitle, String imageUrl) {
    return SizedBox(
      width: 180,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: imageUrl.startsWith('http')
                    ? CachedNetworkImage(
                        imageUrl: imageUrl,
                        height: 220,
                        width: 180,
                        fit: BoxFit.cover,
                      )
                    : Image.asset(
                        imageUrl,
                        height: 220,
                        width: 180,
                        fit: BoxFit.cover,
                      ),
              ),
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.all(6),
                  decoration: const BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.star_border_rounded,
                    color: AppColors.darkText,
                    size: 18,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            title,
            textAlign: TextAlign.center,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 14,
              fontWeight: FontWeight.w800,
              color: AppColors.darkText,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtitle,
            textAlign: TextAlign.center,
            style: GoogleFonts.beVietnamPro(
              fontSize: 11,
              color: AppColors.surfaceVariantText,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
