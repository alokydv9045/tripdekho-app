import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/booking_provider.dart';
import '../../../data/models/booking_model.dart';
import 'package:intl/intl.dart';

class MyBookingsScreen extends ConsumerWidget {
  const MyBookingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final bookingsAsyncValue = ref.watch(fetchMyBookingsProvider);

    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        backgroundColor: AppColors.bgCream,
        elevation: 0,
        scrolledUnderElevation: 0,
        iconTheme: const IconThemeData(color: AppColors.darkText),
      ),
      body: bookingsAsyncValue.when(
        data: (bookings) {
          final totalSpent = bookings.fold<double>(0, (sum, item) => sum + (item.totalAmount ?? 0));
          final upcoming = bookings.where((b) => b.status == 'confirmed' || b.status == 'pending').length;
          final completed = bookings.where((b) => b.status == 'completed').length;

          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Text(
                  'YOUR JOURNEY LOG',
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
                      'ADVENTURES',
                      style: GoogleFonts.plusJakartaSans(fontSize: 28, fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -1.0),
                    ),
                  ],
                ),
                const SizedBox(height: 32),

                // Stats Banner (Grid)
                if (bookings.isNotEmpty)
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 2.2,
                    children: [
                      _buildStatCard(Icons.flight_takeoff_rounded, 'Total Trips', bookings.length.toString(), Colors.amber),
                      _buildStatCard(Icons.payments_rounded, 'Total Spent', '₹${NumberFormat.compact().format(totalSpent)}', Colors.green),
                      _buildStatCard(Icons.calendar_today_rounded, 'Upcoming', upcoming.toString(), Colors.blue),
                      _buildStatCard(Icons.star_rounded, 'Completed', completed.toString(), Colors.purple),
                    ],
                  ),
                
                const SizedBox(height: 32),
                
                // Bookings List
                if (bookings.isEmpty)
                  _buildEmptyState(context)
                else
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: bookings.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 24),
                    itemBuilder: (context, index) {
                      return _buildBookingCard(context, bookings[index]);
                    },
                  ),
                  
                const SizedBox(height: 40),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator(color: AppColors.goldPrimary)),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }

  Widget _buildStatCard(IconData icon, String label, String value, MaterialColor color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade100),
        boxShadow: [BoxShadow(color: Colors.black.withAlpha(5), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color.shade500, size: 18),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(value, style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkText)),
                Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 9, fontWeight: FontWeight.w900, color: AppColors.textMuted, letterSpacing: 1.0), maxLines: 1, overflow: TextOverflow.ellipsis),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildBookingCard(BuildContext context, BookingModel booking) {
    final trip = booking.trip;
    final dateString = booking.createdAt != null 
        ? DateFormat('MMM dd, yyyy').format(booking.createdAt!) 
        : 'TBD';
        
    Color statusBg, statusText, statusBorder;
    switch (booking.status?.toLowerCase()) {
      case 'completed':
        statusBg = Colors.green.shade50;
        statusText = Colors.green.shade700;
        statusBorder = Colors.green.shade200;
        break;
      case 'confirmed':
        statusBg = Colors.teal.shade50;
        statusText = Colors.teal.shade700;
        statusBorder = Colors.teal.shade200;
        break;
      case 'pending':
        statusBg = Colors.amber.shade50;
        statusText = Colors.amber.shade700;
        statusBorder = Colors.amber.shade200;
        break;
      case 'cancelled':
        statusBg = Colors.red.shade50;
        statusText = Colors.red.shade700;
        statusBorder = Colors.red.shade200;
        break;
      default:
        statusBg = Colors.grey.shade50;
        statusText = Colors.grey.shade700;
        statusBorder = Colors.grey.shade200;
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.grey.shade100),
        boxShadow: [BoxShadow(color: Colors.black.withAlpha(10), blurRadius: 20, offset: const Offset(0, 8))],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          // Image Section
          Stack(
            children: [
              Container(
                height: 180,
                width: double.infinity,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: NetworkImage(trip?.thumbnail?.url ?? 'https://images.unsplash.com/photo-1523606772308-64a28db0ef2c?q=80&w=400'),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              Positioned(
                top: 16,
                left: 16,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: statusBg,
                    border: Border.all(color: statusBorder),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    (booking.status ?? 'Unknown').toUpperCase(),
                    style: GoogleFonts.plusJakartaSans(fontSize: 9, fontWeight: FontWeight.w900, color: statusText, letterSpacing: 1.5),
                  ),
                ),
              ),
            ],
          ),
          
          // Content Section
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('ADVENTURE TRACKED', style: GoogleFonts.plusJakartaSans(fontSize: 9, fontWeight: FontWeight.w900, color: AppColors.amber500, letterSpacing: 1.5)),
                const SizedBox(height: 4),
                Text(trip?.title ?? 'Unknown Trip', style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -0.5)),
                
                const SizedBox(height: 20),
                
                // Info Grid
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildInfoColumn(Icons.calendar_today_rounded, 'Travel Date', dateString),
                    _buildInfoColumn(Icons.people_alt_rounded, 'Travelers', '${booking.guests ?? 2} Guests'),
                    _buildInfoColumn(Icons.sell_rounded, 'Pass ID', '#${booking.id.substring(0, 6).toUpperCase()}'),
                  ],
                ),
                
                const SizedBox(height: 24),
                const Divider(color: AppColors.outlineVariant, height: 1),
                const SizedBox(height: 24),
                
                // Footer
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Total Paid', style: GoogleFonts.plusJakartaSans(fontSize: 9, fontWeight: FontWeight.w900, color: AppColors.textMuted, letterSpacing: 1.5)),
                        const SizedBox(height: 4),
                        Text('₹${NumberFormat('#,##,###').format(booking.totalAmount ?? 0)}', style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkText)),
                      ],
                    ),
                    
                    Row(
                      children: [
                        if (booking.status == 'completed') ...[
                          IconButton(
                            icon: const Icon(Icons.rate_review_rounded, color: AppColors.amber500),
                            onPressed: () {},
                            style: IconButton.styleFrom(backgroundColor: Colors.amber.shade50),
                          ),
                          const SizedBox(width: 8),
                        ],
                        ElevatedButton(
                          onPressed: () => context.push('/bookings/${booking.id}'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: AppColors.darkText,
                            elevation: 0,
                            side: BorderSide(color: Colors.grey.shade200),
                            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          ),
                          child: Text('DETAILS', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                        ),
                      ],
                    )
                  ],
                )
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildInfoColumn(IconData icon, String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(8)),
              child: Icon(icon, size: 12, color: AppColors.amber500),
            ),
            const SizedBox(width: 8),
            Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 8, fontWeight: FontWeight.w900, color: AppColors.textMuted, letterSpacing: 1.0)),
          ],
        ),
        const SizedBox(height: 6),
        Text(value, style: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.darkText)),
      ],
    );
  }

  Widget _buildEmptyState(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(40),
        border: Border.all(color: Colors.grey.shade200, style: BorderStyle.solid),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.amber500.withAlpha(20),
              shape: BoxShape.circle,
              border: Border.all(color: AppColors.amber500.withAlpha(50)),
            ),
            child: const Icon(Icons.location_on_rounded, size: 40, color: AppColors.amber500),
          ),
          const SizedBox(height: 24),
          Text('NO ADVENTURES YET', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.amber500, letterSpacing: 2.0)),
          const SizedBox(height: 12),
          Text('Your log is empty', style: GoogleFonts.plusJakartaSans(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -0.5)),
          const SizedBox(height: 12),
          Text('Explore our premium curated trips and start your next legendary journey today.', textAlign: TextAlign.center, style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textMuted)),
          const SizedBox(height: 32),
          ElevatedButton.icon(
            onPressed: () => context.push('/trips'),
            icon: const Icon(Icons.flight_takeoff_rounded, size: 18),
            label: Text('FIND MY FIRST TRIP', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.amber500,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
          )
        ],
      ),
    );
  }
}
