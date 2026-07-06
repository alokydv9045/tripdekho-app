import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('Notifications', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: () {},
            child: const Text('Mark all as read', style: TextStyle(color: AppColors.primaryYellow, fontWeight: FontWeight.bold)),
          )
        ],
      ),
      body: ListView.separated(
        itemCount: 8,
        separatorBuilder: (context, index) => const Divider(height: 1),
        itemBuilder: (context, index) {
          final isUnread = index < 3;
          return Container(
            color: isUnread ? Colors.amber.shade50 : Colors.white,
            child: ListTile(
              contentPadding: const EdgeInsets.all(16),
              leading: CircleAvatar(
                backgroundColor: index % 2 == 0 ? Colors.green.shade100 : AppColors.primaryYellow.withValues(alpha: 0.2),
                child: Icon(
                  index % 2 == 0 ? Icons.check_circle : Icons.local_offer,
                  color: index % 2 == 0 ? Colors.green : AppColors.amber500,
                ),
              ),
              title: Text(
                index % 2 == 0 ? 'Booking Confirmed!' : 'New Offer on Himalayan Treks',
                style: TextStyle(fontWeight: isUnread ? FontWeight.bold : FontWeight.normal),
              ),
              subtitle: const Padding(
                padding: EdgeInsets.only(top: 4.0),
                child: Text('Tap to view the details of your upcoming trip to Manali.'),
              ),
              trailing: Text('2h ago', style: TextStyle(color: AppColors.grey500, fontSize: 12)),
            ),
          );
        },
      ),
    );
  }
}
