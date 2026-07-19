class Employee {
  final int? id; // Thêm id cho Employee, vì API có thể trả về id của Employee
  final String? fullname;

  Employee({this.id, this.fullname});

  // Constructor factory để tạo đối tượng Employee từ Map (JSON)
  factory Employee.fromJson(Map<String, dynamic> json) {
    return Employee(
      id: json['id'] as int?, // Đảm bảo kiểu dữ liệu là int và có thể null
      fullname: json['fullname'] as String?, // Đảm bảo kiểu dữ liệu là String và có thể null
    );
  }

  // Phương thức để chuyển đổi đối tượng Employee thành Map (để gửi lên API nếu cần)
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullname': fullname,
    };
  }
}

class Attendance {
  final int? id; // Có thể null nếu là tạo mới (khi POST), nhưng khi GET thì luôn có id
  final Employee? employee; // Thông tin Employee liên quan đến điểm danh
  final String attendanceDate;
  final String checkIn;
  final String? checkOut; // Có thể null nếu chưa check out
  final String status;

  Attendance({
    this.id,
    this.employee,
    required this.attendanceDate,
    required this.checkIn,
    this.checkOut,
    required this.status,
  });

  // Constructor factory để tạo đối tượng Attendance từ Map (JSON nhận từ API)
  factory Attendance.fromJson(Map<String, dynamic> json) {
    return Attendance(
      id: json['id'] as int?, // Lấy id và ép kiểu an toàn
      // Kiểm tra xem 'employee' có tồn tại và không phải null không trước khi parse
      employee: json['employee'] != null
          ? Employee.fromJson(json['employee'] as Map<String, dynamic>)
          : null,
      attendanceDate: json['attendance_date'] as String,
      checkIn: json['check_in'] as String,
      checkOut: json['check_out'] as String?, // Có thể null
      status: json['status'] as String,
    );
  }

  // Phương thức để chuyển đổi đối tượng Dart thành Map<String, dynamic> (để gửi lên API)
  // Khi gửi dữ liệu điểm danh, thường chỉ gửi các trường cần thiết, không gửi toàn bộ object Employee
  Map<String, dynamic> toJson() {
    return {
      // 'id': id, // Thường không gửi id khi tạo mới, chỉ gửi khi cập nhật
      // Nếu API yêu cầu employee_id thay vì toàn bộ object employee khi tạo/cập nhật
      // 'employee_id': employee?.id,
      'attendance_date': attendanceDate,
      'check_in': checkIn,
      'check_out': checkOut,
      'status': status,
    };
  }
}