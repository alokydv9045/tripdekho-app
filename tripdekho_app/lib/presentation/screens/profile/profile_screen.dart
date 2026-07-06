import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../providers/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    if (user == null) {
      return Scaffold(
        backgroundColor: AppColors.bgCream,
        appBar: AppBar(title: const Text('Profile'), backgroundColor: Colors.white, elevation: 0),
        body: Center(
          child: ElevatedButton(
            onPressed: () {
              // trigger login bottom sheet
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primaryYellow, foregroundColor: AppColors.darkText),
            child: const Text('LOGIN TO VIEW PROFILE'),
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('My Profile', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () => context.push('/settings'),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Avatar & Name Card
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 32,
                      backgroundColor: AppColors.grey100,
                      backgroundImage: user.avatar != null ? NetworkImage(user.avatar!) : null,
                      child: user.avatar == null ? const Icon(Icons.person, size: 32, color: AppColors.grey500) : null,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(user.name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.darkText)),
                          const SizedBox(height: 4),
                          Text(user.email, style: const TextStyle(color: AppColors.grey500)),
                          if (user.phone != null) ...[
                            const SizedBox(height: 2),
                            Text(user.phone!, style: const TextStyle(color: AppColors.grey500)),
                          ]
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.edit_outlined, color: AppColors.primaryYellow),
                      onPressed: () {},
                    )
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // WanderPoints Balance
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFFFFD133), Color(0xFFF59E0B)]),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('WanderPoints Balance', style: TextStyle(color: AppColors.darkText, fontWeight: FontWeight.bold)),
                      SizedBox(height: 4),
                      Text('1,250 pts', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.darkText)),
                    ],
                  ),
                  const Icon(Icons.stars, size: 48, color: Colors.white54),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Stats Row
            Row(
              children: [
                Expanded(child: _buildStatCard('Bookings', '12')),
                const SizedBox(width: 12),
                Expanded(child: _buildStatCard('Spent', '₹1.2L')),
                const SizedBox(width: 12),
                Expanded(child: _buildStatCard('Reviews', '4')),
              ],
            ),
            const SizedBox(height: 32),

            // Quick Links
            const Align(alignment: Alignment.centerLeft, child: Text('Quick Links', style: TextStyle(fontWeight: FontWeight.bold, color: AppColors.grey500))),
            const SizedBox(height: 12),
            _buildLinkTile(Icons.shopping_bag_outlined, 'My Bookings', () => context.push('/bookings')),
            _buildLinkTile(Icons.favorite_border, 'Wishlist', () => context.push('/wishlist')),
            _buildLinkTile(Icons.message_outlined, 'Messages', () {}),
            _buildLinkTile(Icons.settings_outlined, 'Settings', () => context.push('/settings')),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: const BorderSide(color: AppColors.grey100)),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16),
        child: Column(
          children: [
            Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.darkText)),
            const SizedBox(height: 4),
            Text(label, style: const TextStyle(fontSize: 12, color: AppColors.grey500)),
          ],
        ),
      ),
    );
  }

  Widget _buildLinkTile(IconData icon, String title, VoidCallback onTap) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Icon(icon, color: AppColors.amber500),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        trailing: const Icon(Icons.chevron_right, color: AppColors.grey500),
        onTap: onTap,
      ),
    );
  }
}
