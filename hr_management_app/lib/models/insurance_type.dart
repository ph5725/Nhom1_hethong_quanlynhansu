class InsuranceType {
  final String name;
  final String description;
  final String createdAt;
  final String updatedAt;

  InsuranceType({
    required this.name,
    required this.description,
    required this.createdAt,
    required this.updatedAt,
  });

  factory InsuranceType.fromJson(Map<String, dynamic> json) {
    return InsuranceType(
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}