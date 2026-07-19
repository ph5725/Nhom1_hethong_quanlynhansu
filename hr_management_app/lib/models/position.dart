class Position {
  final String name;
  final String? manager;
  final String createdAt;
  final String updatedAt;

  Position({
    required this.name,
    this.manager,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Position.fromJson(Map<String, dynamic> json) {
    return Position(
      name: json['name'] ?? '',
      manager: json['manager'],
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}