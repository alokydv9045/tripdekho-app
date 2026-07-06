import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../widgets/trip_card.dart';
import '../../providers/trip_provider.dart';

class TripsScreen extends ConsumerStatefulWidget {
  const TripsScreen({super.key});

  @override
  ConsumerState<TripsScreen> createState() => _TripsScreenState();
}

class _TripsScreenState extends ConsumerState<TripsScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  String _searchQuery = '';
  String _selectedCategory = 'all';
  String _selectedDifficulty = 'all';
  String _selectedDuration = 'all';
  String _selectedPriceRange = 'all';
  String _sortBy = 'newest';

  static const List<String> _categories = ['all', 'adventure', 'cultural', 'religious', 'nature', 'beach', 'mountain', 'wildlife', 'heritage', 'wellness'];
  static const List<String> _difficulties = ['all', 'easy', 'moderate', 'challenging', 'extreme'];
  static const List<Map<String, String>> _durations = [
    {'label': 'All', 'value': 'all'},
    {'label': '1-3 Days', 'value': '1-3'},
    {'label': '4-6 Days', 'value': '4-6'},
    {'label': '7+ Days', 'value': '7+'},
  ];
  static const List<Map<String, String>> _sortOptions = [
    {'label': 'Newest First', 'value': 'newest'},
    {'label': 'Price: Low to High', 'value': 'price-asc'},
    {'label': 'Price: High to Low', 'value': 'price-desc'},
    {'label': 'Duration: Short to Long', 'value': 'duration-asc'},
  ];
  static const List<Map<String, String>> _priceRanges = [
    {'label': 'All Prices', 'value': 'all'},
    {'label': 'Under ₹5,000', 'value': '0-5000'},
    {'label': '₹5,000 - ₹10,000', 'value': '5000-10000'},
    {'label': '₹10,000 - ₹20,000', 'value': '10000-20000'},
    {'label': '₹20,000 - ₹50,000', 'value': '20000-50000'},
    {'label': 'Above ₹50,000', 'value': '50000-999999'},
  ];

  void _clearFilters() {
    setState(() {
      _searchQuery = '';
      _selectedCategory = 'all';
      _selectedDifficulty = 'all';
      _selectedDuration = 'all';
      _selectedPriceRange = 'all';
      _sortBy = 'newest';
    });
  }

  @override
  Widget build(BuildContext context) {
    // We fetch a larger limit to do client-side filtering matching the web's limit: 200
    final tripsAsync = ref.watch(fetchTripsProvider(limit: 100));

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppColors.bgCream,
      endDrawer: _buildFilterDrawer(),
      body: Stack(
        children: [
          // Background decorations (subtle circles) - similar to web
          Positioned(
            top: -150,
            left: -150,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [AppColors.goldPrimary.withAlpha(50), Colors.transparent],
                  stops: const [0, 0.7],
                ),
              ),
            ),
          ),
          
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // ── Hero App Bar ─────────────────────────────────────────────
              SliverAppBar(
                expandedHeight: 240,
                pinned: true,
                backgroundColor: AppColors.bgCream,
                elevation: 0,
                scrolledUnderElevation: 1,
                shadowColor: const Color(0xFF735C00).withAlpha(20),
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back_rounded, color: Colors.white),
                  style: IconButton.styleFrom(backgroundColor: Colors.black38),
                  onPressed: () => context.pop(),
                ),
                flexibleSpace: FlexibleSpaceBar(
                  titlePadding: const EdgeInsets.only(left: 16, bottom: 16),
                  title: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Welcome to',
                        style: GoogleFonts.caveat(
                          color: Colors.white,
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Text(
                        'All Trips',
                        style: GoogleFonts.plusJakartaSans(
                          color: Colors.white,
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          height: 1.0,
                        ),
                      ),
                    ],
                  ),
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.asset(
                        'assets/images/trips/zanskar-valley.png',
                        fit: BoxFit.cover,
                      ),
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black.withAlpha(50),
                              Colors.transparent,
                              Colors.black.withAlpha(180),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // ── Top Bar (Count, Sort, Filter) ──────────────────────────
              SliverPersistentHeader(
                pinned: true,
                delegate: _TopBarDelegate(
                  child: Container(
                    color: AppColors.bgCream,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'All Experiences',
                                style: GoogleFonts.plusJakartaSans(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.darkText,
                                ),
                              ),
                              tripsAsync.when(
                                data: (trips) {
                                  final filtered = _filterTrips(trips);
                                  return Text(
                                    '${filtered.length} trips',
                                    style: GoogleFonts.plusJakartaSans(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.amber500,
                                    ),
                                  );
                                },
                                loading: () => const SizedBox.shrink(),
                                error: (_, __) => const SizedBox.shrink(),
                              )
                            ],
                          ),
                        ),
                        // Sort Button
                        Container(
                          height: 40,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.surfaceContainer),
                          ),
                          child: PopupMenuButton<String>(
                            icon: const Icon(Icons.sort_rounded, color: AppColors.grey700, size: 20),
                            offset: const Offset(0, 48),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                            onSelected: (val) => setState(() => _sortBy = val),
                            itemBuilder: (context) => _sortOptions.map((opt) {
                              return PopupMenuItem(
                                value: opt['value'],
                                child: Text(
                                  opt['label']!,
                                  style: GoogleFonts.plusJakartaSans(
                                    fontWeight: _sortBy == opt['value'] ? FontWeight.w800 : FontWeight.w600,
                                    color: _sortBy == opt['value'] ? AppColors.amber500 : AppColors.darkText,
                                    fontSize: 14,
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                        const SizedBox(width: 8),
                        // Filter Button
                        GestureDetector(
                          onTap: () => _scaffoldKey.currentState?.openEndDrawer(),
                          child: Container(
                            height: 40,
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.surfaceContainer),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.tune_rounded, color: AppColors.grey700, size: 18),
                                const SizedBox(width: 6),
                                Text(
                                  'Filters',
                                  style: GoogleFonts.plusJakartaSans(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.grey700,
                                  ),
                                ),
                                if (_activeFilterCount > 0) ...[
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: const BoxDecoration(color: AppColors.amber500, shape: BoxShape.circle),
                                    child: Text(
                                      '$_activeFilterCount',
                                      style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white),
                                    ),
                                  ),
                                ]
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              // ── Trips Grid ──────────────────────────────────────────────
              tripsAsync.when(
                data: (trips) {
                  final filtered = _filterTrips(trips);
                  
                  if (filtered.isEmpty) {
                    return SliverFillRemaining(
                      hasScrollBody: false,
                      child: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(24),
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.explore_off_rounded, size: 48, color: AppColors.amber500),
                            ),
                            const SizedBox(height: 16),
                            Text(
                              'No trips found',
                              style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.darkText),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Try adjusting your filters or search query',
                              style: GoogleFonts.plusJakartaSans(fontSize: 14, color: AppColors.surfaceVariantText),
                            ),
                            const SizedBox(height: 24),
                            ElevatedButton(
                              onPressed: _clearFilters,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.goldPrimary,
                                foregroundColor: AppColors.darkText,
                                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                elevation: 0,
                              ),
                              child: Text('CLEAR FILTERS', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 12, letterSpacing: 1.0)),
                            ),
                          ],
                        ),
                      ),
                    );
                  }

                  return SliverPadding(
                    padding: const EdgeInsets.fromLTRB(16, 8, 16, 40),
                    sliver: SliverGrid(
                      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                        maxCrossAxisExtent: 400, // Makes it 1 col on mobile, 2 on wide screens
                        mainAxisSpacing: 24,
                        crossAxisSpacing: 24,
                        mainAxisExtent: 460, // Fixed height for TripCard
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final trip = filtered[index];
                          return TripCard(
                            title: trip.title,
                            location: '${trip.location.city}, ${trip.location.country}',
                            price: trip.price.amount.toDouble(),
                            duration: '${trip.durationNights}n ${trip.durationDays}d',
                            rating: 4.8,
                            reviewsCount: 120,
                            imageUrl: trip.thumbnail?.url ?? 'assets/images/trips/ladakh.png',
                            onTap: () => context.push('/trips/${trip.slug ?? trip.id}'),
                          );
                        },
                        childCount: filtered.length,
                      ),
                    ),
                  );
                },
                loading: () => const SliverFillRemaining(
                  child: Center(child: CircularProgressIndicator(color: AppColors.goldPrimary)),
                ),
                error: (err, stack) => SliverFillRemaining(
                  child: Center(child: Text('Error loading trips', style: GoogleFonts.plusJakartaSans(color: AppColors.error))),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  int get _activeFilterCount {
    int count = 0;
    if (_selectedCategory != 'all') count++;
    if (_selectedDifficulty != 'all') count++;
    if (_selectedDuration != 'all') count++;
    if (_selectedPriceRange != 'all') count++;
    return count;
  }

  List<dynamic> _filterTrips(List<dynamic> allTrips) {
    // Similar filtering logic as web
    var result = List.of(allTrips);
    
    // Search
    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      result = result.where((t) {
        return (t.title.toLowerCase().contains(q)) || 
               (t.location.city.toLowerCase().contains(q));
      }).toList();
    }

    // Category
    if (_selectedCategory != 'all') {
      result = result.where((t) {
        final cats = t.category;
        return cats.any((c) => c.toString().toLowerCase() == _selectedCategory.toLowerCase());
      }).toList();
    }

    // Difficulty
    if (_selectedDifficulty != 'all') {
      result = result.where((t) => t.difficulty?.toLowerCase() == _selectedDifficulty.toLowerCase()).toList();
    }

    // Duration
    if (_selectedDuration != 'all') {
      final parts = _selectedDuration.split('-');
      if (parts.length == 2) {
        final min = int.parse(parts[0]);
        final max = int.parse(parts[1]);
        result = result.where((t) => t.durationDays >= min && t.durationDays <= max).toList();
      } else if (_selectedDuration == '7+') {
        result = result.where((t) => t.durationDays >= 7).toList();
      }
    }

    // Price Range
    if (_selectedPriceRange != 'all') {
      final parts = _selectedPriceRange.split('-');
      if (parts.length == 2) {
        final min = int.parse(parts[0]);
        final max = int.parse(parts[1]);
        result = result.where((t) => t.price.amount >= min && t.price.amount <= max).toList();
      } else if (_selectedPriceRange == '50000-999999') {
        result = result.where((t) => t.price.amount >= 50000).toList();
      }
    }

    // Sort
    switch (_sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price.amount.compareTo(b.price.amount));
        break;
      case 'price-desc':
        result.sort((a, b) => b.price.amount.compareTo(a.price.amount));
        break;
      case 'duration-asc':
        result.sort((a, b) => a.durationDays.compareTo(b.durationDays));
        break;
    }

    return result;
  }

  Widget _buildFilterDrawer() {
    return Drawer(
      backgroundColor: Colors.white,
      surfaceTintColor: Colors.transparent,
      child: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'FILTERS',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 14,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.0,
                      color: AppColors.darkText,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: AppColors.grey700),
                    onPressed: () => Navigator.pop(context),
                  )
                ],
              ),
            ),
            const Divider(height: 1, color: AppColors.surfaceContainer),
            
            // Filters
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Search
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: AppColors.grey50,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.surfaceContainer),
                    ),
                    child: TextField(
                      decoration: InputDecoration(
                        border: InputBorder.none,
                        hintText: 'Search trips...',
                        hintStyle: GoogleFonts.plusJakartaSans(fontSize: 14, color: AppColors.grey400, fontWeight: FontWeight.w600),
                        icon: const Icon(Icons.search_rounded, color: AppColors.grey400),
                      ),
                      onChanged: (val) => setState(() => _searchQuery = val),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Category
                  _buildFilterSection(
                    title: 'CATEGORY',
                    children: _categories.map((c) => _buildFilterChip(
                      label: c,
                      isSelected: _selectedCategory == c,
                      onTap: () => setState(() => _selectedCategory = c),
                    )).toList(),
                  ),
                  
                  // Price Range
                  _buildFilterSection(
                    title: 'PRICE RANGE',
                    children: _priceRanges.map((pr) => _buildFilterListTile(
                      label: pr['label']!,
                      isSelected: _selectedPriceRange == pr['value'],
                      onTap: () => setState(() => _selectedPriceRange = pr['value']!),
                    )).toList(),
                    isWrap: false,
                  ),

                  // Duration
                  _buildFilterSection(
                    title: 'DURATION',
                    children: _durations.map((d) => _buildFilterChip(
                      label: d['label']!,
                      isSelected: _selectedDuration == d['value'],
                      onTap: () => setState(() => _selectedDuration = d['value']!),
                    )).toList(),
                  ),

                  // Difficulty
                  _buildFilterSection(
                    title: 'DIFFICULTY',
                    children: _difficulties.map((d) => _buildFilterChip(
                      label: d,
                      isSelected: _selectedDifficulty == d,
                      onTap: () => setState(() => _selectedDifficulty = d),
                    )).toList(),
                  ),
                ],
              ),
            ),
            
            // Footer (Clear All)
            if (_activeFilterCount > 0)
              Padding(
                padding: const EdgeInsets.all(16),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _clearFilters,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFEF2F2),
                      foregroundColor: const Color(0xFFEF4444),
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text(
                      'CLEAR ALL FILTERS ($_activeFilterCount)',
                      style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 12, letterSpacing: 1.0),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterSection({required String title, required List<Widget> children, bool isWrap = true}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: GoogleFonts.plusJakartaSans(
              fontSize: 10,
              fontWeight: FontWeight.w900,
              color: AppColors.grey400,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 12),
          if (isWrap)
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: children,
            )
          else
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: children,
            )
        ],
      ),
    );
  }

  Widget _buildFilterChip({required String label, required bool isSelected, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.goldPrimary : AppColors.grey50,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? AppColors.goldPrimary : AppColors.surfaceContainer),
          boxShadow: isSelected ? [BoxShadow(color: AppColors.goldPrimary.withAlpha(80), blurRadius: 8, offset: const Offset(0, 4))] : null,
        ),
        child: Text(
          label.toUpperCase(),
          style: GoogleFonts.plusJakartaSans(
            fontSize: 11,
            fontWeight: FontWeight.w800,
            color: isSelected ? AppColors.darkText : AppColors.grey500,
          ),
        ),
      ),
    );
  }

  Widget _buildFilterListTile({required String label, required bool isSelected, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        margin: const EdgeInsets.only(bottom: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.amber500.withAlpha(20) : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: isSelected ? AppColors.amber500.withAlpha(50) : Colors.transparent),
        ),
        child: Text(
          label,
          style: GoogleFonts.plusJakartaSans(
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
            color: isSelected ? const Color(0xFFB45309) : AppColors.grey500,
          ),
        ),
      ),
    );
  }
}

class _TopBarDelegate extends SliverPersistentHeaderDelegate {
  final Widget child;

  _TopBarDelegate({required this.child});

  @override
  double get minExtent => 64.0;
  @override
  double get maxExtent => 64.0;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Material(
      color: Colors.transparent,
      elevation: shrinkOffset > 0 ? 4 : 0,
      shadowColor: Colors.black.withAlpha(20),
      child: child,
    );
  }

  @override
  bool shouldRebuild(covariant _TopBarDelegate oldDelegate) {
    return oldDelegate.child != child;
  }
}

