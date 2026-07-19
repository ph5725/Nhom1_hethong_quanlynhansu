class Leave {
  final int employeeId;
  final int approvedBy;
  final String? approvedDate;
  final int leaveTypeId;
  final String leaveDate;
  final String? note;
  final String status;
  final String createdAt;
  final String updatedAt;

  Leave({
    required this.employeeId,
    required this.approvedBy,
    this.approvedDate,
    required this.leaveTypeId,
    required this.leaveDate,
    this.note,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Leave.fromJson(Map<String, dynamic> json) {
    return Leave(
      employeeId: json['employee_id'] ?? 0,
      approvedBy: json['approved_by'] ?? 0,
      approvedDate: json['approved_date'],
      leaveTypeId: json['leave_type_id'] ?? 0,
      leaveDate: json['leave_date'] ?? '',
      note: json['note'],
      status: json['status'] ?? '',
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}