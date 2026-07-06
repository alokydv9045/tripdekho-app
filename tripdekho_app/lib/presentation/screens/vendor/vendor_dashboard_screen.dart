import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import 'package:go_router/go_router.dart';

class VendorDashboardScreen extends StatelessWidget {
  const VendorDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('Vendor Dashboard', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const UserAccountsDrawerHeader(
              decoration: BoxDecoration(color: AppColors.primaryYellow),
              accountName: Text('Himalayan Treks & Tours', style: TextStyle(color: AppColors.darkText, fontWeight: FontWeight.bold)),
              accountEmail: Text('vendor@example.com', style: TextStyle(color: AppColors.darkText)),
              currentAccountPicture: CircleAvatar(backgroundColor: Colors.white, child: Icon(Icons.store, color: AppColors.primaryYellow)),
            ),
            ListTile(leading: const Icon(Icons.dashboard), title: const Text('Dashboard'), onTap: () => context.pop()),
            ListTile(leading: const Icon(Icons.map), title: const Text('My Trips'), onTap: () { context.pop(); context.push('/vendor/trips'); }),
            ListTile(leading: const Icon(Icons.book_online), title: const Text('Bookings'), onTap: () { context.pop(); context.push('/vendor/bookings'); }),
            ListTile(leading: const Icon(Icons.analytics), title: const Text('Analytics'), onTap: () {}),
            ListTile(leading: const Icon(Icons.account_balance_wallet), title: const Text('Earnings'), onTap: () {}),
            const Divider(),
            ListTile(leading: const Icon(Icons.settings), title: const Text('Settings'), onTap: () {}),
            ListTile(leading: const Icon(Icons.logout, color: Colors.red), title: const Text('Logout', style: TextStyle(color: Colors.red)), onTap: () {}),
          ],
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Overview', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 1.5,
              children: [
                _buildStatCard('Total Revenue', '₹1,50,000', Icons.account_balance_wallet, Colors.green),
                _buildStatCard('Active Bookings', '12', Icons.book_online, Colors.blue),
                _buildStatCard('Average Rating', '4.8', Icons.star, Colors.amber),
                _buildStatCard('Published Trips', '5', Icons.map, Colors.purple),
              ],
            ),
            const SizedBox(height: 32),
            const Text('Recent Bookings', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: 3,
                separatorBuilder: (_, _) => const Divider(height: 1),
                itemBuilder: (context, index) => ListTile(
                  title: Text('John Doe - Trip $index', style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: const Text('Oct 15 - Oct 19 • 2 Guests'),
                  trailing: const Text('₹30,000', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green)),
                ),
              ),
            )
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/vendor/trips/create'),
        backgroundColor: AppColors.primaryYellow,
        icon: const Icon(Icons.add, color: AppColors.darkText),
        label: const Text('Create Trip', style: TextStyle(color: AppColors.darkText, fontWeight: FontWeight.bold)),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              children: [
                Icon(icon, color: color, size: 20),
                const SizedBox(width: 8),
                Expanded(child: Text(title, style: const TextStyle(fontSize: 12, color: AppColors.grey500), maxLines: 1, overflow: TextOverflow.ellipsis)),
              ],
            ),
            const Spacer(),
            Text(value, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
