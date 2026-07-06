import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../providers/auth_provider.dart';
import '../auth/login_bottom_sheet.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.user;

    if (user == null) {
      return Scaffold(
        backgroundColor: AppColors.bgCream,
        appBar: AppBar(
          title: Text('Profile', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, color: AppColors.darkText, fontSize: 18, letterSpacing: -0.3)),
          backgroundColor: AppColors.cardBg,
          elevation: 0,
        ),
        body: Center(
          child: GestureDetector(
            onTap: () => LoginBottomSheet.show(context),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
              decoration: BoxDecoration(
                color: AppColors.goldPrimary,
                borderRadius: BorderRadius.circular(12),
                boxShadow: AppColors.buttonShadow,
              ),
              child: Text(
                'LOGIN TO VIEW PROFILE',
                style: GoogleFonts.plusJakartaSans(
                  fontWeight: FontWeight.w800,
                  fontSize: 13,
                  letterSpacing: 1.0,
                  color: AppColors.charcoal,
                ),
              ),
            ),
          ),
        ),
      );
    }

    final isVendor = user.role == 'vendor';

    return Scaffold(
      backgroundColor: AppColors.bgCream,
      body: Stack(
        children: [
          // Background Ambience
          Positioned(
            top: -100,
            left: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppColors.goldPrimary.withAlpha(20),
              ),
            ),
          ),
          
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title Section
                  Text(
                    isVendor ? 'VENDOR IDENTIFICATION' : 'PERSONAL TRAVEL LOGS',
                    style: GoogleFonts.spaceMono(fontWeight: FontWeight.w700, fontSize: 10, color: AppColors.goldDark, letterSpacing: 2.0),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Transform.rotate(
                        angle: -0.05,
                        child: Text(
                          'My ',
                          style: GoogleFonts.caveat(fontSize: 40, color: AppColors.amber500),
                        ),
                      ),
                      Text(
                        isVendor ? 'BUSINESS ID' : 'PASSPORT',
                        style: GoogleFonts.plusJakartaSans(fontSize: 32, fontWeight: FontWeight.w900, color: AppColors.amber500, letterSpacing: -1.0),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // The Passport Card
                  Align(
                    alignment: Alignment.center,
                    child: _buildPassportCard(context, user, isVendor),
                  ),

                  const SizedBox(height: 32),

                  // Stats Row
                  if (isVendor) ...[
                    _buildStatTile(Icons.flight_takeoff_rounded, 'Total Trips', '12', Colors.amber),
                    _buildStatTile(Icons.people_alt_rounded, 'Total Bookings', '145', Colors.indigo),
                    _buildStatTile(Icons.star_rounded, 'Total Revenue', '₹2.4L', Colors.green),
                  ] else ...[
                    _buildStatTile(Icons.flight_takeoff_rounded, 'Completed Trips', '4', Colors.amber),
                    _buildStatTile(Icons.star_rounded, 'Reviews Written', '2', Colors.amber),
                  ],

                  const SizedBox(height: 32),

                  // My Information Panel
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(32),
                      border: Border.all(color: AppColors.amber500.withAlpha(50)),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withAlpha(5), blurRadius: 20, offset: const Offset(0, 4)),
                      ],
                    ),
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('MY INFORMATION', style: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w900, letterSpacing: -0.5, color: AppColors.darkText)),
                        const SizedBox(height: 16),
                        
                        _buildInfoTile(Icons.person_rounded, 'Full Name', user.name),
                        _buildDivider(),
                        _buildInfoTile(Icons.email_rounded, 'Email Address', user.email, isVerified: true),
                        _buildDivider(),
                        _buildInfoTile(Icons.phone_rounded, 'Phone Number', user.phone ?? 'Set Phone Number'),
                        _buildDivider(),
                        _buildInfoTile(Icons.calendar_today_rounded, 'Date of Birth', 'Set Date of Birth'),
                        _buildDivider(),
                        _buildInfoTile(Icons.location_on_rounded, 'I am from', 'Set Location'),
                        
                        const SizedBox(height: 24),
                        
                        _buildActionTile(Icons.favorite_rounded, 'Favorites', 'Saved Trips', () => context.push('/wishlist')),
                        _buildDivider(),
                        _buildActionTile(Icons.history_rounded, 'History', 'Transaction History', () => context.push('/bookings')),
                        _buildDivider(),
                        _buildActionTile(
                          Icons.logout_rounded, 
                          'Session', 
                          'Log Out', 
                          () => ref.read(authProvider.notifier).logout(),
                          isDestructive: true,
                        ),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPassportCard(BuildContext context, user, bool isVendor) {
    if (isVendor) {
      return Container(
        width: 340,
        height: 220,
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFFF59E0B), Color(0xFFD97706), Color(0xFFB45309)],
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: const Color(0xFFD97706).withAlpha(60), blurRadius: 50, offset: const Offset(0, 20))],
          border: Border.all(color: Colors.yellow.withAlpha(60), width: 2),
        ),
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('OFFICIAL VENDOR', style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w900, letterSpacing: 2.0)),
                    Text('TRIPDEKHO PARTNER NETWORK', style: GoogleFonts.spaceMono(color: Colors.yellow.shade200, fontSize: 8, fontWeight: FontWeight.w700, letterSpacing: 1.5)),
                  ],
                ),
                Icon(Icons.business_rounded, color: Colors.yellow.shade200.withAlpha(200), size: 32),
              ],
            ),
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: Colors.yellow.shade100,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.yellow.shade300, width: 2),
                  ),
                  child: Center(
                    child: Text(user.name[0].toUpperCase(), style: GoogleFonts.plusJakartaSans(color: Colors.amber.shade700, fontSize: 24, fontWeight: FontWeight.w900)),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildPassportField('BUSINESS NAME', user.name),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(child: _buildPassportField('LICENSE NO.', 'VN-${user.id.substring(user.id.length - 6).toUpperCase()}')),
                          Expanded(child: _buildPassportField('STATUS', 'VERIFIED')),
                        ],
                      )
                    ],
                  ),
                )
              ],
            )
          ],
        ),
      );
    }

    return Container(
      width: 300,
      height: 450,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFF59E0B), Color(0xFFD97706), Color(0xFFB45309)],
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: const Color(0xFFD97706).withAlpha(55), blurRadius: 50, offset: const Offset(0, 20))],
        border: Border.all(color: Colors.yellow.withAlpha(60), width: 2),
      ),
      child: Stack(
        children: [
          // Inner borders
          Positioned(
            top: 10, left: 10, right: 10, bottom: 10,
            child: Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.yellow.shade200.withAlpha(100)),
                borderRadius: BorderRadius.circular(16),
              ),
            ),
          ),
          Positioned(
            top: 14, left: 14, right: 14, bottom: 14,
            child: Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.yellow.shade200.withAlpha(50)),
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
          
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              children: [
                Text('REPUBLIC OF TRIPDEKHO', style: GoogleFonts.spaceMono(color: Colors.yellow.shade100, fontSize: 9, fontWeight: FontWeight.w700, letterSpacing: 2.0)),
                const SizedBox(height: 4),
                Text('PASSPORT • PASSEPORT', style: GoogleFonts.plusJakartaSans(color: Colors.yellow.shade50, fontSize: 18, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                
                const SizedBox(height: 24),
                
                // Globe Emblem + Avatar
                SizedBox(
                  height: 120,
                  width: 120,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Icon(Icons.language_rounded, size: 120, color: Colors.yellow.shade50.withAlpha(100)),
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: Colors.yellow.shade100,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.yellow.shade300, width: 2),
                          boxShadow: [BoxShadow(color: Colors.black.withAlpha(50), blurRadius: 10)],
                        ),
                        child: Center(
                          child: Text(user.name[0].toUpperCase(), style: GoogleFonts.plusJakartaSans(color: Colors.amber.shade700, fontSize: 32, fontWeight: FontWeight.w900)),
                        ),
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: Transform.rotate(
                          angle: -0.2,
                          child: Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.yellow.shade300.withAlpha(100), width: 2),
                              color: Colors.amber.shade500.withAlpha(25),
                            ),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text('APPROVED', style: GoogleFonts.caveat(color: Colors.yellow.shade200, fontSize: 10, fontWeight: FontWeight.bold)),
                                Text('VISA', style: GoogleFonts.spaceMono(color: Colors.yellow.shade300, fontSize: 6)),
                              ],
                            ),
                          ),
                        ),
                      )
                    ],
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // Details Grid
                Expanded(
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Expanded(child: _buildPassportField('SURNAME', user.name.split(' ').length > 1 ? user.name.split(' ').last : user.name)),
                          Expanded(child: _buildPassportField('GIVEN NAMES', user.name.split(' ').first)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(child: _buildPassportField('PASSPORT NO.', 'TD-${user.id.substring(user.id.length - 6).toUpperCase()}')),
                          Expanded(child: _buildPassportField('NATIONALITY', 'IND')),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('SIGNATURE', style: GoogleFonts.spaceMono(color: Colors.yellow.shade100.withAlpha(180), fontSize: 8, fontWeight: FontWeight.w700, letterSpacing: 1.0)),
                                Text(user.name, style: GoogleFonts.caveat(color: Colors.yellow.shade200, fontSize: 24, fontWeight: FontWeight.bold, height: 1.0)),
                              ],
                            ),
                          ),
                          Expanded(child: _buildPassportField('AUTHORITY', 'TRIPDEKHO')),
                        ],
                      ),
                    ],
                  ),
                ),
                
                // MRZ
                Text(
                  'P<IND<<${user.name.toUpperCase().replaceAll(' ', '<')}<<<<<<<<<<<<<<<<<<',
                  style: GoogleFonts.spaceMono(color: Colors.yellow.shade200.withAlpha(100), fontSize: 9, letterSpacing: 2.0),
                  maxLines: 1,
                  overflow: TextOverflow.clip,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPassportField(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.spaceMono(color: Colors.yellow.shade100.withAlpha(180), fontSize: 8, fontWeight: FontWeight.w700, letterSpacing: 1.0)),
        const SizedBox(height: 2),
        Text(value, style: GoogleFonts.plusJakartaSans(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w900, letterSpacing: 0.5)),
      ],
    );
  }

  Widget _buildStatTile(IconData icon, String label, String value, MaterialColor color) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.shade100.withAlpha(128)),
        boxShadow: [BoxShadow(color: Colors.black.withAlpha(2), blurRadius: 10, offset: const Offset(0, 2))],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: color.shade500),
              const SizedBox(width: 8),
              Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w900, letterSpacing: 1.0, color: AppColors.textMuted)),
            ],
          ),
          Text(value, style: GoogleFonts.plusJakartaSans(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.darkText)),
        ],
      ),
    );
  }

  Widget _buildInfoTile(IconData icon, String label, String value, {bool isVerified = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.amber500.withAlpha(30),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: AppColors.amber500, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.textMuted, letterSpacing: 1.5)),
                const SizedBox(height: 4),
                Text(value, style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w700, color: value.startsWith('Set') ? AppColors.textMuted : AppColors.darkText, fontStyle: value.startsWith('Set') ? FontStyle.italic : FontStyle.normal)),
              ],
            ),
          ),
          if (isVerified)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                border: Border.all(color: Colors.green.shade200),
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text('VERIFIED', style: GoogleFonts.plusJakartaSans(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.green.shade700)),
            )
          else
            const Icon(Icons.chevron_right_rounded, color: AppColors.outlineVariant),
        ],
      ),
    );
  }
  
  Widget _buildActionTile(IconData icon, String subtitle, String title, VoidCallback onTap, {bool isDestructive = false}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16.0),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDestructive ? Colors.red.shade50 : AppColors.amber500.withAlpha(30),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, color: isDestructive ? Colors.red.shade500 : AppColors.amber500, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(subtitle, style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w900, color: isDestructive ? Colors.red.shade300 : AppColors.textMuted, letterSpacing: 1.5)),
                  const SizedBox(height: 4),
                  Text(title, style: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w700, color: isDestructive ? Colors.red.shade500 : AppColors.darkText)),
                ],
              ),
            ),
            Icon(Icons.chevron_right_rounded, color: isDestructive ? Colors.red.shade200 : AppColors.outlineVariant),
          ],
        ),
      ),
    );
  }

  Widget _buildDivider() {
    return Divider(color: AppColors.amber500.withAlpha(30), height: 1);
  }
}


