import '../models/user_model.dart';
import '../datasources/api_client.dart';

class AuthRepository {
  final ApiClient _apiClient;

  AuthRepository(this._apiClient);

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _apiClient.publicDio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> data) async {
    final response = await _apiClient.publicDio.post('/auth/register', data: data);
    return response.data;
  }

  Future<UserModel> getMe() async {
    final response = await _apiClient.privateDio.get('/auth/me');
    // Assuming response.data contains the user directly or inside 'data'
    final userData = response.data['data'] ?? response.data;
    return UserModel.fromJson(userData);
  }

  Future<void> logout() async {
    await _apiClient.privateDio.post('/auth/logout');
  }

  Future<void> forgotPassword(String identifier) async {
    await _apiClient.publicDio.post('/auth/forgot-password', data: {
      'identifier': identifier,
    });
  }

  Future<void> resetPassword(String identifier, String otp, String newPassword) async {
    await _apiClient.publicDio.post('/auth/reset-password', data: {
      'identifier': identifier,
      'otp': otp,
      'newPassword': newPassword,
    });
  }
}
