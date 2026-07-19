class EmployeeInsurance {
  final int employeeId;
  final int insuranceId;
  final double actualEmployeePct;
  final double actualCompanyPct;
  final double actualTotalPct;
  final String? note;
  final String createdAt;
  final String updatedAt;

  EmployeeInsurance({
    required this.employeeId,
    required this.insuranceId,
    required this.actualEmployeePct,
    required this.actualCompanyPct,
    required this.actualTotalPct,
    this.note,
    required this.createdAt,
    required this.updatedAt,
  });

  factory EmployeeInsurance.fromJson(Map<String, dynamic> json) {
    return EmployeeInsurance(
      employeeId: json['employee_id'] ?? 0,
      insuranceId: json['insurance_id'] ?? 0,
      actualEmployeePct: (json['actual_employee_pct'] ?? 0.0).toDouble(),
      actualCompanyPct: (json['actual_company_pct'] ?? 0.0).toDouble(),
      actualTotalPct: (json['actual_total_pct'] ?? 0.0).toDouble(),
      note: json['note'],
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}