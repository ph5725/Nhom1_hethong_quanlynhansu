class ContractType {
  final String name;
  final String description;
  final String createdAt;
  final String updatedAt;

  ContractType({
    required this.name,
    required this.description,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ContractType.fromJson(Map<String, dynamic> json) {
    return ContractType(
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}