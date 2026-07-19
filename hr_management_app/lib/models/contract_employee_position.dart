class ContractEmployeePosition {
  final int employeeId;
  final int contractId;
  final int positionId;
  final bool isMain;
  final String startDate;
  final String? endDate;
  final double baseSalary;
  final double ratio;
  final String createdAt;
  final String updatedAt;

  ContractEmployeePosition({
    required this.employeeId,
    required this.contractId,
    required this.positionId,
    required this.isMain,
    required this.startDate,
    this.endDate,
    required this.baseSalary,
    required this.ratio,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ContractEmployeePosition.fromJson(Map<String, dynamic> json) {
    return ContractEmployeePosition(
      employeeId: json['employee_id'] ?? 0,
      contractId: json['contract_id'] ?? 0,
      positionId: json['position_id'] ?? 0,
      isMain: json['is_main'] ?? false,
      startDate: json['start_date'] ?? '',
      endDate: json['end_date'],
      baseSalary: (json['base_salary'] ?? 0.0).toDouble(),
      ratio: (json['ratio'] ?? 0.0).toDouble(),
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}