import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import 'package:go_router/go_router.dart';
import '../../providers/trip_provider.dart';

class TripDetailScreen extends ConsumerStatefulWidget {
  final String slug;
  const TripDetailScreen({super.key, required this.slug});

  @override
  ConsumerState<TripDetailScreen> createState() => _TripDetailScreenState();
}

class _TripDetailScreenState extends ConsumerState<TripDetailScreen> {
  bool _isWishlisted = false;
  int _selectedDate = 0;
  int _guests = 2;
  int? _expandedDay;
  final String _sampleImage = 'assets/images/trips/ladakh.png';

  void _openBookingSheet(dynamic trip) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setSheetState) => Container(
          decoration: BoxDecoration(
            color: AppColors.cardBg,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
            boxShadow: [
              BoxShadow(color: Colors.black.withAlpha(30), blurRadius: 40, offset: const Offset(0, -8)),
            ],
          ),
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 24,
            top: 8,
            left: 24,
            right: 24,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Handle bar
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 20),
                  decoration: BoxDecoration(
                    color: AppColors.outlineVariant,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              Text(
                'Book Your Trip',
                style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.darkText, letterSpacing: -0.4),
              ),
              const SizedBox(height: 20),

              // Date selection
              Text(
                'SELECT DEPARTURE DATE',
                style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 1.2, color: AppColors.textMuted),
              ),
              const SizedBox(height: 10),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: (trip.dates ?? []).asMap().entries.map((e) {
                    final isSelected = _selectedDate == e.key;
                    final date = e.value;
                    final displayDate = '${date.startDate.day}/${date.startDate.month}';
                    return GestureDetector(
                      onTap: () => setSheetState(() => _selectedDate = e.key),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        margin: const EdgeInsets.only(right: 10),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.goldPrimary : AppColors.surfaceLow,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: isSelected ? AppColors.goldPrimary : AppColors.outlineVariant),
                          boxShadow: isSelected ? AppColors.buttonShadow : null,
                        ),
                        child: Text(
                          displayDate,
                          style: GoogleFonts.plusJakartaSans(
                            fontWeight: FontWeight.w700,
                            fontSize: 13,
                            color: isSelected ? AppColors.charcoal : AppColors.textMuted,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ),
              const SizedBox(height: 20),

              // Guests
              Text(
                'NUMBER OF GUESTS',
                style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 1.2, color: AppColors.textMuted),
              ),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.surfaceLow,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.outlineVariant),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    GestureDetector(
                      onTap: () => setSheetState(() { if (_guests > 1) _guests--; }),
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: AppColors.outlineVariant,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.remove, size: 16, color: AppColors.charcoal),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20),
                      child: Text(
                        '$_guests',
                        style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.darkText),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => setSheetState(() { _guests++; }),
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(
                          color: AppColors.goldPrimary,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.add, size: 16, color: AppColors.charcoal),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 20),
              Container(height: 1, color: AppColors.outlineVariant),
              const SizedBox(height: 16),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Total Amount',
                        style: GoogleFonts.beVietnamPro(fontSize: 13, color: AppColors.textMuted),
                      ),
                      Text(
                        '₹${(trip.price.amount * _guests).toString()}',
                        style: GoogleFonts.plusJakartaSans(
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          color: AppColors.darkText,
                          letterSpacing: -0.5,
                        ),
                      ),
                    ],
                  ),
                  GestureDetector(
                    onTap: () {
                      context.pop();
                      // Navigate to checkout
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                      decoration: BoxDecoration(
                        color: AppColors.goldPrimary,
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: AppColors.buttonShadow,
                      ),
                      child: Text(
                        'Pay Now',
                        style: GoogleFonts.plusJakartaSans(
                          fontWeight: FontWeight.w800,
                          fontSize: 14,
                          letterSpacing: 0.5,
                          color: AppColors.charcoal,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final tripAsync = ref.watch(fetchTripDetailProvider(widget.slug));

    return tripAsync.when(
      loading: () => const Scaffold(backgroundColor: AppColors.bgCream, body: Center(child: CircularProgressIndicator(color: AppColors.goldPrimary))),
      error: (err, stack) => const Scaffold(backgroundColor: AppColors.bgCream, body: Center(child: Text('Error loading trip'))),
      data: (trip) {
        if (trip == null) return const Scaffold(backgroundColor: AppColors.bgCream, body: Center(child: Text('Trip not found')));

        final itinerary = trip.itinerary ?? [];
        final sortedItinerary = List.of(itinerary)..sort((a, b) => (a.dayNumber ?? 0).compareTo(b.dayNumber ?? 0));
        final inclusions = trip.inclusions ?? [];
        final exclusions = trip.exclusions ?? [];

        return Scaffold(
          backgroundColor: AppColors.bgCream,
          body: Stack(
            children: [
              CustomScrollView(
                physics: const BouncingScrollPhysics(),
                slivers: [
                  // ── Hero App Bar ──────────────────────────────────────────
                  SliverAppBar(
                    expandedHeight: 380,
                    pinned: true,
                    stretch: true,
                    backgroundColor: AppColors.darkText,
                    foregroundColor: Colors.white,
                    actions: [
                      GestureDetector(
                        onTap: () => setState(() => _isWishlisted = !_isWishlisted),
                        child: Container(
                          margin: const EdgeInsets.only(right: 4),
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(color: Colors.black.withAlpha(80), shape: BoxShape.circle),
                          child: Icon(
                            _isWishlisted ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                            color: _isWishlisted ? AppColors.heartRed : Colors.white,
                            size: 20,
                          ),
                        ),
                      ),
                      Container(
                        margin: const EdgeInsets.only(right: 12),
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(color: Colors.black.withAlpha(80), shape: BoxShape.circle),
                        child: const Icon(Icons.share_rounded, color: Colors.white, size: 20),
                      ),
                    ],
                    flexibleSpace: FlexibleSpaceBar(
                      stretchModes: const [StretchMode.zoomBackground],
                      titlePadding: const EdgeInsets.only(left: 20, bottom: 24, right: 20),
                      title: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Trip To',
                            style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 1.0),
                          ),
                          Text(
                            trip.title,
                            style: GoogleFonts.caveat(
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                              fontSize: 32,
                              height: 1.1,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                      background: Stack(
                        fit: StackFit.expand,
                        children: [
                          Builder(
                            builder: (context) {
                              final url = trip.thumbnail?.url ?? '';
                              final displayUrl = url.trim().isEmpty ? _sampleImage : url;
                              return displayUrl.startsWith('http')
                                  ? CachedNetworkImage(imageUrl: displayUrl, fit: BoxFit.cover)
                                  : Image.asset(displayUrl, fit: BoxFit.cover);
                            },
                          ),
                          Container(
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [Colors.black.withAlpha(60), Colors.transparent, Colors.black.withAlpha(200)],
                                stops: const [0.0, 0.4, 1.0],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // ── Content ──────────────────────────────────────────────
                  SliverToBoxAdapter(
                    child: Container(
                      decoration: const BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
                      ),
                      transform: Matrix4.translationValues(0.0, -20.0, 0.0),
                      padding: const EdgeInsets.fromLTRB(20, 32, 20, 80),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Tags
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              ...((trip.category as List<dynamic>?) ?? []).map((c) => Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                                decoration: BoxDecoration(color: AppColors.amber500.withAlpha(40), borderRadius: BorderRadius.circular(20)),
                                child: Text(c.toString().toUpperCase(), style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w800, color: const Color(0xFFB45309))),
                              )),
                              if (trip.difficulty != null && trip.difficulty != 'none')
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                                  decoration: BoxDecoration(color: AppColors.grey100, borderRadius: BorderRadius.circular(20)),
                                  child: Text(trip.difficulty.toString().toUpperCase(), style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.grey700)),
                                ),
                            ],
                          ),
                          const SizedBox(height: 32),

                          // About
                          Text('About the trip', style: GoogleFonts.caveat(fontSize: 28, fontWeight: FontWeight.w700, color: AppColors.darkText)),
                          const SizedBox(height: 16),
                          
                          // Quick Info Row
                          Row(
                            children: [
                              _buildQuickInfo(Icons.location_on_rounded, trip.location.city),
                              const SizedBox(width: 12),
                              _buildQuickInfo(Icons.access_time_rounded, '${trip.durationDays} Days / ${trip.durationNights} Nights'),
                            ],
                          ),
                          const SizedBox(height: 16),

                          Text(
                            trip.description ?? trip.shortDescription ?? '',
                            style: GoogleFonts.beVietnamPro(fontSize: 14, color: AppColors.surfaceVariantText, height: 1.6),
                          ),
                          const SizedBox(height: 32),

                          // Itinerary Breakdown
                          if (sortedItinerary.isNotEmpty) ...[
                            Text('Itinerary Breakdown', style: GoogleFonts.caveat(fontSize: 28, fontWeight: FontWeight.w700, color: AppColors.darkText)),
                            const SizedBox(height: 16),
                            ...sortedItinerary.asMap().entries.map((e) {
                              final idx = e.key;
                              final day = e.value;
                              final isExpanded = _expandedDay == idx;
                              return GestureDetector(
                                onTap: () => setState(() => _expandedDay = isExpanded ? null : idx),
                                child: AnimatedContainer(
                                  duration: const Duration(milliseconds: 200),
                                  margin: const EdgeInsets.only(bottom: 12),
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: AppColors.grey50,
                                    border: Border.all(color: isExpanded ? AppColors.amber500 : AppColors.surfaceContainer),
                                    borderRadius: BorderRadius.circular(16),
                                  ),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        width: 32, height: 32,
                                        decoration: BoxDecoration(
                                          color: isExpanded ? AppColors.amber500 : Colors.white,
                                          border: Border.all(color: isExpanded ? AppColors.amber500 : AppColors.surfaceContainer),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        alignment: Alignment.center,
                                        child: Text('${day.dayNumber ?? idx+1}', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 12, color: isExpanded ? Colors.white : AppColors.grey500)),
                                      ),
                                      const SizedBox(width: 12),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Expanded(child: Text(day.title ?? 'Day ${idx+1}', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 14, color: AppColors.darkText))),
                                                Icon(isExpanded ? Icons.keyboard_arrow_up_rounded : Icons.keyboard_arrow_down_rounded, color: isExpanded ? AppColors.amber500 : AppColors.grey400),
                                              ],
                                            ),
                                            if (isExpanded && day.description != null) ...[
                                              const SizedBox(height: 8),
                                              Text(day.description ?? '', style: GoogleFonts.plusJakartaSans(fontSize: 12, color: AppColors.grey500, height: 1.5)),
                                            ]
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            }),
                            const SizedBox(height: 32),
                          ],

                          // Package Details (Inclusions / Exclusions)
                          if (inclusions.isNotEmpty || exclusions.isNotEmpty) ...[
                            Text('What\'s in the Package?', style: GoogleFonts.caveat(fontSize: 28, fontWeight: FontWeight.w700, color: AppColors.darkText)),
                            const SizedBox(height: 16),
                            if (inclusions.isNotEmpty) _buildListSection('Included', inclusions, Icons.check_circle_rounded, const Color(0xFF10B981), const Color(0xFFECFDF5), const Color(0xFFD1FAE5)),
                            const SizedBox(height: 16),
                            if (exclusions.isNotEmpty) _buildListSection('Excluded', exclusions, Icons.cancel_rounded, const Color(0xFFEF4444), const Color(0xFFFEF2F2), const Color(0xFFFEE2E2)),
                            const SizedBox(height: 32),
                          ],

                          // Gallery
                          if (trip.thumbnail?.url != null) ...[
                            Text('Gallery', style: GoogleFonts.caveat(fontSize: 28, fontWeight: FontWeight.w700, color: AppColors.darkText)),
                            const SizedBox(height: 16),
                            SizedBox(
                              height: 160,
                              child: ListView.builder(
                                scrollDirection: Axis.horizontal,
                                physics: const BouncingScrollPhysics(),
                                itemCount: 1,
                                itemBuilder: (context, i) {
                                  return Container(
                                    width: 140,
                                    margin: const EdgeInsets.only(right: 12),
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(16),
                                      image: DecorationImage(
                                        image: () {
                                          final url = trip.thumbnail?.url ?? '';
                                          final displayUrl = url.trim().isEmpty ? _sampleImage : url;
                                          return displayUrl.startsWith('http')
                                              ? CachedNetworkImageProvider(displayUrl)
                                              : AssetImage(displayUrl) as ImageProvider;
                                        }(),
                                        fit: BoxFit.cover,
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(height: 32),
                          ],
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),

          // ── Bottom Navigation Bar ────────────────────────────────────────
          bottomNavigationBar: Container(
            padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [BoxShadow(color: Colors.black.withAlpha(10), blurRadius: 20, offset: const Offset(0, -4))],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Price per person', style: GoogleFonts.plusJakartaSans(color: AppColors.grey500, fontSize: 10, fontWeight: FontWeight.w700, letterSpacing: 0.5)),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('₹${trip.price.amount}', style: GoogleFonts.plusJakartaSans(fontSize: 22, fontWeight: FontWeight.w900, color: AppColors.amber500, letterSpacing: -0.5)),
                        if (trip.price.originalPrice != null && trip.price.originalPrice! > trip.price.amount)
                           Padding(
                             padding: const EdgeInsets.only(left: 6, bottom: 3),
                             child: Text('₹${trip.price.originalPrice}', style: GoogleFonts.plusJakartaSans(fontSize: 12, decoration: TextDecoration.lineThrough, color: AppColors.grey400, fontWeight: FontWeight.w600)),
                           ),
                      ],
                    ),
                  ],
                ),
                GestureDetector(
                  onTap: () => _openBookingSheet(trip),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
                    decoration: BoxDecoration(
                      color: AppColors.amber500,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [BoxShadow(color: AppColors.amber500.withAlpha(80), blurRadius: 12, offset: const Offset(0, 4))],
                    ),
                    child: Text(
                      'BOOK NOW',
                      style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 13, letterSpacing: 1.0, color: Colors.white),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildQuickInfo(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.grey50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.surfaceContainer),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AppColors.amber500),
          const SizedBox(width: 6),
          Text(text, style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.grey700)),
        ],
      ),
    );
  }

  Widget _buildListSection(String title, List<dynamic> items, IconData icon, Color iconColor, Color bgColor, Color borderColor) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceContainer),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(color: iconColor, borderRadius: BorderRadius.circular(6)),
                child: Icon(icon, color: Colors.white, size: 12),
              ),
              const SizedBox(width: 8),
              Text(title.toUpperCase(), style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 1.0, color: iconColor)),
            ],
          ),
          const SizedBox(height: 16),
          ...items.map((item) => Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(icon, color: iconColor, size: 16),
                const SizedBox(width: 10),
                Expanded(child: Text(item.toString(), style: GoogleFonts.plusJakartaSans(fontSize: 13, color: AppColors.grey700, fontWeight: FontWeight.w500))),
              ],
            ),
          )),
        ],
      ),
    );
  }
}


