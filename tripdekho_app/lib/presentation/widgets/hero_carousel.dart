import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_colors.dart';
import 'package:go_router/go_router.dart';

/// HeroCarousel — mirrors web's HeroSection: yellow card + search + stats.
class HeroCarousel extends StatefulWidget {
  const HeroCarousel({super.key});

  @override
  State<HeroCarousel> createState() => _HeroCarouselState();
}

class _HeroCarouselState extends State<HeroCarousel> with TickerProviderStateMixin {
  late AnimationController _floatController;
  late AnimationController _fadeController;
  late Animation<double> _floatAnimation;
  late Animation<double> _fadeAnimation;

  final TextEditingController _destinationCtrl = TextEditingController();
  final TextEditingController _pickupCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _floatController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 7),
    )..repeat(reverse: true);
    _floatAnimation = Tween<double>(begin: 0, end: -12).animate(
      CurvedAnimation(parent: _floatController, curve: Curves.easeInOut),
    );

    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    )..forward();
    _fadeAnimation = CurvedAnimation(parent: _fadeController, curve: Curves.easeOut);
  }

  @override
  void dispose() {
    _floatController.dispose();
    _fadeController.dispose();
    _destinationCtrl.dispose();
    _pickupCtrl.dispose();
    super.dispose();
  }

  void _handleSearch() {
    final dest = _destinationCtrl.text.trim();
    final pickup = _pickupCtrl.text.trim();
    final params = <String, String>{};
    if (dest.isNotEmpty) params['q'] = dest;
    if (pickup.isNotEmpty) params['pickup'] = pickup;
    final query = params.entries.map((e) => '${e.key}=${Uri.encodeComponent(e.value)}').join('&');
    context.push('/search${query.isNotEmpty ? '?$query' : ''}');
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fadeAnimation,
      child: Container(
        color: AppColors.bgCream,
        child: Stack(
          children: [
            // Floating travel icons (decorative)
            ..._buildFloatingIcons(),

            Padding(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // ── Yellow Hero Card ───────────────────────────────
                  _buildHeroCard(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Yellow gradient card matching web exactly ────────────────────
  Widget _buildHeroCard() {
    return AnimatedBuilder(
      animation: _floatAnimation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _floatAnimation.value * 0.3),
          child: child,
        );
      },
      child: Container(
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFFFD133),  // web: #FFD133 0%
              Color(0xFFF5C623),  // web: #F5C623 50%
              Color(0xFFEEC221),  // web: #EEC221 100%
            ],
            stops: [0.0, 0.5, 1.0],
          ),
          borderRadius: BorderRadius.circular(24),
          boxShadow: AppColors.heroCardShadow,
        ),
        child: Stack(
          children: [
            // Subtle texture overlay (matches web's radial-gradient texture)
            Positioned.fill(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: CustomPaint(painter: _CardTexturePainter()),
              ),
            ),

            Padding(
              padding: const EdgeInsets.fromLTRB(28, 28, 28, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // ── Heading ──────────────────────────────────────
                  Text(
                    'Find Your',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 36,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -1.4,
                      height: 1.05,
                      color: AppColors.darkText,
                    ),
                  ),
                  Text(
                    'Dream Trip',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 36,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -1.4,
                      height: 1.05,
                      color: AppColors.darkText,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // ── Subheading ────────────────────────────────────
                  Text(
                    'Get instant suggestions for your next adventure',
                    style: GoogleFonts.beVietnamPro(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: AppColors.textOnYellow,
                      height: 1.6,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // ── Glassmorphism Search Box ───────────────────────
                  _buildSearchBox(),
                  const SizedBox(height: 20),

                  // ── Stats Row ─────────────────────────────────────
                  _buildStatsRow(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Search box — glassmorphism white panel (matches web's HeroSearchBox) ──
  Widget _buildSearchBox() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(178),  // white/70
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withAlpha(102), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(25),
            blurRadius: 30,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Destination field
          _buildSearchField(
            controller: _destinationCtrl,
            hint: 'DESTINATION',
            icon: Icons.location_on_outlined,
          ),
          const SizedBox(height: 10),

          // Pickup field
          _buildSearchField(
            controller: _pickupCtrl,
            hint: 'PICKUP',
            icon: Icons.my_location_outlined,
          ),
          const SizedBox(height: 12),

          // SEARCH button — gold with warm shadow
          GestureDetector(
            onTap: _handleSearch,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 14),
              decoration: BoxDecoration(
                color: AppColors.goldPrimary,
                borderRadius: BorderRadius.circular(12),
                boxShadow: AppColors.buttonShadow,
              ),
              child: Text(
                'SEARCH',
                textAlign: TextAlign.center,
                style: GoogleFonts.plusJakartaSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 2.0,
                  color: AppColors.charcoal,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(204),  // white/80
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(15),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: TextField(
        controller: controller,
        readOnly: true,
        onTap: () => context.push('/search'),
        style: GoogleFonts.plusJakartaSans(
          fontSize: 13,
          fontWeight: FontWeight.w700,
          color: AppColors.darkText,
          letterSpacing: 0.8,
        ),
        decoration: InputDecoration(
          hintText: hint,
          hintStyle: GoogleFonts.plusJakartaSans(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            color: AppColors.darkText.withAlpha(178),
            letterSpacing: 0.8,
          ),
          prefixIcon: Icon(icon, size: 18, color: AppColors.darkText.withAlpha(178)),
          suffixIcon: Icon(Icons.keyboard_arrow_down_rounded, size: 18, color: AppColors.darkText.withAlpha(178)),
          border: InputBorder.none,
          enabledBorder: InputBorder.none,
          focusedBorder: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(vertical: 14),
          filled: false,
        ),
      ),
    );
  }

  // ── Stats row: Rating + Happy Customers (mirrors web) ────────────
  Widget _buildStatsRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Rating
        Column(
          children: [
            Row(
              children: [
                Icon(Icons.star_rounded, color: AppColors.greenStar, size: 20),
                const SizedBox(width: 4),
                Text(
                  '4.0/5',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 17,
                    fontWeight: FontWeight.w700,
                    color: AppColors.darkText,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 2),
            Text(
              'Based on\nReviews',
              textAlign: TextAlign.center,
              style: GoogleFonts.beVietnamPro(
                fontSize: 10,
                fontWeight: FontWeight.w500,
                color: AppColors.surfaceVariantText,
                height: 1.35,
              ),
            ),
          ],
        ),

        // Divider
        Container(
          height: 40,
          width: 1,
          margin: const EdgeInsets.symmetric(horizontal: 20),
          color: AppColors.darkText.withAlpha(30),
        ),

        // Happy Customers
        Column(
          children: [
            Icon(Icons.favorite_rounded, color: AppColors.heartRed, size: 20),
            const SizedBox(height: 4),
            Text(
              'Happy\nCustomers',
              textAlign: TextAlign.center,
              style: GoogleFonts.beVietnamPro(
                fontSize: 10,
                fontWeight: FontWeight.w500,
                color: AppColors.surfaceVariantText,
                height: 1.35,
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ── Subtle floating travel icons (muted, decorative) ─────────────
  List<Widget> _buildFloatingIcons() {
    return [
      _FloatingIcon(icon: Icons.flight_takeoff_rounded, top: 12, left: 24, size: 22, delay: 0),
      _FloatingIcon(icon: Icons.explore_outlined, top: 80, right: 20, size: 28, delay: 1200),
      _FloatingIcon(icon: Icons.camera_alt_outlined, bottom: 60, left: 16, size: 18, delay: 600),
      _FloatingIcon(icon: Icons.map_outlined, bottom: 30, right: 32, size: 20, delay: 900),
    ];
  }
}

/// Subtle card texture painter (matches web's radial gradient overlay)
class _CardTexturePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..shader = RadialGradient(
      center: const Alignment(-0.6, 0.6),
      radius: 0.8,
      colors: [Colors.white.withAlpha(15), Colors.transparent],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Animated floating icon widget
class _FloatingIcon extends StatefulWidget {
  final IconData icon;
  final double? top, bottom, left, right;
  final double size;
  final int delay;

  const _FloatingIcon({
    required this.icon,
    this.top,
    this.bottom,
    this.left,
    this.right,
    required this.size,
    required this.delay,
  });

  @override
  State<_FloatingIcon> createState() => _FloatingIconState();
}

class _FloatingIconState extends State<_FloatingIcon> with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _anim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 6000 + widget.delay),
    )..repeat(reverse: true);
    _anim = Tween<double>(begin: 0, end: -16).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Positioned(
      top: widget.top,
      bottom: widget.bottom,
      left: widget.left,
      right: widget.right,
      child: AnimatedBuilder(
        animation: _anim,
        builder: (context, child) => Transform.translate(
          offset: Offset(0, _anim.value),
          child: child,
        ),
        child: Opacity(
          opacity: 0.20,
          child: Icon(widget.icon, size: widget.size, color: const Color(0xFFd97706)),
        ),
      ),
    );
  }
}

