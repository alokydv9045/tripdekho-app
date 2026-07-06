import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import 'package:go_router/go_router.dart';

class MyBookingsScreen extends StatelessWidget {
  const MyBookingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        backgroundColor: AppColors.bgCream,
        appBar: AppBar(
          title: const Text('My Bookings', style: TextStyle(fontWeight: FontWeight.bold)),
          backgroundColor: Colors.white,
          elevation: 0,
          bottom: const TabBar(
            labelColor: AppColors.primaryYellow,
            unselectedLabelColor: AppColors.grey500,
            indicatorColor: AppColors.primaryYellow,
            tabs: [
              Tab(text: 'Upcoming'),
              Tab(text: 'Completed'),
              Tab(text: 'Cancelled'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildBookingsList(context, 'confirmed'),
            _buildBookingsList(context, 'completed'),
            _buildBookingsList(context, 'cancelled'),
          ],
        ),
      ),
    );
  }

  Widget _buildBookingsList(BuildContext context, String status) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: status == 'cancelled' ? 0 : 3,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: InkWell(
            onTap: () {
              context.push('/bookings/BK-100$index');
            },
            borderRadius: BorderRadius.circular(16),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: status == 'confirmed' ? Colors.green.shade100 : Colors.blue.shade100,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          status.toUpperCase(),
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: status == 'confirmed' ? Colors.green.shade800 : Colors.blue.shade800,
                          ),
                        ),
                      ),
                      Text('BK-100$index', style: const TextStyle(color: AppColors.grey500, fontSize: 12)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const Text('Himalayan Adventure', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Row(
                    children: const [
                      Icon(Icons.calendar_today, size: 14, color: AppColors.grey500),
                      SizedBox(width: 8),
                      Text('Oct 15, 2024 - Oct 19, 2024', style: TextStyle(color: AppColors.grey500, fontSize: 12)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: const [
                      Icon(Icons.people_outline, size: 14, color: AppColors.grey500),
                      SizedBox(width: 8),
                      Text('2 Guests', style: TextStyle(color: AppColors.grey500, fontSize: 12)),
                    ],
                  ),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('Total Paid', style: TextStyle(color: AppColors.grey500)),
                      Text('₹30,000', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    ],
                  )
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
