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
    // List of Indian States
    final List<Map<String, String>> states = [
      {'title': 'Andhra Pradesh', 'subtitle': 'The Essence of Incredible India', 'img': 'assets/images/destinations/andhra-pradesh.png'},
      {'title': 'Assam', 'subtitle': 'Experience Awesome Assam', 'img': 'assets/images/destinations/assam.png'},
      {'title': 'Chhattisgarh', 'subtitle': 'Full of Surprises', 'img': 'assets/images/destinations/chhattisgarh.png'},
      {'title': 'Goa', 'subtitle': 'A Perfect Holiday Destination', 'img': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=400'},
      {'title': 'Himachal Pradesh', 'subtitle': 'A Destination for All Seasons', 'img': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=400'},
      {'title': 'Kerala', 'subtitle': 'God\'s Own Country', 'img': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=400'},
      {'title': 'Rajasthan', 'subtitle': 'Padharo Mhare Desh', 'img': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=400'},
      {'title': 'Uttarakhand', 'subtitle': 'Simply Heaven', 'img': 'https://images.unsplash.com/photo-1626014903823-35f992a76fbd?q=80&w=400'},
      {'title': 'Sikkim', 'subtitle': 'Small but Beautiful', 'img': 'https://images.unsplash.com/photo-1572002137158-7c8fa5a47291?q=80&w=400'},
      {'title': 'Meghalaya', 'subtitle': 'Halfway to Heaven', 'img': 'https://images.unsplash.com/photo-1628122934098-b64ec0d64e8d?q=80&w=400'},
      {'title': 'Gujarat', 'subtitle': 'Khushboo Gujarat Ki', 'img': 'https://images.unsplash.com/photo-1587922546307-776227941871?q=80&w=400'},
      {'title': 'Tamil Nadu', 'subtitle': 'Enchanting Tamil Nadu', 'img': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=400'},
      {'title': 'Maharashtra', 'subtitle': 'Unlimited', 'img': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=400'},
      {'title': 'Karnataka', 'subtitle': 'One State. Many Worlds.', 'img': 'https://images.unsplash.com/photo-1600100397608-f010f4198730?q=80&w=400'},
      {'title': 'West Bengal', 'subtitle': 'The Sweetest Part of India', 'img': 'https://images.unsplash.com/photo-1558431382-27e303142255?q=80&w=400'},
      {'title': 'Madhya Pradesh', 'subtitle': 'The Heart of Incredible India', 'img': 'https://images.unsplash.com/photo-1625406087756-32d733db97f2?q=80&w=400'},
      {'title': 'Jammu & Kashmir', 'subtitle': 'Paradise on Earth', 'img': 'https://images.unsplash.com/photo-1566837945700-3005fea37efa?q=80&w=400'},
      {'title': 'Odisha', 'subtitle': 'India\'s Best Kept Secret', 'img': 'https://images.unsplash.com/photo-1634860472477-94a0ab645c3b?q=80&w=400'},
      {'title': 'Punjab', 'subtitle': 'India Begins Here', 'img': 'https://images.unsplash.com/photo-1587925820465-1d4fc6ce7c41?q=80&w=400'},
      {'title': 'Uttar Pradesh', 'subtitle': 'Amazing Heritage', 'img': 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=400'},
      {'title': 'Bihar', 'subtitle': 'Blissful Bihar', 'img': 'https://images.unsplash.com/photo-1618302194602-09419d8e578a?q=80&w=400'},
      {'title': 'Arunachal Pradesh', 'subtitle': 'The Land of Dawn-lit Mountains', 'img': 'https://images.unsplash.com/photo-1571404179377-628b7faad790?q=80&w=400'},
    ];

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
          height: 600, // 2 rows, ~290 per row + spacing
          child: GridView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            physics: const BouncingScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 1.5, // Height / Width of cell in horizontal grid
            ),
            itemCount: states.length,
            itemBuilder: (context, index) {
              final state = states[index];
              return _buildCard(state['title']!, state['subtitle']!, state['img']!);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildCard(String title, String subtitle, String imageUrl) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Stack(
            fit: StackFit.expand,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: imageUrl.startsWith('http')
                    ? CachedNetworkImage(
                        imageUrl: imageUrl,
                        fit: BoxFit.cover,
                        placeholder: (context, url) => Container(color: AppColors.surfaceLow),
                        errorWidget: (context, url, error) => Container(color: AppColors.surfaceLow),
                      )
                    : Image.asset(
                        imageUrl,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => Container(color: AppColors.surfaceLow),
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
                    Icons.favorite_border_rounded, // Changed from star to heart to match TripCard
                    color: AppColors.darkText,
                    size: 18,
                  ),
                ),
              ),
            ],
          ),
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
    );
  }
}
