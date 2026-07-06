import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// Full ThemeData for TripDekho — mirrors web frontend's design system.
class AppTheme {
  static ThemeData get theme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme(
        brightness: Brightness.light,
        primary: AppColors.goldPrimary,
        onPrimary: AppColors.charcoal,
        primaryContainer: AppColors.primaryYellow,
        onPrimaryContainer: AppColors.goldDark,
        secondary: const Color(0xFF5e5e5e),
        onSecondary: Colors.white,
        secondaryContainer: const Color(0xFFe2e2e2),
        onSecondaryContainer: AppColors.charcoal,
        error: AppColors.error,
        onError: Colors.white,
        surface: AppColors.surface,
        onSurface: AppColors.darkText,
        onSurfaceVariant: AppColors.surfaceVariantText,
        outline: AppColors.outline,
        outlineVariant: AppColors.outlineVariant,
        shadow: Colors.black,
        scrim: Colors.black,
        inverseSurface: AppColors.darkText,
        onInverseSurface: AppColors.bgCream,
        inversePrimary: AppColors.goldDim,
      ),
      scaffoldBackgroundColor: AppColors.bgCream,

      // ── AppBar ────────────────────────────────────────────────────
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.cardBg,
        foregroundColor: AppColors.darkText,
        elevation: 0,
        scrolledUnderElevation: 1,
        shadowColor: const Color(0xFF735C00).withAlpha(20),
        systemOverlayStyle: SystemUiOverlayStyle.dark,
        titleTextStyle: GoogleFonts.plusJakartaSans(
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: AppColors.darkText,
          letterSpacing: -0.3,
        ),
        iconTheme: const IconThemeData(color: AppColors.darkText),
      ),

      // ── Text ─────────────────────────────────────────────────────
      textTheme: GoogleFonts.beVietnamProTextTheme().copyWith(
        displayLarge: GoogleFonts.plusJakartaSans(fontSize: 32, fontWeight: FontWeight.w800, color: AppColors.darkText, letterSpacing: -1.2, height: 1.05),
        displayMedium: GoogleFonts.plusJakartaSans(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.darkText, letterSpacing: -0.7, height: 1.1),
        headlineLarge: GoogleFonts.plusJakartaSans(fontSize: 22, fontWeight: FontWeight.w700, color: AppColors.darkText, letterSpacing: -0.5),
        headlineMedium: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.darkText, letterSpacing: -0.3),
        headlineSmall: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.darkText),
        titleLarge: GoogleFonts.plusJakartaSans(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.darkText),
        titleMedium: GoogleFonts.plusJakartaSans(fontSize: 16, fontWeight: FontWeight.w600, color: AppColors.darkText),
        titleSmall: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.darkText),
        bodyLarge: GoogleFonts.beVietnamPro(fontSize: 15, fontWeight: FontWeight.w500, color: AppColors.surfaceVariantText, height: 1.6),
        bodyMedium: GoogleFonts.beVietnamPro(fontSize: 14, fontWeight: FontWeight.w400, color: AppColors.surfaceVariantText, height: 1.5),
        bodySmall: GoogleFonts.beVietnamPro(fontSize: 12, fontWeight: FontWeight.w400, color: AppColors.textMuted, height: 1.4),
        labelLarge: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.charcoal, letterSpacing: 0.8),
        labelMedium: GoogleFonts.plusJakartaSans(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.charcoal, letterSpacing: 0.6),
        labelSmall: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.textMuted, letterSpacing: 1.2),
      ),

      // ── Cards ─────────────────────────────────────────────────────
      cardTheme: CardThemeData(
        color: AppColors.cardBg,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        shadowColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        margin: EdgeInsets.zero,
      ),

      // ── Elevated Button ───────────────────────────────────────────
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ButtonStyle(
          backgroundColor: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.pressed)) return AppColors.goldHover;
            return AppColors.goldPrimary;
          }),
          foregroundColor: WidgetStateProperty.all(AppColors.charcoal),
          textStyle: WidgetStateProperty.all(
            GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w800, letterSpacing: 1.2),
          ),
          elevation: WidgetStateProperty.all(0),
          shadowColor: WidgetStateProperty.all(Colors.transparent),
          padding: WidgetStateProperty.all(const EdgeInsets.symmetric(horizontal: 24, vertical: 14)),
          shape: WidgetStateProperty.all(RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
        ),
      ),

      // ── Text Button ───────────────────────────────────────────────
      textButtonTheme: TextButtonThemeData(
        style: ButtonStyle(
          foregroundColor: WidgetStateProperty.all(AppColors.goldDark),
          textStyle: WidgetStateProperty.all(
            GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w700),
          ),
        ),
      ),

      // ── Input Decoration ──────────────────────────────────────────
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.cardBg,
        hintStyle: GoogleFonts.beVietnamPro(color: AppColors.grey500, fontSize: 13),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.outlineVariant),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.outlineVariant),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.goldPrimary, width: 2),
        ),
      ),

      // ── Bottom Navigation Bar ─────────────────────────────────────
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.cardBg,
        selectedItemColor: AppColors.goldDark,
        unselectedItemColor: AppColors.grey500,
        selectedLabelStyle: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w700),
        unselectedLabelStyle: GoogleFonts.plusJakartaSans(fontSize: 11, fontWeight: FontWeight.w400),
        showSelectedLabels: true,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
      ),

      // ── Chip ─────────────────────────────────────────────────────
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.surfaceLow,
        selectedColor: AppColors.primaryYellow,
        side: const BorderSide(color: AppColors.outlineVariant),
        labelStyle: GoogleFonts.plusJakartaSans(fontSize: 13, fontWeight: FontWeight.w600),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      ),

      // ── Tab Bar ──────────────────────────────────────────────────
      tabBarTheme: TabBarThemeData(
        labelColor: AppColors.goldDark,
        unselectedLabelColor: AppColors.grey500,
        indicatorColor: AppColors.goldPrimary,
        labelStyle: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w700),
        unselectedLabelStyle: GoogleFonts.plusJakartaSans(fontSize: 14, fontWeight: FontWeight.w500),
        dividerColor: AppColors.outlineVariant,
      ),

      // ── Divider ──────────────────────────────────────────────────
      dividerTheme: const DividerThemeData(
        color: AppColors.outlineVariant,
        thickness: 1,
        space: 1,
      ),
    );
  }
}
