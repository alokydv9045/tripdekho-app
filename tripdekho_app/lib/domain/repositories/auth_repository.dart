import '../entities/user_entity.dart';

abstract class AuthRepository {
  Future<UserEntity?> login(String email, String password);
  Future<UserEntity?> registerCustomer(String name, String email, String password, String phone);
  Future<UserEntity?> registerVendor(String businessName, String email, String password, String phone, String description);
  Future<void> logout();
  Future<UserEntity?> checkAuthStatus();
}
