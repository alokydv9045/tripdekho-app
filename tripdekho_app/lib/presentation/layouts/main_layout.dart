import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';
import '../providers/connectivity_provider.dart';

class MainLayout extends ConsumerWidget {
  final Widget child;

  const MainLayout({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final authState = ref.watch(authNotifierProvider);
    final isVendor = authState.user?.role == 'vendor';
    final isConnected = ref.watch(connectivityProvider);
    
    int currentIndex = _calculateSelectedIndex(context, isVendor);

    return Scaffold(
      body: Column(
        children: [
          if (!isConnected)
            Container(
              width: double.infinity,
              color: Colors.redAccent,
              padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top + 8, bottom: 8),
              child: const Text(
                'No Internet Connection',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
              ),
            ),
          Expanded(child: child),
        ],
      ),
      extendBody: true,
      bottomNavigationBar: Container(
        margin: const EdgeInsets.only(left: 24, right: 24, bottom: 24),
        decoration: BoxDecoration(
          color: theme.colorScheme.surface.withOpacity(0.9),
          borderRadius: BorderRadius.circular(32),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 20,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(32),
          child: NavigationBar(
            height: 65,
            elevation: 0,
            backgroundColor: Colors.transparent,
            indicatorColor: theme.colorScheme.primary.withOpacity(0.2),
            selectedIndex: currentIndex,
            onDestinationSelected: (int index) => _onItemTapped(index, context, isVendor),
            labelBehavior: NavigationDestinationLabelBehavior.alwaysHide,
            destinations: isVendor 
              ? const <NavigationDestination>[
                  NavigationDestination(
                    icon: Icon(Icons.dashboard_outlined),
                    selectedIcon: Icon(Icons.dashboard),
                    label: 'Dashboard',
                  ),
                  NavigationDestination(
                    icon: Icon(Icons.list_alt_outlined),
                    selectedIcon: Icon(Icons.list_alt),
                    label: 'My Listings',
                  ),
                  NavigationDestination(
                    icon: Icon(Icons.person_outline),
                    selectedIcon: Icon(Icons.person),
                    label: 'Profile',
                  ),
                ]
              : const <NavigationDestination>[
                  NavigationDestination(
                    icon: Icon(Icons.home_outlined),
                    selectedIcon: Icon(Icons.home),
                    label: 'Home',
                  ),
                  NavigationDestination(
                    icon: Icon(Icons.favorite_border),
                    selectedIcon: Icon(Icons.favorite),
                    label: 'Saved',
                  ),
                  NavigationDestination(
                    icon: Icon(Icons.person_outline),
                    selectedIcon: Icon(Icons.person),
                    label: 'Profile',
                  ),
                ],
          ),
        ),
      ),
    );
  }

  static int _calculateSelectedIndex(BuildContext context, bool isVendor) {
    final String location = GoRouterState.of(context).matchedLocation;
    if (location.startsWith('/profile')) {
      return 2;
    }
    if (isVendor) {
      if (location.startsWith('/vendor/trips')) return 1;
    } else {
      if (location.startsWith('/saved')) return 1;
    }
    return 0; // Default to Home/Dashboard
  }

  void _onItemTapped(int index, BuildContext context, bool isVendor) {
    switch (index) {
      case 0:
        context.go('/');
        break;
      case 1:
        if (isVendor) {
          context.go('/vendor/trips');
        } else {
          context.go('/saved');
        }
        break;
      case 2:
        context.go('/profile');
        break;
    }
  }
}
