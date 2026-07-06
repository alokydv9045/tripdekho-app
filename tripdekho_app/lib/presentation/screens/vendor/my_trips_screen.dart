import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_colors.dart';

class MyTripsScreen extends StatelessWidget {
  const MyTripsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        backgroundColor: const Color(0xFFF4F5F7),
        appBar: AppBar(
          title: Text('My Trips', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, color: AppColors.darkText, letterSpacing: -0.5)),
          backgroundColor: Colors.white,
          elevation: 0,
          scrolledUnderElevation: 0,
          iconTheme: const IconThemeData(color: AppColors.darkText),
          bottom: TabBar(
            labelColor: AppColors.amber500,
            unselectedLabelColor: AppColors.grey500,
            indicatorColor: AppColors.amber500,
            indicatorWeight: 3,
            labelStyle: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w800, fontSize: 14),
            unselectedLabelStyle: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w600, fontSize: 14),
            tabs: const [
              Tab(text: 'Published'),
              Tab(text: 'Pending'),
              Tab(text: 'Drafts'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildTripsList('published'),
            _buildTripsList('pending'),
            _buildTripsList('draft'),
          ],
        ),
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () => context.push('/vendor/trips/create'),
          backgroundColor: AppColors.darkText,
          elevation: 10,
          
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          icon: const Icon(Icons.add_rounded, color: AppColors.amber500),
          label: Text('CREATE TRIP', style: GoogleFonts.plusJakartaSans(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 12, letterSpacing: 1.0)),
        ),
      ),
    );
  }

  Widget _buildTripsList(String status) {
    return ListView.separated(
      padding: const EdgeInsets.all(24),
      itemCount: status == 'draft' ? 1 : 2,
      separatorBuilder: (_, __) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        return Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.grey.shade100),
            boxShadow: [BoxShadow(color: Colors.grey.shade200, blurRadius: 20, offset: const Offset(0, 10))],
          ),
          padding: const EdgeInsets.all(20),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.asset(
                  'assets/images/destinations/kashmir.png',
                  width: 90,
                  height: 90,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    width: 90, height: 90, color: Colors.grey.shade100,
                    child: const Icon(Icons.image_not_supported_rounded, color: Colors.grey),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            'Himalayan Adventure $index',
                            style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.darkText, letterSpacing: -0.5),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        _buildStatusBadge(status),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text('Manali, HP', style: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 12, fontWeight: FontWeight.w600)),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('₹15,000', style: GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w900, fontSize: 18, color: Colors.green.shade700)),
                        Row(
                          children: [
                            Container(
                              decoration: BoxDecoration(
                                color: Colors.grey.shade50,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: IconButton(
                                icon: const Icon(Icons.edit_outlined, size: 18, color: AppColors.darkText),
                                onPressed: () {},
                                constraints: const BoxConstraints(),
                                padding: const EdgeInsets.all(8),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Container(
                              decoration: BoxDecoration(
                                color: Colors.red.shade50,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: IconButton(
                                icon: Icon(Icons.delete_outline, size: 18, color: Colors.red.shade700),
                                onPressed: () {},
                                constraints: const BoxConstraints(),
                                padding: const EdgeInsets.all(8),
                              ),
                            ),
                          ],
                        )
                      ],
                    )
                  ],
                ),
              )
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatusBadge(String status) {
    Color bgColor;
    Color textColor;
    String label;

    switch (status) {
      case 'published':
        bgColor = Colors.green.shade50;
        textColor = Colors.green.shade700;
        label = 'PUBLISHED';
        break;
      case 'pending':
        bgColor = AppColors.amber500.withAlpha(30);
        textColor = AppColors.amber500;
        label = 'PENDING';
        break;
      default:
        bgColor = Colors.grey.shade100;
        textColor = AppColors.textMuted;
        label = 'DRAFT';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        label,
        style: GoogleFonts.plusJakartaSans(fontSize: 9, fontWeight: FontWeight.w900, color: textColor, letterSpacing: 1.0),
      ),
    );
  }
}
