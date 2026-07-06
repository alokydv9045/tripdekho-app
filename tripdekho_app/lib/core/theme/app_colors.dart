import 'package:flutter/material.dart';

/// TripDekho Color System — mirrors the web frontend's CSS design tokens exactly.
class AppColors {
  // ── Primary Gold ──────────────────────────────────────────────────
  /// #FFD133 — primary-container (yellow card bg, CTAs)
  static const Color primaryYellow = Color(0xFFFFD133);
  /// #F5C400 — gold-primary (web's --gold-primary)
  static const Color goldPrimary = Color(0xFFF5C400);
  /// #E0B000 — gold-hover
  static const Color goldHover = Color(0xFFE0B000);
  /// #EEC221 — primary-fixed-dim (gradient end)
  static const Color goldDim = Color(0xFFEEC221);
  /// #735c00 — on-primary-container (dark gold for text on yellow)
  static const Color onPrimaryContainer = Color(0xFF735C00);
  /// #715a00 — gold dark text
  static const Color goldDark = Color(0xFF715A00);

  // ── Backgrounds ──────────────────────────────────────────────────
  /// #FFFBF0 — bg-cream / --background (page background)
  static const Color bgCream = Color(0xFFFFFBF0);
  /// #FFFEF7 — --surface (card surfaces)
  static const Color surface = Color(0xFFFFFEF7);
  /// #FFFFFF — --surface-container-lowest
  static const Color cardBg = Color(0xFFFFFFFF);
  /// #f3f4f5 — --surface-container-low
  static const Color surfaceLow = Color(0xFFF3F4F5);
  /// #edeeef — --surface-container
  static const Color surfaceContainer = Color(0xFFEDEEEF);

  // ── Text Colors ───────────────────────────────────────────────────
  /// #191c1d — --on-surface / primary text
  static const Color darkText = Color(0xFF191C1D);
  /// #1A1A1A — --charcoal (headings)
  static const Color charcoal = Color(0xFF1A1A1A);
  /// #4d4633 — --on-surface-variant (secondary text)
  static const Color surfaceVariantText = Color(0xFF4D4633);
  /// #6B5E3A — --text-muted (muted / caption text)
  static const Color textMuted = Color(0xFF6B5E3A);
  /// #3a3520 — body text on yellow cards
  static const Color textOnYellow = Color(0xFF3A3520);

  // ── Outlines & Borders ────────────────────────────────────────────
  static const Color borderWarm = Color(0x2EF5C400);
  static const Color outline = Color(0xFF7F7661);
  static const Color outlineVariant = Color(0xFFD1C5AC);

  // ── Grey Scale ────────────────────────────────────────────────────
  static const Color grey50  = Color(0xFFF9FAFB);
  static const Color grey100 = Color(0xFFF3F4F6);
  static const Color grey200 = Color(0xFFE5E7EB);
  static const Color grey400 = Color(0xFF9CA3AF);
  static const Color grey500 = Color(0xFF6B7280);
  static const Color grey700 = Color(0xFF374151);

  // ── Semantic ──────────────────────────────────────────────────────
  static const Color error = Color(0xFFBA1A1A);
  static const Color redBadge = Color(0xFFEF4444);
  static const Color amber500 = Color(0xFFF59E0B);
  static const Color greenStar = Color(0xFF2E7D32);
  static const Color heartRed = Color(0xFFE11D48);

  // ── Shadows (warm gold-tinted, matching web) ──────────────────────
  static List<BoxShadow> get cardShadow => [
    BoxShadow(
      color: const Color(0xFF735C00).withAlpha(20),
      blurRadius: 24,
      offset: const Offset(0, 4),
      spreadRadius: -4,
    ),
    BoxShadow(
      color: Colors.black.withAlpha(10),
      blurRadius: 4,
      offset: const Offset(0, 1),
    ),
  ];

  static List<BoxShadow> get buttonShadow => [
    BoxShadow(
      color: const Color(0xFFF5C400).withAlpha(89),
      blurRadius: 24,
      offset: const Offset(0, 8),
      spreadRadius: -4,
    ),
  ];

  static List<BoxShadow> get heroCardShadow => [
    BoxShadow(
      color: const Color(0xFF735C00).withAlpha(51),
      blurRadius: 60,
      offset: const Offset(0, 20),
      spreadRadius: -12,
    ),
    BoxShadow(
      color: const Color(0xFFFFD133).withAlpha(64),
      blurRadius: 24,
      offset: const Offset(0, 8),
      spreadRadius: -8,
    ),
  ];
}

