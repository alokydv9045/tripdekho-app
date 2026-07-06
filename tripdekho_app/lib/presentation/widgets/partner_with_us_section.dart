import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';
import 'package:url_launcher/url_launcher.dart';

class PartnerWithUsSection extends StatelessWidget {
  const PartnerWithUsSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              RichText(
                text: TextSpan(
                  text: 'Partner With ',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    color: AppColors.darkText,
                    letterSpacing: -0.5,
                  ),
                  children: [
                    TextSpan(
                      text: 'Us',
                      style: GoogleFonts.caveat(
                        fontSize: 34,
                        fontWeight: FontWeight.w700,
                        color: AppColors.goldPrimary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Join our growing network of travel experts',
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.surfaceVariantText,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(child: _PartnerCard(title: 'Tour Operator', icon: Icons.explore_rounded, color: const Color(0xFF0EA5E9), bgColor: const Color(0xFFE0F2FE))),
                  const SizedBox(width: 16),
                  Expanded(child: _PartnerCard(title: 'Hotel & Stay', icon: Icons.hotel_rounded, color: const Color(0xFFF59E0B), bgColor: const Color(0xFFFEF3C7))),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(child: _PartnerCard(title: 'Transport', icon: Icons.directions_car_rounded, color: const Color(0xFF10B981), bgColor: const Color(0xFFD1FAE5))),
                  const SizedBox(width: 16),
                  Expanded(child: _PartnerCard(title: 'Local Guide', icon: Icons.person_pin_circle_rounded, color: const Color(0xFF8B5CF6), bgColor: const Color(0xFFEDE9FE))),
                ],
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 24),
        Center(
          child: ElevatedButton(
            onPressed: () async {
              final uri = Uri.parse('mailto:partner@tripdekho.com');
              if (await canLaunchUrl(uri)) {
                await launchUrl(uri);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.darkText,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: Text(
              'Become a Partner',
              style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, fontSize: 14),
            ),
          ),
        ),
      ],
    );
  }
}

class _PartnerCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final Color bgColor;

  const _PartnerCard({
    required this.title,
    required this.icon,
    required this.color,
    required this.bgColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.outline.withAlpha(40)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(5),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: bgColor,
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: GoogleFonts.plusJakartaSans(
              fontWeight: FontWeight.w700,
              fontSize: 14,
              color: AppColors.darkText,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
