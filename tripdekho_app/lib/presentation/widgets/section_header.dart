import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';

class SectionHeader extends StatelessWidget {
  final String title;
  final String? highlightText;
  final IconData? icon;
  final String? viewAllText;
  final VoidCallback? onViewAll;

  const SectionHeader({
    super.key,
    required this.title,
    this.highlightText,
    this.icon,
    this.viewAllText,
    this.onViewAll,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                if (icon != null) ...[
                  Icon(icon, color: AppColors.amber500, size: 28),
                  const SizedBox(width: 8),
                ],
                Expanded(
                  child: RichText(
                    text: TextSpan(
                      text: '$title ',
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 26,
                        fontWeight: FontWeight.w900,
                        color: AppColors.darkText,
                        letterSpacing: -0.5,
                        height: 1.1,
                      ),
                      children: [
                        if (highlightText != null)
                          TextSpan(
                            text: highlightText,
                            style: GoogleFonts.plusJakartaSans(
                              color: AppColors.goldPrimary,
                            ),
                          ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          if (viewAllText != null && onViewAll != null)
            GestureDetector(
              onTap: onViewAll,
              child: Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      viewAllText!,
                      style: GoogleFonts.plusJakartaSans(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: AppColors.darkText,
                      ),
                    ),
                    const SizedBox(width: 2),
                    const Icon(Icons.chevron_right_rounded, color: AppColors.darkText, size: 18),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
