// lib/models/employee_personal_info.dart

class EmployeePersonalInfo {
  final int id;
  final String fullname;
  final String? dateOfBirth; // Có thể null
  final String? gender; // Có thể null
  final String? birthplace; // Có thể null
  final String? ethnicity; // Có thể null
  final String? address; // Có thể null
  final String? email; // Có thể null
  final Department? department;
  final Position? position;
  final EducationLevel? educationLevel;
  final User? user; // Thường là user account liên kết với employee

  EmployeePersonalInfo({
    required this.id,
    required this.fullname,
    this.dateOfBirth,
    this.gender,
    this.birthplace,
    this.ethnicity,
    this.address,
    this.email,
    this.department,
    this.position,
    this.educationLevel,
    this.user,
  });

  factory EmployeePersonalInfo.fromJson(Map<String, dynamic> json) {
    return EmployeePersonalInfo(
      id: json['id'] as int,
      fullname: json['fullname'] as String,
      dateOfBirth: json['date_of_birth'] as String?,
      gender: json['gender'] as String?,
      birthplace: json['birthplace'] as String?,
      ethnicity: json['ethnicity'] as String?,
      address: json['address'] as String?,
      email: json['email'] as String?,
      department: json['department'] != null
          ? Department.fromJson(json['department'] as Map<String, dynamic>)
          : null,
      position: json['position'] != null
          ? Position.fromJson(json['position'] as Map<String, dynamic>)
          : null,
      educationLevel: json['education_level'] != null // Sửa từ education_level
          ? EducationLevel.fromJson(json['education_level'] as Map<String, dynamic>)
          : null,
      user: json['user'] != null // Lấy thông tin user (username)
          ? User.fromJson(json['user'] as Map<String, dynamic>)
          : null,
    );
  }
}

class Department {
  final int id;
  final String name;

  Department({required this.id, required this.name});

  factory Department.fromJson(Map<String, dynamic> json) {
    return Department(
      id: json['id'] as int,
      name: json['name'] as String,
    );
  }
}

class Position {
  final int id;
  final String name;

  Position({required this.id, required this.name});

  factory Position.fromJson(Map<String, dynamic> json) {
    return Position(
      id: json['id'] as int,
      name: json['name'] as String,
    );
  }
}

class EducationLevel {
  final int id;
  final String level; // Chú ý: trong JSON của bạn là 'level', không phải 'name'

  EducationLevel({required this.id, required this.level});

  factory EducationLevel.fromJson(Map<String, dynamic> json) {
    return EducationLevel(
      id: json['id'] as int,
      level: json['level'] as String, // Đảm bảo khớp với key từ API
    );
  }
}

class User {
  final int id;
  final String name; // Tên đăng nhập

  User({required this.id, required this.name});

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
    );
  }
}