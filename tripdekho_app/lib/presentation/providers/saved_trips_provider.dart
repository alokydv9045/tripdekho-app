import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:hive_flutter/hive_flutter.dart';

class SavedTripsNotifier extends StateNotifier<Set<String>> {
  SavedTripsNotifier() : super({}) {
    _loadSavedTrips();
  }

  void _loadSavedTrips() {
    final box = Hive.box('user_cache');
    final List<dynamic>? savedList = box.get('saved_trip_ids');
    if (savedList != null) {
      state = savedList.cast<String>().toSet();
    }
  }

  void toggleSaved(String tripId) {
    final box = Hive.box('user_cache');
    
    if (state.contains(tripId)) {
      state = {...state}..remove(tripId);
    } else {
      state = {...state}..add(tripId);
    }
    
    // Persist to Hive
    box.put('saved_trip_ids', state.toList());
  }

  bool isSaved(String tripId) {
    return state.contains(tripId);
  }
}

final savedTripsProvider = StateNotifierProvider<SavedTripsNotifier, Set<String>>((ref) {
  return SavedTripsNotifier();
});
