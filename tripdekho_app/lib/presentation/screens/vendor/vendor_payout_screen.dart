import 'package:flutter/material.dart';

class VendorPayoutScreen extends StatelessWidget {
  const VendorPayoutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Payouts & Earnings')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary,
                borderRadius: BorderRadius.circular(24),
              ),
              child: Column(
                children: [
                  Text('Available Balance', style: TextStyle(color: theme.colorScheme.onPrimary.withOpacity(0.8))),
                  const SizedBox(height: 8),
                  Text('\$4,250.00', style: TextStyle(color: theme.colorScheme.onPrimary, fontSize: 36, fontWeight: FontWeight.w900)),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.colorScheme.onPrimary,
                      foregroundColor: theme.colorScheme.primary,
                      minimumSize: const Size(double.infinity, 50),
                    ),
                    child: const Text('Withdraw Funds', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            Text('Transaction History', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const CircleAvatar(backgroundColor: Colors.green, child: Icon(Icons.arrow_upward, color: Colors.white)),
              title: const Text('Withdrawal to Bank ****1234'),
              subtitle: const Text('May 15, 2024'),
              trailing: const Text('-\$2,000.00', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.red)),
            ),
            const Divider(),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: CircleAvatar(backgroundColor: theme.colorScheme.primaryContainer, child: Icon(Icons.luggage, color: theme.colorScheme.primary)),
              title: const Text('Booking: Himalayan Trek'),
              subtitle: const Text('May 12, 2024'),
              trailing: const Text('+\$800.00', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
            ),
          ],
        ),
      ),
    );
  }
}
