class Task {
  final String title;
  final String? description;
  final int assignedById;
  final int assignedToId;
  final String assignedDate;
  final String startDate;
  final String? endDate;
  final String dueDate;
  final String status;
  final String priority;
  final String createdAt;
  final String updatedAt;

  Task({
    required this.title,
    this.description,
    required this.assignedById,
    required this.assignedToId,
    required this.assignedDate,
    required this.startDate,
    this.endDate,
    required this.dueDate,
    required this.status,
    required this.priority,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      title: json['title'] ?? '',
      description: json['description'],
      assignedById: json['assigned_by_id'] ?? 0,
      assignedToId: json['assigned_to_id'] ?? 0,
      assignedDate: json['assigned_date'] ?? '',
      startDate: json['start_date'] ?? '',
      endDate: json['end_date'],
      dueDate: json['due_date'] ?? '',
      status: json['status'] ?? '',
      priority: json['priority'] ?? '',
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}