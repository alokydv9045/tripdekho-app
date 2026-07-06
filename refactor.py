import re

with open('tripdekho_app/lib/presentation/screens/trips/trip_detail_screen.dart', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. build method signature
content = content.replace(
    '  @override\n  Widget build(BuildContext context) {\n    return Scaffold(',
    '''  @override
  Widget build(BuildContext context) {
    final tripAsync = ref.watch(fetchTripDetailProvider(widget.slug));

    return tripAsync.when(
      loading: () => const Scaffold(body: Center(child: CircularProgressIndicator(color: AppColors.goldPrimary))),
      error: (err, stack) => Scaffold(body: Center(child: Text('Error: \'))),
      data: (trip) {
        if (trip == null) return const Scaffold(body: Center(child: Text('Trip not found')));
        return Scaffold('''
)

# 2. Add closing brackets for the when block at the end of build method
content = content.replace(
    '''        ),
      ),
    );
  }

  Widget _buildInfoSection(String title, IconData icon, Color color, List<String> items) {''',
    '''        ),
      ),
    );
      },
    );
  }

  Widget _buildInfoSection(String title, IconData icon, Color color, List<String> items) {'''
)

# 3. Replace mock data with trip data
content = content.replace("'Himalayan Adventure'", "trip.title")
content = content.replace("imageUrl: _sampleImage", "imageUrl: trip.thumbnail?.url ?? _sampleImage")
content = content.replace("'Manali, HP'", "trip.location.city")
content = content.replace("'4n 5d'", "'\n \d'")
content = content.replace("'Experience the breathtaking beauty of the Himalayas in this 5-day adventure. Trek through scenic trails, explore ancient monasteries, and soak in the majestic mountain views. A journey you will never forget.'", "trip.description ?? trip.shortDescription ?? ''")

# Price replacements
content = content.replace("15000 * _guests", "trip.price.amount * _guests")
content = content.replace("'?15,000'", "'?\'")

# Inclusions / Exclusions
content = content.replace("['Accommodation (3-star)', 'All Meals (B, D)', 'Transportation', 'Guide']", "trip.inclusions ?? []")
content = content.replace("['Flights', 'Personal Expenses', 'Travel Insurance']", "trip.exclusions ?? []")

# Itinerary replacement
itinerary_mock = '''                // Itinerary
                ListView.builder(
                  padding: const EdgeInsets.all(20),
                  itemCount: 5,
                  itemBuilder: (context, i) => Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: AppColors.cardBg,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: AppColors.cardShadow,
                    ),
                    child: ExpansionTile(
                      tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      title: Text(
                        'Day \: \',
                        style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.darkText),
                      ),
                      iconColor: AppColors.goldDark,
                      collapsedIconColor: AppColors.grey500,
                      children: [
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                          child: Text(
                            'Morning: Breakfast at hotel\\nAfternoon: Guided trekking activity\\nEvening: Bonfire & local cuisine',
                            style: GoogleFonts.beVietnamPro(fontSize: 13, color: AppColors.surfaceVariantText, height: 1.6),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),'''

itinerary_real = '''                // Itinerary
                ListView.builder(
                  padding: const EdgeInsets.all(20),
                  itemCount: trip.itinerary?.length ?? 0,
                  itemBuilder: (context, i) {
                    final day = trip.itinerary![i];
                    return Container(
                      margin: const EdgeInsets.only(bottom: 12),
                      decoration: BoxDecoration(
                        color: AppColors.cardBg,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: AppColors.cardShadow,
                      ),
                      child: ExpansionTile(
                        tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                        title: Text(
                          'Day \: \',
                          style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, fontSize: 14, color: AppColors.darkText),
                        ),
                        iconColor: AppColors.goldDark,
                        collapsedIconColor: AppColors.grey500,
                        children: [
                          Padding(
                            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                            child: Text(
                              day.description ?? '',
                              style: GoogleFonts.beVietnamPro(fontSize: 13, color: AppColors.surfaceVariantText, height: 1.6),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),'''

content = content.replace(itinerary_mock, itinerary_real)

# Booking Sheet changes
# We need to pass trip to _openBookingSheet, so we can't just modify it directly if it's a separate method that doesn't accept trip.
# Or we can just access ref or pass trip as argument. Let's pass trip.
content = content.replace("void _openBookingSheet() {", "void _openBookingSheet(trip) {")
content = content.replace("_openBookingSheet,", "() => _openBookingSheet(trip),")
# We also need to map trip.dates to the date selection!
# The mock is: Row(children: ['Oct 15', 'Nov 02', 'Nov 20'].asMap().entries.map((e) {
# Let's replace that.

booking_dates_mock = '''              Row(
                children: ['Oct 15', 'Nov 02', 'Nov 20'].asMap().entries.map((e) {
                  final isSelected = _selectedDate == e.key;
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
                        e.value,
                        style: GoogleFonts.plusJakartaSans(
                          fontWeight: FontWeight.w700,
                          fontSize: 13,
                          color: isSelected ? AppColors.charcoal : AppColors.textMuted,
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),'''

booking_dates_real = '''              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: (trip.dates ?? []).asMap().entries.map((e) {
                    final isSelected = _selectedDate == e.key;
                    final date = e.value;
                    final displayDate = "\/\";
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
              ),'''

content = content.replace(booking_dates_mock, booking_dates_real)

with open('tripdekho_app/lib/presentation/screens/trips/trip_detail_screen.dart', 'w', encoding='utf-8') as f:
    f.write(content)
