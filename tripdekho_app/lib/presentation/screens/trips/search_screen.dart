import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import 'package:go_router/go_router.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _searchCtrl = TextEditingController();
  final List<String> _recentSearches = ['Manali', 'Goa', 'Kerala', 'Rajasthan'];
  final List<Map<String, String>> _popularDest = [
    {'label': 'Manali', 'icon': '🏔️', 'query': 'manali'},
    {'label': 'Goa', 'icon': '🌊', 'query': 'goa'},
    {'label': 'Kerala', 'icon': '🌿', 'query': 'kerala'},
    {'label': 'Ladakh', 'icon': '🦅', 'query': 'ladakh'},
    {'label': 'Rajasthan', 'icon': '🏰', 'query': 'rajasthan'},
    {'label': 'Rishikesh', 'icon': '🧘', 'query': 'rishikesh'},
  ];

  void _submitSearch(String query) {
    if (query.trim().isEmpty) return;
    // For now we just pop and pass it back or we can navigate to trips tab.
    // Assuming trips screen listens to a provider, or we push to a results screen.
    // For now just pop or show a snackbar.
    context.pop(query);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 220,
            pinned: true,
            backgroundColor: AppColors.cardBg,
            foregroundColor: AppColors.darkText,
            elevation: 0,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.asset(
                    'assets/images/zanskar-valley.png', // Assuming we have this or similar hero image
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(color: AppColors.darkText),
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.black.withAlpha(80), Colors.black.withAlpha(160)],
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 40,
                    left: 24,
                    right: 24,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome to',
                          style: GoogleFonts.plusJakartaSans(color: AppColors.amber500, fontSize: 12, fontWeight: FontWeight.w800, letterSpacing: 2.0),
                        ),
                        Text(
                          'SEARCH',
                          style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 32, fontWeight: FontWeight.w900, letterSpacing: -1.0),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Container(
              transform: Matrix4.translationValues(0.0, -20.0, 0.0),
              decoration: const BoxDecoration(
                color: AppColors.bgCream,
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Search Input
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.outlineVariant),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(10), blurRadius: 20, offset: const Offset(0, 4))],
                    ),
                    child: TextField(
                      controller: _searchCtrl,
                      autofocus: true,
                      style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, fontSize: 16, color: AppColors.darkText),
                      decoration: InputDecoration(
                        hintText: 'Search trips, destinations...',
                        hintStyle: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontWeight: FontWeight.w500, fontSize: 15),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                        prefixIcon: const Icon(Icons.search_rounded, color: AppColors.textMuted, size: 22),
                        suffixIcon: _searchCtrl.text.isNotEmpty
                            ? IconButton(
                                icon: const Icon(Icons.close_rounded, color: AppColors.textMuted, size: 20),
                                onPressed: () {
                                  setState(() {
                                    _searchCtrl.clear();
                                  });
                                },
                              )
                            : null,
                      ),
                      onChanged: (val) {
                        setState(() {});
                      },
                      onSubmitted: _submitSearch,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  // Search Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => _submitSearch(_searchCtrl.text),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.amber500,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 0,
                      ),
                      child: Text(
                        'SEARCH',
                        style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 1.5, color: Colors.white),
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 40),

                  // Recent Searches
                  Text('RECENT SEARCHES', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 10, letterSpacing: 1.5, color: AppColors.textMuted)),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 10,
                    runSpacing: 10,
                    children: _recentSearches.map((s) => ActionChip(
                      label: Text(
                        s,
                        style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.darkText),
                      ),
                      onPressed: () => _submitSearch(s),
                      backgroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      side: const BorderSide(color: AppColors.outlineVariant),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    )).toList(),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  // Popular Destinations
                  Text('POPULAR DESTINATIONS', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 10, letterSpacing: 1.5, color: AppColors.textMuted)),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 10,
                    runSpacing: 12,
                    children: _popularDest.map((dest) {
                      return GestureDetector(
                        onTap: () => _submitSearch(dest['query']!),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(24),
                            border: Border.all(color: AppColors.outlineVariant),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(dest['icon']!, style: const TextStyle(fontSize: 16)),
                              const SizedBox(width: 8),
                              Text(
                                dest['label']!,
                                style: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.grey700),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

