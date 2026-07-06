import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class BookingDetailScreen extends StatelessWidget {
  final String bookingId;
  const BookingDetailScreen({super.key, required this.bookingId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: Text('Booking $bookingId'),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Status Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.green.shade200),
              ),
              child: Row(
                children: [
                  const Icon(Icons.check_circle, color: Colors.green, size: 32),
                  const SizedBox(width: 16),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('Booking Confirmed', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.green)),
                      Text('Your trip is ready to go!', style: TextStyle(color: Colors.green)),
                    ],
                  )
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Trip Details
            const Text('Trip Details', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 12),
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    const ListTile(
                      contentPadding: EdgeInsets.zero,
                      title: Text('Himalayan Adventure', style: TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Text('Manali, Himachal Pradesh'),
                      trailing: Text('4n 5d', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primaryYellow)),
                    ),
                    const Divider(),
                    _buildInfoRow(Icons.calendar_today, 'Departure', 'Oct 15, 2024'),
                    const SizedBox(height: 8),
                    _buildInfoRow(Icons.people, 'Guests', '2 Adults'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Payment Details
            const Text('Payment Summary', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 12),
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    _buildPriceRow('Base Price (2 Adults)', '₹30,000'),
                    const SizedBox(height: 8),
                    _buildPriceRow('Taxes & Fees', '₹1,500'),
                    const SizedBox(height: 8),
                    _buildPriceRow('Discount', '-₹1,500', isDiscount: true),
                    const Divider(height: 24),
                    _buildPriceRow('Total Amount', '₹30,000', isTotal: true),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 32),

            // Actions
            ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.download),
              label: const Text('DOWNLOAD INVOICE'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: AppColors.darkText,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: const BorderSide(color: AppColors.grey100)),
              ),
            ),
            const SizedBox(height: 12),
            TextButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.cancel_outlined, color: AppColors.redBadge),
              label: const Text('Cancel Booking', style: TextStyle(color: AppColors.redBadge)),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.grey500),
        const SizedBox(width: 8),
        Text(label, style: const TextStyle(color: AppColors.grey500)),
        const Spacer(),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildPriceRow(String label, String value, {bool isDiscount = false, bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: TextStyle(
          color: isTotal ? AppColors.darkText : AppColors.grey500,
          fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
        )),
        Text(value, style: TextStyle(
          color: isDiscount ? Colors.green : AppColors.darkText,
          fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
          fontSize: isTotal ? 18 : 14,
        )),
      ],
    );
  }
}
