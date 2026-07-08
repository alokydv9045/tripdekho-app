import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

// Mock provider for Vendor Bookings since backend might not have this yet
final vendorBookingsProvider = FutureProvider<List<Map<String, dynamic>>>((ref) async {
  await Future.delayed(const Duration(seconds: 1));
  return [
    {
      'id': 'B1',
      'tripTitle': 'Himalayan Trek',
      'customerName': 'Alok Yadav',
      'date': DateTime.now().add(const Duration(days: 5)),
      'guests': 2,
      'amount': 2400.0,
      'status': 'confirmed'
    },
    {
      'id': 'B2',
      'tripTitle': 'Goa Beach Resort',
      'customerName': 'John Doe',
      'date': DateTime.now().add(const Duration(days: 12)),
      'guests': 4,
      'amount': 1500.0,
      'status': 'pending'
    },
  ];
});

class VendorBookingsScreen extends ConsumerWidget {
  const VendorBookingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final bookingsAsync = ref.watch(vendorBookingsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Recent Bookings')),
      body: bookingsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
        data: (bookings) {
          if (bookings.isEmpty) return const Center(child: Text('No bookings yet'));

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: bookings.length,
            itemBuilder: (context, index) {
              final booking = bookings[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              booking['tripTitle'],
                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: booking['status'] == 'confirmed' ? Colors.green.withOpacity(0.1) : Colors.orange.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              booking['status'].toString().toUpperCase(),
                              style: TextStyle(
                                color: booking['status'] == 'confirmed' ? Colors.green : Colors.orange,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Text('Customer: ${booking['customerName']}', style: TextStyle(color: theme.colorScheme.onSurface.withOpacity(0.7))),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                          const SizedBox(width: 8),
                          Text(DateFormat('MMM d, yyyy').format(booking['date'])),
                          const Spacer(),
                          const Icon(Icons.people, size: 16, color: Colors.grey),
                          const SizedBox(width: 8),
                          Text('${booking['guests']} Guests'),
                        ],
                      ),
                      const Divider(height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Total Value', style: TextStyle(color: Colors.grey)),
                          Text(
                            '\$${booking['amount'].toStringAsFixed(2)}',
                            style: TextStyle(
                              color: theme.colorScheme.primary,
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
