class RoleUser {
  final int userId;
  final int roleId;
  final String createdAt;
  final String updatedAt;

  RoleUser({
    required this.userId,
    required this.roleId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory RoleUser.fromJson(Map<String, dynamic> json) {
    return RoleUser(
      userId: json['user_id'] ?? 0,
      roleId: json['role_id'] ?? 0,
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}