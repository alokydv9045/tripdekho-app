import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../providers/auth_provider.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  bool emailAlerts = true;
  bool smsAlerts = false;
  bool marketingEmails = true;

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    
    return Scaffold(
      backgroundColor: AppColors.bgCream,
      appBar: AppBar(
        backgroundColor: AppColors.bgCream,
        elevation: 0,
        scrolledUnderElevation: 0,
        iconTheme: const IconThemeData(color: AppColors.darkText),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Page Header
            Text(
              'PREFERENCES',
              style: GoogleFonts.spaceMono(fontWeight: FontWeight.w700, fontSize: 10, color: AppColors.amber500, letterSpacing: 2.0),
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                Transform.rotate(
                  angle: -0.05,
                  child: Text(
                    'My ',
                    style: GoogleFonts.caveat(fontSize: 36, color: AppColors.amber500),
                  ),
                ),
                Text(
                  'SETTINGS',
                  style: GoogleFonts.plusJakartaSans(fontSize: 32, fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -1.0),
                ),
              ],
            ),
            const SizedBox(height: 32),
            
            // Account Overview
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(28),
                border: Border.all(color: AppColors.amber500.withAlpha(50)),
                boxShadow: [BoxShadow(color: Colors.black.withAlpha(5), blurRadius: 20, offset: const Offset(0, 10))],
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('ACCOUNT OVERVIEW', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: 1.5)),
                  const SizedBox(height: 16),
                  Text('Logged in as:', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted)),
                  const SizedBox(height: 4),
                  Text(user?.name ?? 'Guest', style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -0.5)),
                  const SizedBox(height: 2),
                  Text(
                    user?.email != null && !user!.email.contains('guest_') ? user.email : "Phone Authenticated", 
                    style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textMuted, letterSpacing: 1.0)
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Notifications
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: AppColors.amber500.withAlpha(50)),
                boxShadow: [BoxShadow(color: Colors.black.withAlpha(5), blurRadius: 20, offset: const Offset(0, 10))],
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.notifications_active_rounded, color: AppColors.amber500, size: 20),
                      const SizedBox(width: 12),
                      Text('NOTIFICATIONS', style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -0.5)),
                    ],
                  ),
                  const SizedBox(height: 24),
                  _buildToggleRow('Email Alerts', 'Receive email updates about bookings and itinerary details.', emailAlerts, (val) => setState(() => emailAlerts = val)),
                  const Divider(color: AppColors.outlineVariant, height: 32),
                  _buildToggleRow('SMS Alerts', 'Get real-time trip check-in updates and vendor responses via text message.', smsAlerts, (val) => setState(() => smsAlerts = val)),
                  const Divider(color: AppColors.outlineVariant, height: 32),
                  _buildToggleRow('Promo & Marketing', 'Stay informed about exclusive flight and hotel discounts.', marketingEmails, (val) => setState(() => marketingEmails = val)),
                ],
              ),
            ),
            
            const SizedBox(height: 32),
            
            // Danger Zone
            Container(
              decoration: BoxDecoration(
                color: Colors.red.shade50.withAlpha(128),
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: Colors.red.shade200.withAlpha(128)),
                boxShadow: [BoxShadow(color: Colors.red.withAlpha(5), blurRadius: 20, offset: const Offset(0, 10))],
              ),
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.gpp_maybe_rounded, color: Colors.red.shade600, size: 20),
                      const SizedBox(width: 12),
                      Text('DANGER ZONE', style: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.red.shade600, letterSpacing: -0.5)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Deleting your account is permanent. All of your trip bookings, itinerary history, and passport stamps will be deleted forever.',
                    style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w800, color: Colors.red.shade600.withAlpha(180), height: 1.5),
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton.icon(
                    onPressed: () {}, // Would show delete modal
                    icon: Icon(Icons.delete_outline_rounded, size: 16, color: Colors.red.shade600),
                    label: Text('CLOSE ACCOUNT', style: GoogleFonts.plusJakartaSans(fontSize: 9, fontWeight: FontWeight.w900, letterSpacing: 1.5, color: Colors.red.shade600)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red.shade50.withAlpha(200),
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: BorderSide(color: Colors.red.shade200)),
                    ),
                  )
                ],
              ),
            ),
            
            const SizedBox(height: 48),
            
            Center(
              child: TextButton.icon(
                onPressed: () {
                  ref.read(authProvider.notifier).logout();
                  context.go('/');
                },
                icon: const Icon(Icons.logout_rounded, color: AppColors.textMuted),
                label: Text(
                  'LOG OUT', 
                  style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5)
                ),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildToggleRow(String title, String subtitle, bool value, ValueChanged<bool> onChanged) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -0.2)),
              const SizedBox(height: 4),
              Text(subtitle, style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.textMuted)),
            ],
          ),
        ),
        const SizedBox(width: 16),
        Switch(
          value: value,
          onChanged: onChanged,
          activeColor: AppColors.amber500,
          activeTrackColor: AppColors.amber500.withAlpha(50),
          inactiveThumbColor: Colors.grey.shade400,
          inactiveTrackColor: Colors.grey.shade200,
        )
      ],
    );
  }
}
