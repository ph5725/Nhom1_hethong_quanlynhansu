class WorkDateStatus {
  final String name;
  final String description;
  final String createdAt;
  final String updatedAt;

  WorkDateStatus({
    required this.name,
    required this.description,
    required this.createdAt,
    required this.updatedAt,
  });

  factory WorkDateStatus.fromJson(Map<String, dynamic> json) {
    return WorkDateStatus(
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}