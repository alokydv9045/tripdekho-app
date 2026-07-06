import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_colors.dart';

class MainLayout extends StatelessWidget {
  final Widget child;

  const MainLayout({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    // Determine the current index based on the route
    final String location = GoRouterState.of(context).uri.path;
    int currentIndex = 0;
    
    if (location.startsWith('/trips')) {
      currentIndex = 1;
    } else if (location.startsWith('/bookings')) {
      currentIndex = 2;
    } else if (location.startsWith('/profile') || location.startsWith('/wishlist') || location.startsWith('/settings')) {
      currentIndex = 3;
    } else if (location.startsWith('/vendor')) {
      // Hide bottom nav for vendor portal if needed, or handle separately
      currentIndex = 4; // Not showing in standard nav
    }

    // Hide Bottom Nav completely on vendor screens or detail screens if desired.
    // For now, we will show it on the top-level routes.
    final bool hideBottomNav = location.startsWith('/vendor') || 
                               location == '/search' ||
                               (location.startsWith('/trips/') && location != '/trips') ||
                               (location.startsWith('/bookings/') && location != '/bookings') ||
                               location.startsWith('/messages') ||
                               location.startsWith('/ai-planner') ||
                               location.startsWith('/vlog') ||
                               location == '/notifications';

    return Scaffold(
      body: child,
      bottomNavigationBar: hideBottomNav ? null : Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, -5))
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: currentIndex > 3 ? 0 : currentIndex,
          onTap: (index) {
            switch (index) {
              case 0:
                context.go('/');
                break;
              case 1:
                context.go('/trips');
                break;
              case 2:
                context.go('/bookings');
                break;
              case 3:
                context.go('/profile');
                break;
            }
          },
          type: BottomNavigationBarType.fixed,
          backgroundColor: Colors.white,
          selectedItemColor: AppColors.primaryYellow,
          unselectedItemColor: AppColors.grey500,
          showSelectedLabels: true,
          showUnselectedLabels: true,
          selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
          unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.normal, fontSize: 12),
          items: const [
            BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
            BottomNavigationBarItem(icon: Icon(Icons.explore_outlined), activeIcon: Icon(Icons.explore), label: 'Trips'),
            BottomNavigationBarItem(icon: Icon(Icons.book_online_outlined), activeIcon: Icon(Icons.book_online), label: 'Bookings'),
            BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
          ],
        ),
      ),
    );
  }
}
