import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

class ThemeNotifier extends StateNotifier<ThemeMode> {
  ThemeNotifier() : super(ThemeMode.system) {
    _loadTheme();
  }

  void _loadTheme() {
    final box = Hive.box('settings');
    final String? themeStr = box.get('theme_mode');
    
    if (themeStr == 'light') {
      state = ThemeMode.light;
    } else if (themeStr == 'dark') {
      state = ThemeMode.dark;
    } else {
      state = ThemeMode.system;
    }
  }

  void toggleTheme() {
    final box = Hive.box('settings');
    
    if (state == ThemeMode.light) {
      state = ThemeMode.dark;
      box.put('theme_mode', 'dark');
    } else if (state == ThemeMode.dark) {
      state = ThemeMode.system;
      box.put('theme_mode', 'system');
    } else {
      state = ThemeMode.light;
      box.put('theme_mode', 'light');
    }
  }
  
  void setTheme(ThemeMode mode) {
    final box = Hive.box('settings');
    state = mode;
    box.put('theme_mode', mode.toString().split('.').last);
  }
}

final themeProvider = StateNotifierProvider<ThemeNotifier, ThemeMode>((ref) {
  return ThemeNotifier();
});
