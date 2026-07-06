import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class VendorBookingsScreen extends StatelessWidget {
  const VendorBookingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 4,
      child: Scaffold(
        backgroundColor: AppColors.bgCream,
        appBar: AppBar(
          title: const Text('Customer Bookings', style: TextStyle(fontWeight: FontWeight.bold)),
          backgroundColor: Colors.white,
          elevation: 0,
          bottom: const TabBar(
            isScrollable: true,
            labelColor: AppColors.primaryYellow,
            unselectedLabelColor: AppColors.grey500,
            indicatorColor: AppColors.primaryYellow,
            tabs: [
              Tab(text: 'Pending'),
              Tab(text: 'Confirmed'),
              Tab(text: 'Completed'),
              Tab(text: 'Cancelled'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildVendorBookingsList('pending'),
            _buildVendorBookingsList('confirmed'),
            _buildVendorBookingsList('completed'),
            _buildVendorBookingsList('cancelled'),
          ],
        ),
      ),
    );
  }

  Widget _buildVendorBookingsList(String status) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 2,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('BK-100$index', style: const TextStyle(fontWeight: FontWeight.bold)),
                    _buildStatusBadge(status),
                  ],
                ),
                const SizedBox(height: 12),
                const Text('Customer: John Doe', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const Text('john@example.com | +91 9876543210', style: TextStyle(color: AppColors.grey500, fontSize: 12)),
                const SizedBox(height: 12),
                const Text('Himalayan Adventure', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.primaryYellow)),
                const Text('Oct 15, 2024 • 2 Guests', style: TextStyle(color: AppColors.grey500, fontSize: 12)),
                const Divider(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Amount Paid', style: TextStyle(color: AppColors.grey500)),
                    const Text('₹30,000', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Colors.green)),
                  ],
                ),
                if (status == 'pending') ...[
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {},
                          style: OutlinedButton.styleFrom(foregroundColor: Colors.red, side: const BorderSide(color: Colors.red)),
                          child: const Text('REJECT'),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.green, foregroundColor: Colors.white),
                          child: const Text('CONFIRM'),
                        ),
                      )
                    ],
                  )
                ]
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatusBadge(String status) {
    Color color;
    switch (status) {
      case 'confirmed':
        color = Colors.green;
        break;
      case 'pending':
        color = Colors.orange;
        break;
      case 'cancelled':
        color = Colors.red;
        break;
      default:
        color = AppColors.grey500;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
      child: Text(status.toUpperCase(), style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: color)),
    );
  }
}
