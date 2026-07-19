class Attendance {
  final int employeeId;
  final String attendanceDate;
  final String? checkIn;
  final String? checkOut;
  final String status;
  final String createdAt;
  final String updatedAt;

  Attendance({
    required this.employeeId,
    required this.attendanceDate,
    this.checkIn,
    this.checkOut,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Attendance.fromJson(Map<String, dynamic> json) {
    return Attendance(
      employeeId: json['employee_id'] ?? 0,
      attendanceDate: json['attendance_date'] ?? '',
      checkIn: json['check_in'],
      checkOut: json['check_out'],
      status: json['status'] ?? '',
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}