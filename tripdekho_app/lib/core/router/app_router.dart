import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import '../../presentation/layouts/main_layout.dart';
import '../../presentation/screens/home_screen.dart';
import '../../presentation/screens/trips/trips_screen.dart';
import '../../presentation/screens/trips/trip_detail_screen.dart';
import '../../presentation/screens/trips/search_screen.dart';
import '../../presentation/screens/bookings/my_bookings_screen.dart';
import '../../presentation/screens/bookings/booking_detail_screen.dart';
import '../../presentation/screens/profile/profile_screen.dart';
import '../../presentation/screens/profile/wishlist_screen.dart';
import '../../presentation/screens/profile/settings_screen.dart';
import '../../presentation/screens/chat/messages_screen.dart';
import '../../presentation/screens/chat/chat_detail_screen.dart';
import '../../presentation/screens/notifications/notifications_screen.dart';
import '../../presentation/screens/ai_planner/ai_planner_screen.dart';
import '../../presentation/screens/vlog/vlog_list_screen.dart';
import '../../presentation/screens/vlog/vlog_detail_screen.dart';
import '../../presentation/screens/public/static_page_screen.dart';
import '../../presentation/screens/public/contact_screen.dart';
import '../../presentation/screens/public/faq_screen.dart';
import '../../presentation/screens/vendor/vendor_dashboard_screen.dart';
import '../../presentation/screens/vendor/my_trips_screen.dart';
import '../../presentation/screens/vendor/create_trip_screen.dart';
import '../../presentation/screens/vendor/vendor_bookings_screen.dart';
import '../../presentation/screens/vendor/vendor_onboarding_screen.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

class AppRouter {
  static final GoRouter router = GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    routes: [
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) => MainLayout(child: child),
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) => const HomeScreen(),
          ),
          GoRoute(
            path: '/trips',
            builder: (context, state) => const TripsScreen(),
          ),
          GoRoute(
            path: '/bookings',
            builder: (context, state) => const MyBookingsScreen(),
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
          GoRoute(
            path: '/wishlist',
            builder: (context, state) => const WishlistScreen(),
          ),
          GoRoute(
            path: '/settings',
            builder: (context, state) => const SettingsScreen(),
          ),
          GoRoute(
            path: '/search',
            builder: (context, state) => const SearchScreen(),
          ),
          GoRoute(
            path: '/messages',
            builder: (context, state) => const MessagesScreen(),
          ),
          GoRoute(
            path: '/notifications',
            builder: (context, state) => const NotificationsScreen(),
          ),
          GoRoute(
            path: '/ai-planner',
            builder: (context, state) => const AiPlannerScreen(),
          ),
          GoRoute(
            path: '/vlog',
            builder: (context, state) => const VlogListScreen(),
          ),
          GoRoute(
            path: '/about',
            builder: (context, state) => const StaticPageScreen(title: 'About Us'),
          ),
          GoRoute(
            path: '/contact',
            builder: (context, state) => const ContactScreen(),
          ),
          GoRoute(
            path: '/faq',
            builder: (context, state) => const FaqScreen(),
          ),
          GoRoute(
            path: '/terms',
            builder: (context, state) => const StaticPageScreen(title: 'Terms & Conditions'),
          ),
          GoRoute(
            path: '/privacy',
            builder: (context, state) => const StaticPageScreen(title: 'Privacy Policy'),
          ),
        ],
      ),
      // Detail routes and nested flows that might not need the shell or want a full screen
      GoRoute(
        path: '/trips/:slug',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final slug = state.pathParameters['slug']!;
          return TripDetailScreen(slug: slug);
        },
      ),
      GoRoute(
        path: '/bookings/:id',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return BookingDetailScreen(bookingId: id);
        },
      ),
      GoRoute(
        path: '/messages/:id',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return ChatDetailScreen(chatId: id);
        },
      ),
      GoRoute(
        path: '/vlog/:id',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return VlogDetailScreen(vlogId: id);
        },
      ),
      // Vendor Portal Routes
      GoRoute(
        path: '/vendor/onboarding',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const VendorOnboardingScreen(),
      ),
      GoRoute(
        path: '/vendor/dashboard',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const VendorDashboardScreen(),
      ),
      GoRoute(
        path: '/vendor/trips',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const MyTripsScreen(),
      ),
      GoRoute(
        path: '/vendor/trips/create',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const CreateTripScreen(),
      ),
      GoRoute(
        path: '/vendor/bookings',
        parentNavigatorKey: _rootNavigatorKey,
        builder: (context, state) => const VendorBookingsScreen(),
      ),
    ],
  );
}
