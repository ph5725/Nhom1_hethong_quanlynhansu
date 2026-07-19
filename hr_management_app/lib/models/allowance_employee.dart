class AllowanceEmployee {
  final int allowanceId;
  final int employeeId;
  final double totalAllowance;
  final String createdAt;
  final String updatedAt;

  AllowanceEmployee({
    required this.allowanceId,
    required this.employeeId,
    required this.totalAllowance,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AllowanceEmployee.fromJson(Map<String, dynamic> json) {
    return AllowanceEmployee(
      allowanceId: json['allowance_id'] ?? 0,
      employeeId: json['employee_id'] ?? 0,
      totalAllowance: (json['total_allowance'] ?? 0.0).toDouble(),
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}