import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';
import 'package:go_router/go_router.dart';

class VendorDashboardScreen extends StatelessWidget {
  const VendorDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        scrolledUnderElevation: 0,
        leading: Builder(
          builder: (context) => IconButton(
            icon: const Icon(Icons.menu_rounded, color: AppColors.darkText),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded, color: AppColors.darkText),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      drawer: _buildDrawer(context),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(color: AppColors.amber500, borderRadius: BorderRadius.circular(20)),
                  child: Text('Vendor Portal', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 8, letterSpacing: 1.5)),
                ),
                const SizedBox(width: 12),
                Row(
                  children: [
                    const Icon(Icons.check_circle_rounded, color: Colors.green, size: 12),
                    const SizedBox(width: 4),
                    Text('System Live', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 8, color: Colors.green, letterSpacing: 1.5)),
                  ],
                )
              ],
            ),
            const SizedBox(height: 12),
            Text('Hello,', style: GoogleFonts.plusJakartaSans(fontSize: 32, fontWeight: FontWeight.w900, color: AppColors.darkText, height: 1.0, letterSpacing: -1.0)),
            Text('Vendor!', style: GoogleFonts.plusJakartaSans(fontSize: 32, fontWeight: FontWeight.w900, color: AppColors.amber500, height: 1.0, letterSpacing: -1.0)),
            const SizedBox(height: 8),
            Text('Manage your trips and track your growth', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 10, color: AppColors.textMuted, letterSpacing: 1.5)),
            
            const SizedBox(height: 32),

            // Stat Cards Grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              childAspectRatio: 0.85,
              children: [
                _buildStatCard('Total Revenue', '₹1,50,000', Icons.attach_money_rounded, Colors.green.shade600, Colors.green.shade50, '+12%'),
                _buildStatCard('Total Bookings', '124', Icons.people_alt_rounded, Colors.blue.shade600, Colors.blue.shade50, '+5%'),
                _buildStatCard('Active Trips', '12', Icons.layers_rounded, AppColors.amber500, AppColors.amber500.withAlpha(30), '0%'),
                _buildStatCard('Avg Rating', '4.8', Icons.star_rounded, Colors.purple.shade600, Colors.purple.shade50, '4.8', isRating: true),
              ],
            ),
            const SizedBox(height: 40),

            // Analytics / Recent Bookings Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text('Recent ', style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -0.5)),
                        Text('Bookings', style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.amber500, letterSpacing: -0.5)),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text('LATEST ACTIVITY', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 8, color: AppColors.textMuted, letterSpacing: 2.0)),
                  ],
                ),
                TextButton(
                  onPressed: () => context.push('/vendor/bookings'),
                  child: Text('View All', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, color: AppColors.darkText, fontSize: 12)),
                )
              ],
            ),
            const SizedBox(height: 24),

            // Recent Bookings List
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(32),
                border: Border.all(color: Colors.grey.shade100),
                boxShadow: [BoxShadow(color: Colors.grey.shade200, blurRadius: 20, offset: const Offset(0, 10))],
              ),
              child: ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: 3,
                padding: const EdgeInsets.symmetric(vertical: 8),
                separatorBuilder: (_, _) => Divider(color: Colors.grey.shade100, height: 1),
                itemBuilder: (context, index) {
                  return ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                    leading: Container(
                      width: 48, height: 48,
                      decoration: BoxDecoration(color: Colors.grey.shade50, borderRadius: BorderRadius.circular(16)),
                      alignment: Alignment.center,
                      child: Text('JD', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, color: AppColors.darkText)),
                    ),
                    title: Text('John Doe', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, color: AppColors.darkText, fontSize: 14)),
                    subtitle: Padding(
                      padding: const EdgeInsets.only(top: 4.0),
                      child: Text('Ladakh Expedition • 2 Guests', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, color: AppColors.textMuted, fontSize: 10)),
                    ),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('₹45,000', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, color: Colors.green.shade600, fontSize: 14)),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(4)),
                          child: Text('PAID', style: GoogleFonts.spaceMono(fontWeight: FontWeight.w700, fontSize: 8, color: Colors.green.shade700)),
                        )
                      ],
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 100), // padding for FAB
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/vendor/trips/create'),
        backgroundColor: AppColors.darkText,
        elevation: 10,
        
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        icon: const Icon(Icons.add_rounded, color: AppColors.amber500),
        label: Text('POST NEW TRIP', style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 1.0)),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color iconColor, Color bgColor, String growth, {bool isRating = false}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: Colors.grey.shade100),
        boxShadow: [BoxShadow(color: Colors.grey.shade200, blurRadius: 20, offset: const Offset(0, 10))],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(icon, color: iconColor, size: 24),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: isRating ? AppColors.amber500.withAlpha(30) : Colors.green.shade50,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(growth, style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 10, color: isRating ? AppColors.amber500 : Colors.green.shade700)),
              )
            ],
          ),
          const Spacer(),
          Text(title.toUpperCase(), style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 8, color: AppColors.textMuted, letterSpacing: 1.5)),
          const SizedBox(height: 4),
          Text(value, style: GoogleFonts.plusJakartaSans(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -1.0)),
        ],
      ),
    );
  }

  Widget _buildDrawer(BuildContext context) {
    return Drawer(
      backgroundColor: Colors.white,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.only(top: 60, left: 24, right: 24, bottom: 24),
            width: double.infinity,
            decoration: const BoxDecoration(
              color: AppColors.darkText,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 64, height: 64,
                  decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.amber500),
                  alignment: Alignment.center,
                  child: const Icon(Icons.storefront_rounded, color: AppColors.darkText, size: 32),
                ),
                const SizedBox(height: 16),
                Text('Himalayan Treks', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 18, color: Colors.white)),
                Text('vendor@example.com', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, fontSize: 12, color: Colors.grey.shade400)),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(vertical: 16),
              children: [
                _buildDrawerItem(Icons.dashboard_rounded, 'Dashboard', true, () => context.pop()),
                _buildDrawerItem(Icons.map_rounded, 'My Trips', false, () { context.pop(); context.push('/vendor/trips'); }),
                _buildDrawerItem(Icons.confirmation_number_rounded, 'Bookings', false, () { context.pop(); context.push('/vendor/bookings'); }),
                const Padding(padding: EdgeInsets.symmetric(vertical: 8), child: Divider(color: AppColors.outlineVariant)),
                _buildDrawerItem(Icons.settings_rounded, 'Settings', false, () {}),
                _buildDrawerItem(Icons.logout_rounded, 'Logout', false, () {}, color: Colors.red),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItem(IconData icon, String title, bool isSelected, VoidCallback onTap, {Color color = AppColors.darkText}) {
    return ListTile(
      leading: Icon(icon, color: isSelected ? AppColors.amber500 : color, size: 24),
      title: Text(title, style: GoogleFonts.plusJakartaSans(fontWeight: isSelected ? FontWeight.w900 : FontWeight.w700, fontSize: 14, color: color)),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 24),
      tileColor: isSelected ? AppColors.amber500.withAlpha(20) : Colors.transparent,
    );
  }
}
