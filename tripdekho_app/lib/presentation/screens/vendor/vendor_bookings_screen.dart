import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';

class VendorBookingsScreen extends StatelessWidget {
  const VendorBookingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        backgroundColor: const Color(0xFFF4F5F7),
        appBar: AppBar(
          title: Text('Manage Bookings', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -0.5)),
          backgroundColor: Colors.white,
          elevation: 0,
          scrolledUnderElevation: 0,
          iconTheme: const IconThemeData(color: AppColors.darkText),
          bottom: TabBar(
            labelColor: AppColors.amber500,
            unselectedLabelColor: AppColors.grey500,
            indicatorColor: AppColors.amber500,
            indicatorWeight: 3,
            labelStyle: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 14),
            unselectedLabelStyle: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, fontSize: 14),
            tabs: const [
              Tab(text: 'Upcoming'),
              Tab(text: 'Completed'),
              Tab(text: 'Cancelled'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildBookingsList('upcoming'),
            _buildBookingsList('completed'),
            _buildBookingsList('cancelled'),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingsList(String status) {
    return ListView.separated(
      padding: const EdgeInsets.all(24),
      itemCount: status == 'upcoming' ? 3 : (status == 'completed' ? 5 : 1),
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.grey.shade100),
            boxShadow: [BoxShadow(color: Colors.grey.shade200, blurRadius: 20, offset: const Offset(0, 10))],
          ),
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(8)),
                    child: Text('ID: #BKG-${1000 + index}', style: GoogleFonts.spaceMono(fontWeight: FontWeight.w700, fontSize: 10, color: AppColors.textMuted)),
                  ),
                  _buildStatusBadge(status),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Container(
                    width: 48, height: 48,
                    decoration: BoxDecoration(color: AppColors.amber500.withAlpha(30), borderRadius: BorderRadius.circular(16)),
                    alignment: Alignment.center,
                    child: Text('JD', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, color: AppColors.amber500)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('John Doe', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 16, color: AppColors.darkText)),
                        const SizedBox(height: 2),
                        Text('john.doe@example.com • +91 9876543210', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
                      ],
                    ),
                  )
                ],
              ),
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 16),
                child: Divider(height: 1, color: AppColors.outlineVariant),
              ),
              Text('Ladakh Expedition (5N/6D)', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 14, color: AppColors.darkText)),
              const SizedBox(height: 4),
              Row(
                children: [
                  Icon(Icons.calendar_month_rounded, size: 14, color: AppColors.grey500),
                  const SizedBox(width: 4),
                  Text('Oct 15 - Oct 20, 2024', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.grey500)),
                  const SizedBox(width: 16),
                  Icon(Icons.people_alt_rounded, size: 14, color: AppColors.grey500),
                  const SizedBox(width: 4),
                  Text('2 Guests', style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.grey500)),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('TOTAL AMOUNT', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 8, color: AppColors.textMuted, letterSpacing: 1.5)),
                      Text('₹45,000', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 18, color: Colors.green.shade700)),
                    ],
                  ),
                  if (status == 'upcoming')
                    ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.darkText,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        elevation: 0,
                      ),
                      child: Text('View Details', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 12)),
                    )
                ],
              )
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatusBadge(String status) {
    Color bgColor;
    Color textColor;
    String label;

    switch (status) {
      case 'upcoming':
        bgColor = AppColors.amber500.withAlpha(30);
        textColor = AppColors.amber500;
        label = 'UPCOMING';
        break;
      case 'completed':
        bgColor = Colors.green.shade50;
        textColor = Colors.green.shade700;
        label = 'COMPLETED';
        break;
      default:
        bgColor = Colors.red.shade50;
        textColor = Colors.red.shade700;
        label = 'CANCELLED';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w900, color: textColor, letterSpacing: 1.0),
      ),
    );
  }
}
