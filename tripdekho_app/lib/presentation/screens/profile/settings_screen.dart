import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../providers/auth_provider.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        title: const Text('Settings', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionHeader('PREFERENCES'),
            _buildToggleTile(Icons.notifications_active_outlined, 'Push Notifications', true, (v){}),
            _buildToggleTile(Icons.dark_mode_outlined, 'Dark Mode', false, (v){}),
            _buildToggleTile(Icons.email_outlined, 'Email Promos', true, (v){}),
            
            _buildSectionHeader('ACCOUNT'),
            _buildActionTile(Icons.lock_outline, 'Change Password', () {}),
            _buildActionTile(Icons.card_giftcard, 'Refer & Earn', () {}),
            
            _buildSectionHeader('ABOUT'),
            _buildActionTile(Icons.info_outline, 'About TripDekho', () {}),
            _buildActionTile(Icons.description_outlined, 'Terms of Service', () {}),
            _buildActionTile(Icons.privacy_tip_outlined, 'Privacy Policy', () {}),
            
            const SizedBox(height: 32),
            Center(
              child: TextButton.icon(
                onPressed: () {
                  ref.read(authProvider.notifier).logout();
                  context.go('/');
                },
                icon: const Icon(Icons.logout, color: AppColors.redBadge),
                label: const Text('LOG OUT', style: TextStyle(color: AppColors.redBadge, fontWeight: FontWeight.bold)),
              ),
            ),
            const SizedBox(height: 8),
            Center(
              child: TextButton(
                onPressed: () {
                  // Delete account flow
                },
                child: const Text('Delete Account', style: TextStyle(color: AppColors.grey500)),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 16, right: 16, top: 24, bottom: 8),
      child: Text(
        title,
        style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.grey500, fontSize: 12, letterSpacing: 1.2),
      ),
    );
  }

  Widget _buildToggleTile(IconData icon, String title, bool value, ValueChanged<bool> onChanged) {
    return Container(
      color: Colors.white,
      child: ListTile(
        leading: Icon(icon, color: AppColors.darkText),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
        trailing: Switch(
          value: value,
          onChanged: onChanged,
          activeThumbColor: AppColors.primaryYellow,
        ),
      ),
    );
  }

  Widget _buildActionTile(IconData icon, String title, VoidCallback onTap) {
    return Container(
      color: Colors.white,
      child: ListTile(
        leading: Icon(icon, color: AppColors.darkText),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
        trailing: const Icon(Icons.chevron_right, color: AppColors.grey500),
        onTap: onTap,
      ),
    );
  }
}
