class Contract {
  final String contractCode;
  final int employeeId;
  final int salaryId;
  final int type;
  final String startDate;
  final String? endDate;
  final String signDate;
  final String? contractFile;
  final String status;
  final String? note;
  final int yearOfService;
  final String createdAt;
  final String updatedAt;

  Contract({
    required this.contractCode,
    required this.employeeId,
    required this.salaryId,
    required this.type,
    required this.startDate,
    this.endDate,
    required this.signDate,
    this.contractFile,
    required this.status,
    this.note,
    required this.yearOfService,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Contract.fromJson(Map<String, dynamic> json) {
    return Contract(
      contractCode: json['contract_code'] ?? '',
      employeeId: json['employee_id'] ?? 0,
      salaryId: json['salary_id'] ?? 0,
      type: json['type'] ?? 0,
      startDate: json['start_date'] ?? '',
      endDate: json['end_date'],
      signDate: json['sign_date'] ?? '',
      contractFile: json['contract_file'],
      status: json['status'] ?? '',
      note: json['note'],
      yearOfService: json['year_of_service'] ?? 0,
      createdAt: json['created_at'] ?? '',
      updatedAt: json['updated_at'] ?? '',
    );
  }
}