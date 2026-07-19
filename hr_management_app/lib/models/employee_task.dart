class EmployeeTask {
  final int taskId;
  final int employeeId;
  final String role;
  final String createdAt;
  final String updatedAt;

  EmployeeTask({
    required this.taskId,
    required this.employeeId,
    required this.role,
    required this.createdAt,
    required this.updatedAt,
  });

  factory EmployeeTask.fromJson(Map<String, dynamic> json) {
    return EmployeeTask(
      taskId: json['task_id'] ?? 0,
      employeeId: json['employee_id'] ?? 0,
      role: json['role'] ?? '',
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}