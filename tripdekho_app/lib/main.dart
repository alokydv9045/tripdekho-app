import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/router/app_router.dart';
import 'core/theme/app_theme.dart';
import 'package:hive_flutter/hive_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Hive.initFlutter();
  await Hive.openBox('user_cache');
  await Hive.openBox('trips_cache');
  await Hive.openBox('search_history');
  await Hive.openBox('settings');

  runApp(
    const ProviderScope(
      child: TripDekhoApp(),
    ),
  );
}

class TripDekhoApp extends ConsumerWidget {
  const TripDekhoApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      title: 'TripDekho',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.theme,
      routerConfig: AppRouter.router,
    );
  }
}

