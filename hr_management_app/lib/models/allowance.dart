class Allowance {
  final int id; // Thêm thuộc tính id
  final int allowanceTypeId;
  final double amount;
  final bool isSeniorityBase;
  final String createdAt;
  final String updatedAt;

  Allowance({
    required this.id,
    required this.allowanceTypeId,
    required this.amount,
    required this.isSeniorityBase,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Allowance.fromJson(Map<String, dynamic> json) {
    return Allowance(
      id: json['id'] ?? 0,
      allowanceTypeId: json['allowance_type_id'] ?? 0,
      amount: (json['amount'] ?? 0.0).toDouble(),
      isSeniorityBase: json['is_seniority_base'] ?? false,
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}