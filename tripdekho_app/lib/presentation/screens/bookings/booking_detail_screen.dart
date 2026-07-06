import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class BookingDetailScreen extends ConsumerWidget {
  final String bookingId;
  const BookingDetailScreen({super.key, required this.bookingId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            backgroundColor: AppColors.bgCream,
            elevation: 0,
            scrolledUnderElevation: 0,
            pinned: true,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.darkText),
              onPressed: () => context.pop(),
            ),
            title: Text('Booking Details', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, color: AppColors.darkText, fontSize: 18, letterSpacing: -0.3)),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Pass ID
                  Text('PASS ID: #${bookingId.toUpperCase()}', style: GoogleFonts.spaceMono(fontWeight: FontWeight.w700, fontSize: 12, color: AppColors.textMuted, letterSpacing: 2.0)),
                  const SizedBox(height: 24),
                  
                  // Status Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.green.shade50,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: Colors.green.shade200),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.green.shade100,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.check_circle_rounded, color: Colors.green, size: 32),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Booking Confirmed', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 18, color: Colors.green.shade700, letterSpacing: -0.5)),
                              const SizedBox(height: 4),
                              Text('Your adventure awaits!', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, fontSize: 14, color: Colors.green.shade600)),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  
                  // Trip Details
                  Text('ADVENTURE SUMMARY', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 12, color: AppColors.textMuted, letterSpacing: 1.5)),
                  const SizedBox(height: 16),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(32),
                      border: Border.all(color: Colors.grey.shade100),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(5), blurRadius: 20, offset: const Offset(0, 10))],
                    ),
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Himalayan Expedition', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 22, color: AppColors.darkText, letterSpacing: -0.5)),
                        const SizedBox(height: 4),
                        Text('Ladakh, India', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, fontSize: 14, color: AppColors.textMuted)),
                        const SizedBox(height: 24),
                        const Divider(color: AppColors.outlineVariant),
                        const SizedBox(height: 24),
                        _buildInfoRow(Icons.calendar_month_rounded, 'Travel Date', 'Oct 15, 2024'),
                        const SizedBox(height: 16),
                        _buildInfoRow(Icons.people_alt_rounded, 'Guests', '2 Adults'),
                        const SizedBox(height: 16),
                        _buildInfoRow(Icons.timer_rounded, 'Duration', '6 Days, 5 Nights'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),
                  
                  // Payment Summary
                  Text('PAYMENT BREAKDOWN', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 12, color: AppColors.textMuted, letterSpacing: 1.5)),
                  const SizedBox(height: 16),
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(32),
                      border: Border.all(color: Colors.grey.shade100),
                      boxShadow: [BoxShadow(color: Colors.black.withAlpha(5), blurRadius: 20, offset: const Offset(0, 10))],
                    ),
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        _buildPriceRow('Base Price', '₹30,000'),
                        const SizedBox(height: 16),
                        _buildPriceRow('Taxes & Fees', '₹1,500'),
                        const SizedBox(height: 16),
                        _buildPriceRow('Discount', '-₹1,500', isDiscount: true),
                        const SizedBox(height: 24),
                        const Divider(color: AppColors.outlineVariant),
                        const SizedBox(height: 24),
                        _buildPriceRow('Total Paid', '₹30,000', isTotal: true),
                      ],
                    ),
                  ),
                  const SizedBox(height: 40),

                  // Actions
                  ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.file_download_outlined, size: 20),
                    label: Text('DOWNLOAD INVOICE', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, letterSpacing: 1.5, fontSize: 12)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.darkText,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      elevation: 0,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.cancel_outlined, color: Colors.red),
                    label: Text('CANCEL BOOKING', style: GoogleFonts.plusJakartaSans(color: Colors.red, fontWeight: FontWeight.w900, letterSpacing: 1.5, fontSize: 12)),
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    ),
                  ),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(12)),
          child: Icon(icon, size: 18, color: AppColors.amber500),
        ),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label.toUpperCase(), style: GoogleFonts.plusJakartaSans(fontSize: 9, fontWeight: FontWeight.w900, color: AppColors.textMuted, letterSpacing: 1.0)),
            const SizedBox(height: 4),
            Text(value, style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkText)),
          ],
        )
      ],
    );
  }

  Widget _buildPriceRow(String label, String value, {bool isDiscount = false, bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          isTotal ? label.toUpperCase() : label, 
          style: GoogleFonts.plusJakartaSans(
            color: isTotal ? AppColors.darkText : AppColors.textMuted,
            fontWeight: isTotal ? FontWeight.w900 : FontWeight.w700,
            fontSize: isTotal ? 14 : 14,
            letterSpacing: isTotal ? 1.5 : 0,
          )
        ),
        Text(
          value, 
          style: GoogleFonts.plusJakartaSans(
            color: isDiscount ? Colors.green.shade600 : AppColors.darkText,
            fontWeight: FontWeight.w900,
            fontSize: isTotal ? 24 : 16,
            letterSpacing: isTotal ? -0.5 : 0,
          )
        ),
      ],
    );
  }
}
