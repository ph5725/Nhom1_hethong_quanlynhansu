class AllowanceType {
  final String name;
  final String description;
  final String createdAt;
  final String updatedAt;

  AllowanceType({
    required this.name,
    required this.description,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AllowanceType.fromJson(Map<String, dynamic> json) {
    return AllowanceType(
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}