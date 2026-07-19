class Insurance {
  final int type;
  final double defaultEmployeePct;
  final double defaultCompanyPct;
  final double defaultTotalPct;
  final String? note;
  final String createdAt;
  final String updatedAt;

  Insurance({
    required this.type,
    required this.defaultEmployeePct,
    required this.defaultCompanyPct,
    required this.defaultTotalPct,
    this.note,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Insurance.fromJson(Map<String, dynamic> json) {
    return Insurance(
      type: json['type'] ?? 0,
      defaultEmployeePct: (json['default_employee_pct'] ?? 0.0).toDouble(),
      defaultCompanyPct: (json['default_company_pct'] ?? 0.0).toDouble(),
      defaultTotalPct: (json['default_total_pct'] ?? 0.0).toDouble(),
      note: json['note'],
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}