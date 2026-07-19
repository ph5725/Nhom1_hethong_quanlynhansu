class EducationLevel {
  final String level;
  final String major;
  final String createdAt;
  final String updatedAt;

  EducationLevel({
    required this.level,
    required this.major,
    required this.createdAt,
    required this.updatedAt,
  });

  factory EducationLevel.fromJson(Map<String, dynamic> json) {
    return EducationLevel(
      level: json['level'] ?? '',
      major: json['major'] ?? '',
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}