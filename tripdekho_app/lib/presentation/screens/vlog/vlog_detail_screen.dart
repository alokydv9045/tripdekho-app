import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';
import '../../../core/theme/app_colors.dart';
import 'package:go_router/go_router.dart';

class VlogDetailScreen extends StatefulWidget {
  final String vlogId;
  const VlogDetailScreen({super.key, required this.vlogId});

  @override
  State<VlogDetailScreen> createState() => _VlogDetailScreenState();
}

class _VlogDetailScreenState extends State<VlogDetailScreen> {
  late YoutubePlayerController _controller;
  
  @override
  void initState() {
    super.initState();
    // Use a placeholder video ID
    _controller = YoutubePlayerController(
      initialVideoId: 'dQw4w9WgXcQ', 
      flags: const YoutubePlayerFlags(
        autoPlay: true,
        mute: false,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.black,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_rounded, color: Colors.white),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            YoutubePlayer(
              controller: _controller,
              showVideoProgressIndicator: true,
              progressIndicatorColor: AppColors.amber500,
              progressColors: const ProgressBarColors(
                playedColor: AppColors.amber500,
                handleColor: Colors.white,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Wrap(
                    spacing: 8,
                    children: [
                      _buildChip('Kerala'),
                      _buildChip('Nature'),
                      _buildChip('Hidden Gems'),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '5 Hidden Gems in Kerala You Must Visit',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 24, 
                      fontWeight: FontWeight.w900, 
                      color: AppColors.darkText,
                      letterSpacing: -0.5,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '10K views • 2 days ago', 
                        style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontWeight: FontWeight.w700, fontSize: 12)
                      ),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade50,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(color: Colors.grey.shade200),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.thumb_up_alt_rounded, size: 16, color: AppColors.darkText),
                                const SizedBox(width: 8),
                                Text('1.2K', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 12)),
                              ],
                            ),
                          )
                        ],
                      )
                    ],
                  ),
                  const SizedBox(height: 32),
                  const Divider(color: AppColors.outlineVariant),
                  const SizedBox(height: 32),
                  
                  // Creator Info
                  Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.amber500,
                        ),
                        alignment: Alignment.center,
                        child: Text('T', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, color: Colors.white, fontSize: 20)),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('TripDekho Studios', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.darkText, letterSpacing: -0.3)),
                            const SizedBox(height: 2),
                            Text('250K Subscribers', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, fontSize: 12, color: AppColors.textMuted)),
                          ],
                        ),
                      ),
                      ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.darkText,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                        ),
                        child: Text('SUBSCRIBE', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 10, letterSpacing: 1.0)),
                      )
                    ],
                  ),
                  const SizedBox(height: 32),
                  
                  // Description
                  Text('DESCRIPTION', style: GoogleFonts.plusJakartaSans(fontSize: 10, fontWeight: FontWeight.w900, letterSpacing: 1.5, color: AppColors.textMuted)),
                  const SizedBox(height: 12),
                  Text(
                    'Join us as we explore the beautiful backwaters, lush green tea gardens, and hidden waterfalls in Kerala. This trip covers Munnar, Alleppey, and Wayanad...\n\nDon\'t forget to like and subscribe for more amazing travel content around the globe!',
                    style: GoogleFonts.plusJakartaSans(height: 1.6, fontSize: 14, color: AppColors.darkText.withAlpha(200)),
                  ),
                  const SizedBox(height: 48),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.amber500.withAlpha(20),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label.toUpperCase(),
        style: GoogleFonts.plusJakartaSans(fontSize: 9, fontWeight: FontWeight.w900, color: AppColors.amber500, letterSpacing: 1.0),
      ),
    );
  }
}
