class WorkSchedule {
  final int employeeId;
  final int statusId;
  final int shiftId;
  final String workDate;
  final bool isDayOff;
  final String createdAt;
  final String updatedAt;

  WorkSchedule({
    required this.employeeId,
    required this.statusId,
    required this.shiftId,
    required this.workDate,
    required this.isDayOff,
    required this.createdAt,
    required this.updatedAt,
  });

  factory WorkSchedule.fromJson(Map<String, dynamic> json) {
    return WorkSchedule(
      employeeId: json['employee_id'] ?? 0,
      statusId: json['status_id'] ?? 0,
      shiftId: json['shift_id'] ?? 0,
      workDate: json['work_date'] ?? '',
      isDayOff: json['is_day_off'] ?? false,
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}