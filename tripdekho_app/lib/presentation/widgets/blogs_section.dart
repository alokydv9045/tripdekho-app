import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:intl/intl.dart';
import '../../core/theme/app_colors.dart';
import '../providers/blog_provider.dart';

class BlogsSection extends ConsumerWidget {
  const BlogsSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final blogsAsync = ref.watch(fetchBlogsProvider(limit: 6));

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
                  text: 'Travel ',
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 26,
                    fontWeight: FontWeight.w800,
                    color: AppColors.darkText,
                    letterSpacing: -0.5,
                  ),
                  children: [
                    TextSpan(
                      text: 'Stories',
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
                'Tips, guides, and stories to inspire your next trip',
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
        
        blogsAsync.when(
          data: (blogs) {
            if (blogs.isEmpty) {
              return const SizedBox.shrink();
            }
            return SizedBox(
              height: 320,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: blogs.length,
                itemBuilder: (context, index) {
                  final blog = blogs[index];
                  return Padding(
                    padding: const EdgeInsets.only(right: 16),
                    child: _BlogCard(
                      title: blog.title,
                      coverImage: blog.coverImage ?? 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
                      excerpt: blog.excerpt ?? '',
                      author: blog.authorName ?? 'TripDekho Team',
                      authorAvatar: blog.authorAvatar,
                      date: blog.publishedAt != null ? DateFormat('MMM d, yyyy').format(blog.publishedAt!) : 'Recent',
                      readTime: blog.readTimeMinutes ?? 5,
                    ),
                  );
                },
              ),
            );
          },
          loading: () => const SizedBox(
            height: 320,
            child: Center(child: CircularProgressIndicator(color: AppColors.goldPrimary)),
          ),
          error: (err, stack) => const SizedBox.shrink(),
        ),
      ],
    );
  }
}

class _BlogCard extends StatelessWidget {
  final String title;
  final String coverImage;
  final String excerpt;
  final String author;
  final String? authorAvatar;
  final String date;
  final int readTime;

  const _BlogCard({
    required this.title,
    required this.coverImage,
    required this.excerpt,
    required this.author,
    this.authorAvatar,
    required this.date,
    required this.readTime,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 280,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(10),
            blurRadius: 15,
            offset: const Offset(0, 5),
          )
        ],
      ),
      clipBehavior: Clip.hardEdge,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Cover Image
          SizedBox(
            height: 140,
            child: CachedNetworkImage(
              imageUrl: coverImage,
              fit: BoxFit.cover,
              placeholder: (context, url) => Container(color: AppColors.surfaceLow),
              errorWidget: (context, url, error) => Container(
                color: AppColors.surfaceLow,
                child: const Icon(Icons.image_outlined, color: AppColors.grey400, size: 36),
              ),
            ),
          ),
          
          // Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.plusJakartaSans(
                    fontWeight: FontWeight.w800,
                    fontSize: 16,
                    color: AppColors.darkText,
                    height: 1.3,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Text(
                  excerpt,
                  style: GoogleFonts.plusJakartaSans(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: AppColors.surfaceVariantText,
                    height: 1.5,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 16),
                
                // Footer
                Row(
                  children: [
                    Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.surfaceLow,
                        image: authorAvatar != null && authorAvatar!.startsWith('http')
                            ? DecorationImage(image: CachedNetworkImageProvider(authorAvatar!), fit: BoxFit.cover)
                            : const DecorationImage(image: AssetImage('assets/images/sm-logo.png'), fit: BoxFit.cover),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            author,
                            style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w700, fontSize: 12, color: AppColors.darkText),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            '$date • $readTime min read',
                            style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, fontSize: 10, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
