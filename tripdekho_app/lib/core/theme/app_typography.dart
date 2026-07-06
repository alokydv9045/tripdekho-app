import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// TripDekho Typography — mirrors web's Plus Jakarta Sans + Be Vietnam Pro.
class AppTypography {
  // ── Font Families ─────────────────────────────────────────────────
  /// Plus Jakarta Sans — used for headings, buttons, labels (web's --font-jakarta)
  static TextStyle get primaryFont => GoogleFonts.plusJakartaSans();

  /// Be Vietnam Pro — used for body text, subtitles, descriptions (web's --font-vietnam)
  static TextStyle get bodyFont => GoogleFonts.beVietnamPro();

  /// Lora — serif accent (web's --font-lora)
  static TextStyle get serifFont => GoogleFonts.lora();

  // ── Display / Hero Text ───────────────────────────────────────────
  /// Large hero heading like "Find Your / Dream Trip" — 32px extrabold, Jakarta
  static TextStyle get displayLarge => GoogleFonts.plusJakartaSans(
    fontSize: 32,
    fontWeight: FontWeight.w800,
    letterSpacing: -0.04 * 32,
    height: 1.05,
    color: AppColors.darkText,
  );

  /// Section display heading (h2 equivalent) — 24px bold, Jakarta
  static TextStyle get displayMedium => GoogleFonts.plusJakartaSans(
    fontSize: 24,
    fontWeight: FontWeight.w800,
    letterSpacing: -0.03 * 24,
    height: 1.1,
    color: AppColors.darkText,
  );

  // ── Headings ──────────────────────────────────────────────────────
  /// Card / section title — 20px bold
  static TextStyle get heading1 => GoogleFonts.plusJakartaSans(
    fontSize: 20,
    fontWeight: FontWeight.w700,
    color: AppColors.darkText,
    letterSpacing: -0.3,
  );

  /// Sub-heading — 16px semibold
  static TextStyle get heading2 => GoogleFonts.plusJakartaSans(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: AppColors.darkText,
  );

  // ── Body Text ─────────────────────────────────────────────────────
  /// Body large — 15px medium, Be Vietnam Pro
  static TextStyle get bodyLarge => GoogleFonts.beVietnamPro(
    fontSize: 15,
    fontWeight: FontWeight.w500,
    color: AppColors.surfaceVariantText,
    height: 1.6,
  );

  /// Body regular — 13px regular, Be Vietnam Pro
  static TextStyle get bodyRegular => GoogleFonts.beVietnamPro(
    fontSize: 13,
    fontWeight: FontWeight.w400,
    color: AppColors.surfaceVariantText,
    height: 1.5,
  );

  /// Body on yellow card — 15px medium, textOnYellow
  static TextStyle get bodyOnYellow => GoogleFonts.beVietnamPro(
    fontSize: 15,
    fontWeight: FontWeight.w500,
    color: AppColors.textOnYellow,
    height: 1.6,
  );

  // ── Captions & Labels ─────────────────────────────────────────────
  /// Muted caption — 11px, Be Vietnam Pro
  static TextStyle get caption => GoogleFonts.beVietnamPro(
    fontSize: 11,
    fontWeight: FontWeight.w500,
    color: AppColors.textMuted,
    height: 1.35,
  );

  /// Label caps — 11px uppercase bold, Jakarta (web's .label-caps)
  static TextStyle get labelCaps => GoogleFonts.plusJakartaSans(
    fontSize: 11,
    fontWeight: FontWeight.w700,
    letterSpacing: 0.12 * 11,
    color: AppColors.textMuted,
  );

  // ── Buttons ───────────────────────────────────────────────────────
  /// Button label — 14px extrabold, wide tracking, Jakarta
  static TextStyle get buttonLabel => GoogleFonts.plusJakartaSans(
    fontSize: 14,
    fontWeight: FontWeight.w800,
    letterSpacing: 1.5,
    color: AppColors.charcoal,
  );

  /// Small button label — 12px bold, wide tracking
  static TextStyle get buttonLabelSmall => GoogleFonts.plusJakartaSans(
    fontSize: 12,
    fontWeight: FontWeight.w700,
    letterSpacing: 1.2,
    color: AppColors.charcoal,
  );

  // ── Price / Stats ─────────────────────────────────────────────────
  /// Large price number — 20px bold Jakarta
  static TextStyle get priceText => GoogleFonts.plusJakartaSans(
    fontSize: 20,
    fontWeight: FontWeight.w700,
    color: AppColors.darkText,
  );

  /// Small stat number on hero
  static TextStyle get statNumber => GoogleFonts.plusJakartaSans(
    fontSize: 18,
    fontWeight: FontWeight.w700,
    color: AppColors.darkText,
  );
}

