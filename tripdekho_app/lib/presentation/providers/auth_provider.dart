import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/network/api_client.dart';
import '../../domain/entities/user_entity.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/register_customer_usecase.dart';
import '../../domain/usecases/register_vendor_usecase.dart';

// 1. Provide the Dependencies
final authRepositoryProvider = Provider((ref) {
  final apiClient = ref.watch(apiClientProvider);
  final storage = ref.watch(secureStorageProvider);
  return AuthRepositoryImpl(apiClient, storage);
});

final loginUseCaseProvider = Provider((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return LoginUseCase(repository);
});

final registerCustomerUseCaseProvider = Provider((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return RegisterCustomerUseCase(repository);
});

final registerVendorUseCaseProvider = Provider((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return RegisterVendorUseCase(repository);
});

// 2. Define the State
class AuthState {
  final bool isLoading;
  final UserEntity? user;
  final String? error;

  AuthState({this.isLoading = false, this.user, this.error});

  AuthState copyWith({bool? isLoading, UserEntity? user, String? error, bool clearError = false}) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      user: user ?? this.user,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

// 3. Define the Notifier
class AuthNotifier extends StateNotifier<AuthState> {
  final LoginUseCase _loginUseCase;
  final RegisterCustomerUseCase _registerCustomerUseCase;
  final RegisterVendorUseCase _registerVendorUseCase;
  final AuthRepositoryImpl _repository;

  AuthNotifier(
    this._loginUseCase,
    this._registerCustomerUseCase,
    this._registerVendorUseCase,
    this._repository,
  ) : super(AuthState()) {
    _checkInitialAuth();
  }

  Future<void> _checkInitialAuth() async {
    state = state.copyWith(isLoading: true);
    try {
      final user = await _repository.checkAuthStatus();
      state = state.copyWith(isLoading: false, user: user);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final user = await _loginUseCase.execute(email, password);
      state = state.copyWith(isLoading: false, user: user);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> registerCustomer(String name, String email, String password, String phone) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final user = await _registerCustomerUseCase.execute(name, email, password, phone);
      state = state.copyWith(isLoading: false, user: user);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> registerVendor(String businessName, String email, String password, String phone, String description) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final user = await _registerVendorUseCase.execute(businessName, email, password, phone, description);
      state = state.copyWith(isLoading: false, user: user);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);
    await _repository.logout();
    state = AuthState(); // Reset state
  }
}

// 4. Expose the Notifier via Provider
final authNotifierProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final loginUseCase = ref.watch(loginUseCaseProvider);
  final registerCustomerUseCase = ref.watch(registerCustomerUseCaseProvider);
  final registerVendorUseCase = ref.watch(registerVendorUseCaseProvider);
  final repository = ref.watch(authRepositoryProvider);
  return AuthNotifier(
    loginUseCase,
    registerCustomerUseCase,
    registerVendorUseCase,
    repository as AuthRepositoryImpl,
  );
});
