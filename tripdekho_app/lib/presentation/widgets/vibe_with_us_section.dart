import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/theme/app_colors.dart';
import '../providers/vlog_provider.dart';

class VibeWithUsSection extends ConsumerWidget {
  const VibeWithUsSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final vlogsAsync = ref.watch(fetchVlogsProvider(limit: 6));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  RichText(
                    text: TextSpan(
                      text: 'Vibe With ',
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
                    'Watch our travel diaries and experiences',
                    style: GoogleFonts.plusJakartaSans(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.surfaceVariantText,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        
        vlogsAsync.when(
          data: (vlogs) {
            if (vlogs.isEmpty) {
              return const SizedBox.shrink();
            }
            return SizedBox(
              height: 280,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: vlogs.length,
                itemBuilder: (context, index) {
                  final vlog = vlogs[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 16),
                    child: _VlogCard(
                      title: vlog.title,
                      thumbnailUrl: vlog.thumbnailUrl ?? 'https://img.youtube.com/vi/${_extractYoutubeId(vlog.videoUrl) ?? ''}/maxresdefault.jpg',
                      videoUrl: vlog.videoUrl,
                    ),
                  );
                },
              ),
            );
          },
          loading: () => const SizedBox(
            height: 280,
            child: Center(child: CircularProgressIndicator(color: AppColors.goldPrimary)),
          ),
          error: (err, stack) => const SizedBox.shrink(),
        ),
      ],
    );
  }

  String? _extractYoutubeId(String url) {
    if (url.contains('youtu.be/')) {
      return url.split('youtu.be/').last.split('?').first;
    } else if (url.contains('v=')) {
      return url.split('v=').last.split('&').first;
    }
    return null;
  }
}

class _VlogCard extends StatelessWidget {
  final String title;
  final String thumbnailUrl;
  final String videoUrl;

  const _VlogCard({
    required this.title,
    required this.thumbnailUrl,
    required this.videoUrl,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        final uri = Uri.parse(videoUrl);
        if (await canLaunchUrl(uri)) {
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        }
      },
      child: Container(
        width: 220,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withAlpha(15),
              blurRadius: 10,
              offset: const Offset(0, 4),
            )
          ]
        ),
        clipBehavior: Clip.hardEdge,
        child: Stack(
          fit: StackFit.expand,
          children: [
            CachedNetworkImage(
              imageUrl: thumbnailUrl,
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(color: AppColors.surfaceLow),
              errorWidget: (context, url, error) => Container(
                color: AppColors.surfaceLow,
                child: const Icon(Icons.video_library_outlined, color: AppColors.grey400, size: 36),
              ),
            ),
            
            // Gradient Overlay
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withAlpha(180),
                  ],
                  stops: const [0.4, 1.0],
                ),
              ),
            ),

            // Play Button
            Center(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withAlpha(200),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.play_arrow_rounded, color: AppColors.darkText, size: 28),
              ),
            ),

            // Title
            Positioned(
              left: 16,
              right: 16,
              bottom: 16,
              child: Text(
                title,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.plusJakartaSans(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  height: 1.3,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
