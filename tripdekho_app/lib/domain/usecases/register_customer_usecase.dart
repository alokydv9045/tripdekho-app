import '../entities/user_entity.dart';
import '../repositories/auth_repository.dart';

class RegisterCustomerUseCase {
  final AuthRepository repository;

  RegisterCustomerUseCase(this.repository);

  Future<UserEntity?> execute(String name, String email, String password, String phone) {
    return repository.registerCustomer(name, email, password, phone);
  }
}
