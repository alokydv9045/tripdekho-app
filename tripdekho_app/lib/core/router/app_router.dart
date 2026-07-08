import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../presentation/providers/auth_provider.dart';
import '../../presentation/layouts/main_layout.dart';
import '../../presentation/screens/home/home_screen.dart';
import '../../presentation/screens/auth/login_screen.dart';
import '../../presentation/screens/auth/register_screen.dart';
import '../../presentation/screens/auth/vendor_register_screen.dart';
import '../../presentation/screens/vendor/vendor_dashboard_screen.dart';
import '../../presentation/screens/vendor/vendor_trips_screen.dart';
import '../../presentation/screens/vendor/add_trip_screen.dart';
import '../../presentation/screens/trips/trips_list_screen.dart';
import '../../presentation/screens/trip/trip_details_screen.dart';
import '../../presentation/screens/booking/booking_screen.dart';
import '../../presentation/screens/bookings/my_bookings_screen.dart';
import '../../presentation/screens/chat/chat_list_screen.dart';
import '../../presentation/screens/chat/chat_detail_screen.dart';
import '../../presentation/screens/profile/profile_screen.dart';
import '../../presentation/screens/saved/saved_screen.dart';
import '../../presentation/screens/onboarding/onboarding_screen.dart';
import '../../presentation/screens/vendor/vendor_bookings_screen.dart';
import '../../presentation/screens/vendor/vendor_payout_screen.dart';
import '../../presentation/screens/ai_planner/ai_planner_screen.dart';
import '../../presentation/screens/vlog/vlog_screen.dart';
import '../../presentation/screens/notifications/notifications_screen.dart';
import 'package:hive_flutter/hive_flutter.dart';

// Create GlobalKeys for Navigators
final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authNotifierProvider);

  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    redirect: (context, state) {
      if (authState.isLoading && authState.user == null && authState.error == null) {
        return null;
      }

      final box = Hive.box('settings');
      final hasSeenOnboarding = box.get('has_seen_onboarding', defaultValue: false);
      final isGoingToOnboarding = state.matchedLocation == '/onboarding';

      if (!hasSeenOnboarding && !isGoingToOnboarding) {
        return '/onboarding';
      }
      
      if (hasSeenOnboarding && isGoingToOnboarding) {
        return '/login';
      }

      final isLoggedIn = authState.user != null;
      final isAuthRoute = state.matchedLocation == '/login' || 
                          state.matchedLocation == '/register' || 
                          state.matchedLocation == '/register-vendor';

      if (hasSeenOnboarding && !isLoggedIn && !isAuthRoute) {
        return '/login';
      }

      if (isLoggedIn && isAuthRoute) {
        return '/';
      }

      return null;
    },
    routes: [
      GoRoute(
        path: '/onboarding',
        builder: (context, state) => const OnboardingScreen(),
      ),
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        path: '/register-vendor',
        builder: (context, state) => const VendorRegisterScreen(),
      ),
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        builder: (context, state, child) {
          return MainLayout(child: child);
        },
        routes: [
          GoRoute(
            path: '/',
            builder: (context, state) {
              final authState = ref.watch(authNotifierProvider);
              if (authState.user?.role == 'vendor') {
                return const VendorDashboardScreen();
              }
              return const HomeScreen();
            },
          ),
          GoRoute(
            path: '/saved',
            builder: (context, state) => const SavedScreen(),
          ),
          GoRoute(
            path: '/trips',
            builder: (context, state) {
              final category = state.uri.queryParameters['category'];
              final search = state.uri.queryParameters['search'];
              return TripsListScreen(
                initialCategory: category,
                initialSearch: search,
              );
            },
          ),
          GoRoute(
            path: '/profile',
            builder: (context, state) => const ProfileScreen(),
          ),
          GoRoute(
            path: '/my-bookings',
            builder: (context, state) => const MyBookingsScreen(),
          ),
          GoRoute(
            path: '/vendor/trips',
            builder: (context, state) => const VendorTripsScreen(),
          ),
          GoRoute(
            path: '/vendor/add-trip',
            builder: (context, state) => const AddTripScreen(),
          ),
          GoRoute(
            path: '/chats',
            builder: (context, state) => const ChatListScreen(),
          ),
          GoRoute(
            path: '/vendor/bookings',
            builder: (context, state) => const VendorBookingsScreen(),
          ),
          GoRoute(
            path: '/vendor/payouts',
            builder: (context, state) => const VendorPayoutScreen(),
          ),
          GoRoute(
            path: '/ai-planner',
            builder: (context, state) => const AiPlannerScreen(),
          ),
          GoRoute(
            path: '/vlogs',
            builder: (context, state) => const VlogScreen(),
          ),
          GoRoute(
            path: '/notifications',
            builder: (context, state) => const NotificationsScreen(),
          ),
        ],
      ),
      // Details and Booking screens are outside the ShellRoute so they cover the bottom nav bar when opened
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/trip/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return TripDetailsScreen(tripId: id);
        },
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/trip/:id/book',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return BookingScreen(tripId: id);
        },
      ),
      GoRoute(
        parentNavigatorKey: _rootNavigatorKey,
        path: '/chat/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          final otherUserName = state.extra as String? ?? 'Partner';
          return ChatDetailScreen(chatId: id, otherUserName: otherUserName);
        },
      ),
    ],
  );
});
