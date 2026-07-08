import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

class ConnectivityNotifier extends StateNotifier<bool> {
  final Connectivity _connectivity = Connectivity();

  ConnectivityNotifier() : super(true) {
    _init();
  }

  Future<void> _init() async {
    final result = await _connectivity.checkConnectivity();
    _updateState(result);

    _connectivity.onConnectivityChanged.listen((result) {
      _updateState(result);
    });
  }

  void _updateState(List<ConnectivityResult> result) {
    if (result.contains(ConnectivityResult.none)) {
      state = false;
    } else {
      state = true;
    }
  }
}

final connectivityProvider = StateNotifierProvider<ConnectivityNotifier, bool>((ref) {
  return ConnectivityNotifier();
});
