abstract class AppException implements Exception {
  final String message;
  final String? code;
  final dynamic details;

  AppException(this.message, {this.code, this.details});

  @override
  String toString() {
    if (code != null) {
      return '$code: $message';
    }
    return message;
  }
}

class NetworkException extends AppException {
  NetworkException(super.message, {super.code, super.details});
}

class AuthException extends AppException {
  AuthException(super.message, {super.code, super.details});
}

class ServerException extends AppException {
  ServerException(super.message, {super.code, super.details});
}

class ValidationException extends AppException {
  ValidationException(super.message, {super.code, super.details});
}

class UnknownException extends AppException {
  UnknownException(super.message, {super.code, super.details});
}
