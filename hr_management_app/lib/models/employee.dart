class Employee {
  final int id;
  final String fullname;
  final String dateOfBirth;
  final String gender;
  final String birthplace;
  final String ethnicity;
  final String address;
  final String email;
  final int departmentId;
  final int educationId;
  final int userId;
  final int positionId;
  final String createdAt;
  final String updatedAt;

  Employee({
    required this.id,
    required this.fullname,
    required this.dateOfBirth,
    required this.gender,
    required this.birthplace,
    required this.ethnicity,
    required this.address,
    required this.email,
    required this.departmentId,
    required this.educationId,
    required this.userId,
    required this.positionId,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Employee.fromJson(Map<String, dynamic> json) {
    return Employee(
      id: json['id'] ?? 0,
      fullname: json['fullname'] ?? '',
      dateOfBirth: json['date_of_birth'] ?? '',
      gender: json['gender'] ?? '',
      birthplace: json['birthplace'] ?? '',
      ethnicity: json['ethnicity'] ?? '',
      address: json['address'] ?? '',
      email: json['email'] ?? '',
      departmentId: json['department_id'] ?? 0,
      educationId: json['education_id'] ?? 0,
      userId: json['user_id'] ?? 0,
      positionId: json['position_id'] ?? 0,
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}