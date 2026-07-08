import '../entities/user_entity.dart';
import '../repositories/auth_repository.dart';

class RegisterVendorUseCase {
  final AuthRepository repository;

  RegisterVendorUseCase(this.repository);

  Future<UserEntity?> execute(String businessName, String email, String password, String phone, String description) {
    return repository.registerVendor(businessName, email, password, phone, description);
  }
}
