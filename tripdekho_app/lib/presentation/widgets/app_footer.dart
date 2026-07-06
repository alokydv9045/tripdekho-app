import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';

class AppFooter extends StatelessWidget {
  const AppFooter({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: const Color(0xFF141414), // Dark grey/black background
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Logo and Intro
          Row(
            children: [
              Image.asset(
                'assets/images/sm-logo.png',
                height: 40,
                color: Colors.white, // Tint to white for the dark footer
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Your premium, next-generation travel booking and AI custom planning platform.',
            style: GoogleFonts.beVietnamPro(
              color: Colors.white.withAlpha(160),
              fontSize: 14,
              height: 1.6,
            ),
          ),
          const SizedBox(height: 32),

          // Get the App Box
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A1A),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withAlpha(20)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Get the TripDekho App',
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.w800,
                    fontSize: 18,
                    color: Colors.white,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  'Book trips seamlessly on the go.',
                  style: GoogleFonts.beVietnamPro(
                    color: Colors.white.withAlpha(160),
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.apple_rounded, color: Colors.black),
                    label: Text('App Store', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, color: Colors.black)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    onPressed: () {},
                    icon: const Icon(Icons.play_arrow_rounded, color: Colors.green),
                    label: Text('Play Store', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, color: Colors.black)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 48),

          // Exclusive Deals
          Row(
            children: [
              const Icon(Icons.auto_awesome_rounded, color: AppColors.goldPrimary, size: 18),
              const SizedBox(width: 8),
              Text(
                'EXCLUSIVE DEALS',
                style: GoogleFonts.plusJakartaSans(
                  fontWeight: FontWeight.w900,
                  fontSize: 14,
                  letterSpacing: 1.5,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Get the most beautiful travel stories and deals delivered to your inbox every week.',
            style: GoogleFonts.beVietnamPro(
              color: Colors.white.withAlpha(160),
              fontSize: 13,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A1A),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withAlpha(20)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    style: GoogleFonts.beVietnamPro(color: Colors.white, fontSize: 13),
                    decoration: InputDecoration(
                      hintText: 'ENTER YOUR EMAIL',
                      hintStyle: GoogleFonts.plusJakartaSans(
                        color: Colors.white.withAlpha(80),
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 1.2,
                      ),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFACC15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Text(
                        'JOIN',
                        style: GoogleFonts.plusJakartaSans(
                          fontWeight: FontWeight.w800,
                          fontSize: 12,
                          letterSpacing: 1.0,
                          color: AppColors.darkText,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(Icons.send_rounded, size: 14, color: AppColors.darkText),
                    ],
                  ),
                )
              ],
            ),
          ),
          const SizedBox(height: 48),

          // Policies
          Text(
            'POLICIES',
            style: GoogleFonts.plusJakartaSans(
              fontWeight: FontWeight.w900,
              fontSize: 14,
              letterSpacing: 1.5,
              color: const Color(0xFFFACC15),
            ),
          ),
          const SizedBox(height: 16),
          _buildFooterLink('Guest policies'),
          _buildFooterLink('Privacy policies'),
          _buildFooterLink('Refund policy'),
          _buildFooterLink('Terms & conditions'),
          const SizedBox(height: 48),

          // Contact
          Text(
            'CONTACT',
            style: GoogleFonts.plusJakartaSans(
              fontWeight: FontWeight.w900,
              fontSize: 14,
              letterSpacing: 1.5,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Icon(Icons.phone_outlined, color: AppColors.goldPrimary, size: 16),
              const SizedBox(width: 12),
              Text('+91-9876543210', style: GoogleFonts.beVietnamPro(color: Colors.white.withAlpha(160), fontSize: 13, fontWeight: FontWeight.w500)),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Icon(Icons.email_outlined, color: AppColors.goldPrimary, size: 16),
              const SizedBox(width: 12),
              Text('support@tripdekho.com', style: GoogleFonts.beVietnamPro(color: Colors.white.withAlpha(160), fontSize: 13, fontWeight: FontWeight.w500)),
            ],
          ),
          const SizedBox(height: 48),
          
          Container(height: 1, color: Colors.white.withAlpha(20)),
          const SizedBox(height: 24),

          // Copyright
          Center(
            child: Text(
              'TripDekho © 2026 All Rights Reserved',
              style: GoogleFonts.plusJakartaSans(
                color: const Color(0xFF38BDF8),
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Center(
            child: Text(
              'Admin Login',
              style: GoogleFonts.plusJakartaSans(
                color: Colors.white.withAlpha(100),
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          const SizedBox(height: 60), // Extra padding for FABs
        ],
      ),
    );
  }

  Widget _buildFooterLink(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Text(
        title,
        style: GoogleFonts.beVietnamPro(
          color: Colors.white.withAlpha(160),
          fontSize: 14,
        ),
      ),
    );
  }
}
