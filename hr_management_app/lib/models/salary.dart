class Salary {
  final int id; // Thêm thuộc tính id
  final String salaryLevel;
  final double basicSalary;
  final double baseCoefficient;
  final String createdAt;
  final String updatedAt;

  Salary({
    required this.id,
    required this.salaryLevel,
    required this.basicSalary,
    required this.baseCoefficient,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Salary.fromJson(Map<String, dynamic> json) {
    return Salary(
      id: json['id'] ?? 0,
      salaryLevel: json['salary_level'] ?? '',
      basicSalary: (json['basic_salary'] ?? 0.0).toDouble(),
      baseCoefficient: (json['base_coefficient'] ?? 0.0).toDouble(),
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}