class WorkShift {
  final String shiftName;
  final String startTime;
  final String endTime;
  final int breakTime;
  final String createdAt;
  final String updatedAt;

  WorkShift({
    required this.shiftName,
    required this.startTime,
    required this.endTime,
    required this.breakTime,
    required this.createdAt,
    required this.updatedAt,
  });

  factory WorkShift.fromJson(Map<String, dynamic> json) {
    return WorkShift(
      shiftName: json['shift_name'] ?? '',
      startTime: json['start_time'] ?? '',
      endTime: json['end_time'] ?? '',
      breakTime: json['break_time'] ?? 0,
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}