import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import 'package:go_router/go_router.dart';

class VlogListScreen extends StatefulWidget {
  const VlogListScreen({super.key});

  @override
  State<VlogListScreen> createState() => _VlogListScreenState();
}

class _VlogListScreenState extends State<VlogListScreen> {
  String _selectedCategory = 'All Feed';
  final List<String> _categories = ['All Feed', 'Adventure', 'Culture', 'Relaxation', 'Food'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomScrollView(
        slivers: [
          // Hero / AppBar
          SliverAppBar(
            backgroundColor: Colors.white,
            elevation: 0,
            scrolledUnderElevation: 0,
            pinned: true,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.darkText),
              onPressed: () => context.pop(),
            ),
            title: Text(
              'TripDekho Vlogs', 
              style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, color: AppColors.darkText, fontSize: 18, letterSpacing: -0.5)
            ),
          ),
          
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Discovery Header
                  Row(
                    children: [
                      const Icon(Icons.auto_awesome, color: AppColors.amber500, size: 14),
                      const SizedBox(width: 8),
                      Text(
                        'DISCOVERY ENGINE',
                        style: GoogleFonts.spaceMono(fontWeight: FontWeight.w700, fontSize: 10, color: AppColors.amber500, letterSpacing: 2.0),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Browse the',
                    style: GoogleFonts.plusJakartaSans(fontSize: 36, fontWeight: FontWeight.w900, color: AppColors.darkText, height: 1.0, letterSpacing: -1.0),
                  ),
                  Row(
                    children: [
                      Text(
                        'Global',
                        style: GoogleFonts.plusJakartaSans(fontSize: 36, fontWeight: FontWeight.w900, color: AppColors.amber500, height: 1.0, letterSpacing: -1.0),
                      ),
                      Text(
                        ' Feed',
                        style: GoogleFonts.plusJakartaSans(fontSize: 36, fontWeight: FontWeight.w900, color: AppColors.darkText, height: 1.0, letterSpacing: -1.0),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Search Bar
                  Container(
                    height: 56,
                    decoration: BoxDecoration(
                      color: Colors.grey.shade50,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: TextField(
                      style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.darkText),
                      decoration: InputDecoration(
                        hintText: 'SEARCH DESTINATION...',
                        hintStyle: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 10, color: Colors.grey.shade400, letterSpacing: 1.5),
                        prefixIcon: const Icon(Icons.search_rounded, color: Colors.grey),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(vertical: 20),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Category Pills
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: _categories.map((cat) {
                        final isSelected = _selectedCategory == cat;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: GestureDetector(
                            onTap: () => setState(() => _selectedCategory = cat),
                            child: Container(
                              height: 48,
                              padding: const EdgeInsets.symmetric(horizontal: 24),
                              decoration: BoxDecoration(
                                color: isSelected ? AppColors.amber500 : Colors.grey.shade50,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: isSelected ? AppColors.amber500 : Colors.grey.shade200),
                                boxShadow: isSelected ? [BoxShadow(color: AppColors.amber500.withAlpha(50), blurRadius: 10, offset: const Offset(0, 4))] : [],
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                cat.toUpperCase(),
                                style: GoogleFonts.plusJakartaSans(
                                  fontWeight: FontWeight.w900,
                                  fontSize: 10,
                                  letterSpacing: 1.5,
                                  color: isSelected ? Colors.black : Colors.grey.shade500,
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Vlogs List
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 32),
                    child: _buildVlogCard(context, index),
                  );
                },
                childCount: 5,
              ),
            ),
          ),
          const SliverPadding(padding: EdgeInsets.only(bottom: 40)),
        ],
      ),
    );
  }

  Widget _buildVlogCard(BuildContext context, int index) {
    return GestureDetector(
      onTap: () => context.push('/vlog/vlog-$index'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Thumbnail
          Container(
            height: 220,
            width: double.infinity,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(24),
              color: Colors.grey.shade200,
              image: const DecorationImage(
                image: AssetImage('assets/images/trips/ladakh.png'), // Mock image
                fit: BoxFit.cover,
              ),
              boxShadow: [
                BoxShadow(color: Colors.black.withAlpha(20), blurRadius: 20, offset: const Offset(0, 10))
              ],
            ),
            child: Stack(
              children: [
                // Gradient Overlay
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(24),
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.black.withAlpha(150)],
                    ),
                  ),
                ),
                // Play Button
                Center(
                  child: Container(
                    width: 64,
                    height: 64,
                    decoration: BoxDecoration(
                      color: Colors.white.withAlpha(50),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white.withAlpha(100), width: 2),
                    ),
                    child: const Icon(Icons.play_arrow_rounded, color: Colors.white, size: 32),
                  ),
                ),
                // Duration Badge
                Positioned(
                  bottom: 16,
                  right: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(color: Colors.black.withAlpha(150), borderRadius: BorderRadius.circular(8)),
                    child: Text('10:45', style: GoogleFonts.spaceMono(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700)),
                  ),
                )
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Details
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Avatar
              Container(
                width: 40,
                height: 40,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.amber500,
                ),
                alignment: Alignment.center,
                child: Text('T', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, color: Colors.white)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Exploring the Hidden Valleys of Ladakh - Full Cinematic Vlog',
                      style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkText, height: 1.3, letterSpacing: -0.3),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'TripDekho Studios • 12K views • 2 days ago',
                      style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted),
                    ),
                  ],
                ),
              )
            ],
          )
        ],
      ),
    );
  }
}
