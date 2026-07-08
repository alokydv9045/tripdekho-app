class UserEntity {
  final String id;
  final String name;
  final String email;
  final String role;
  final String? avatarUrl;
  final String? token;

  const UserEntity({
    required this.id,
    required this.name,
    required this.email,
    this.role = 'customer',
    this.avatarUrl,
    this.token,
  });

  factory UserEntity.fromJson(Map<String, dynamic> json, {String? token}) {
    return UserEntity(
      id: json['id'] as String,
      name: json['name'] as String? ?? json['nickname'] as String? ?? '',
      email: json['email'] as String,
      role: json['role'] as String? ?? 'customer',
      avatarUrl: json['avatar'] != null ? json['avatar']['url'] as String? : null,
      token: token,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
  
    return other is UserEntity &&
      other.id == id &&
      other.name == name &&
      other.email == email &&
      other.role == role &&
      other.avatarUrl == avatarUrl &&
      other.token == token;
  }

  @override
  int get hashCode {
    return id.hashCode ^
      name.hashCode ^
      email.hashCode ^
      role.hashCode ^
      avatarUrl.hashCode ^
      token.hashCode;
  }
}
