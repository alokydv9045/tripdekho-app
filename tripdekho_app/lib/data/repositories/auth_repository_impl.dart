import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../core/network/api_client.dart';
import '../../core/network/api_endpoints.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';

class AuthRepositoryImpl implements AuthRepository {
  final ApiClient apiClient;
  final FlutterSecureStorage secureStorage;

  AuthRepositoryImpl(this.apiClient, this.secureStorage);

  @override
  Future<UserEntity?> login(String email, String password) async {
    final response = await apiClient.post(
      ApiEndpoints.login,
      data: {
        'email': email,
        'password': password,
      },
    );

    final token = response['access_token'];
    final userJson = response['user'];

    final user = UserEntity.fromJson(userJson, token: token);
    
    // Save token locally
    if (token != null) {
      await secureStorage.write(key: 'auth_token', value: token);
    }
    
    return user;
  }

  @override
  Future<UserEntity?> registerCustomer(String name, String email, String password, String phone) async {
    final response = await apiClient.post(
      ApiEndpoints.register,
      data: {
        'name': name,
        'email': email,
        'password': password,
        'phone': phone,
        'role': 'customer',
      },
    );

    final token = response['access_token'];
    final userJson = response['user'];

    final user = UserEntity.fromJson(userJson, token: token);
    
    if (token != null) {
      await secureStorage.write(key: 'auth_token', value: token);
    }
    
    return user;
  }

  @override
  Future<UserEntity?> registerVendor(String businessName, String email, String password, String phone, String description) async {
    final response = await apiClient.post(
      ApiEndpoints.register, // Or vendor specific register endpoint if backend has one
      data: {
        'name': businessName, // Vendor's name maps to user name
        'email': email,
        'password': password,
        'phone': phone,
        'role': 'vendor',
        'businessName': businessName,
        'description': description,
      },
    );

    final token = response['access_token'];
    final userJson = response['user'];

    final user = UserEntity.fromJson(userJson, token: token);
    
    if (token != null) {
      await secureStorage.write(key: 'auth_token', value: token);
    }
    
    return user;
  }

  @override
  Future<void> logout() async {
    // We could call a logout endpoint here if the backend has one.
    // For now, just clear the local token.
    await secureStorage.delete(key: 'auth_token');
  }

  @override
  Future<UserEntity?> checkAuthStatus() async {
    final token = await secureStorage.read(key: 'auth_token');
    if (token != null) {
      try {
        final response = await apiClient.get(ApiEndpoints.profile);
        return UserEntity.fromJson(response['data'] ?? response, token: token);
      } catch (e) {
        // Token might be invalid or expired
        await secureStorage.delete(key: 'auth_token');
        return null;
      }
    }
    return null;
  }
}
