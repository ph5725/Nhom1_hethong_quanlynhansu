class LeaveType {
  final String name;
  final String description;
  final String createdAt;
  final String updatedAt;

  LeaveType({
    required this.name,
    required this.description,
    required this.createdAt,
    required this.updatedAt,
  });

  factory LeaveType.fromJson(Map<String, dynamic> json) {
    return LeaveType(
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}