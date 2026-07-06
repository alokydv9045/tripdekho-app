import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';

class FaqScreen extends StatelessWidget {
  const FaqScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('FAQ', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: 5,
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: ExpansionTile(
              title: const Text('How do I cancel my booking?', style: TextStyle(fontWeight: FontWeight.bold)),
              children: const [
                Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Text('You can cancel your booking directly from the My Bookings section in your profile. Please refer to our cancellation policy for details on refunds.', style: TextStyle(color: AppColors.grey500)),
                )
              ],
            ),
          );
        },
      ),
    );
  }
}
