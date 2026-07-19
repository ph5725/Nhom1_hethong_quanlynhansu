import 'package:hr_management_app/models/employee.dart';
import 'package:hr_management_app/models/attendance.dart';
import 'package:hr_management_app/models/salary.dart';
import 'package:hr_management_app/models/allowance.dart';
import 'package:hr_management_app/models/employee_insurance.dart';
import 'package:hr_management_app/models/leave.dart';
import 'package:hr_management_app/models/task.dart';
import 'package:hr_management_app/models/work_schedule.dart';

class HrService {
  // Dữ liệu giả lập cho bảng employees
  final List<Map<String, dynamic>> _mockEmployees = [
    {
      "id": 1,
      "fullname": "Nguyễn Văn An",
      "date_of_birth": "1985-01-01",
      "gender": "Male",
      "birthplace": "Hà Nội",
      "ethnicity": "Kinh",
      "address": "123 Đường ABC",
      "email": "admin@company.com",
      "department_id": 1,
      "education_id": 6,
      "user_id": 1,
      "position_id": 1,
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    },
    {
      "id": 2,
      "fullname": "Trần Thị Bình",
      "date_of_birth": "1988-02-02",
      "gender": "Female",
      "birthplace": "TP.HCM",
      "ethnicity": "Kinh",
      "address": "456 Đường XYZ",
      "email": "hrm@company.com",
      "department_id": 1,
      "education_id": 7,
      "user_id": 2,
      "position_id": 2,
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    },
  ];

  // Dữ liệu giả lập cho bảng attendances
  final List<Map<String, dynamic>> _mockAttendances = [
    {
      "employee_id": 1,
      "attendance_date": "2025-05-18",
      "check_in": "08:00:00",
      "check_out": "17:00:00",
      "status": "Present",
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    },
    {
      "employee_id": 2,
      "attendance_date": "2025-05-18",
      "check_in": "08:15:00",
      "check_out": null,
      "status": "Late",
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    }
  ];

  // Dữ liệu giả lập cho bảng salaries
  final List<Map<String, dynamic>> _mockSalaries = [
    {
      "id": 1,
      "salary_level": "Cấp 1",
      "basic_salary": 8000000.00,
      "base_coefficient": 1.0,
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    },
    {
      "id": 2,
      "salary_level": "Cấp 2",
      "basic_salary": 10000000.00,
      "base_coefficient": 1.5,
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    }
  ];

  // Dữ liệu giả lập cho bảng allowances
  final List<Map<String, dynamic>> _mockAllowances = [
    {
      "id": 1,
      "allowance_type_id": 1,
      "amount": 1000000.00,
      "is_seniority_base": false,
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    },
    {
      "id": 2,
      "allowance_type_id": 2,
      "amount": 2000000.00,
      "is_seniority_base": false,
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    }
  ];

  // Dữ liệu giả lập cho bảng employee_insurance
  final List<Map<String, dynamic>> _mockEmployeeInsurances = [
    {
      "employee_id": 1,
      "insurance_id": 1,
      "actual_employee_pct": 1.5,
      "actual_company_pct": 3.0,
      "actual_total_pct": 4.5,
      "note": null,
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    },
    {
      "employee_id": 2,
      "insurance_id": 2,
      "actual_employee_pct": 0.5,
      "actual_company_pct": 1.0,
      "actual_total_pct": 1.5,
      "note": null,
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    }
  ];

  // Dữ liệu giả lập cho bảng leaves
  final List<Map<String, dynamic>> _mockLeaves = [
    {
      "employee_id": 1,
      "approved_by": 1,
      "approved_date": "2025-05-18",
      "leave_type_id": 1,
      "leave_date": "2025-05-20",
      "note": null,
      "status": "approved",
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    },
    {
      "employee_id": 2,
      "approved_by": 1,
      "approved_date": null,
      "leave_type_id": 2,
      "leave_date": "2025-05-21",
      "note": null,
      "status": "pending",
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    }
  ];

  // Dữ liệu giả lập cho bảng tasks
  final List<Map<String, dynamic>> _mockTasks = [
    {
      "id": 1,
      "title": "Hoàn thành báo cáo tháng",
      "description": null,
      "assigned_by_id": 1,
      "assigned_to_id": 1,
      "assigned_date": "2025-05-18",
      "start_date": "2025-05-19",
      "end_date": null,
      "due_date": "2025-05-25",
      "status": "Pending",
      "priority": "High",
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    },
    {
      "id": 2,
      "title": "Kiểm tra hệ thống",
      "description": null,
      "assigned_by_id": 1,
      "assigned_to_id": 2,
      "assigned_date": "2025-05-18",
      "start_date": "2025-05-20",
      "end_date": null,
      "due_date": "2025-05-26",
      "status": "Pending",
      "priority": "Medium",
      "created_at": "2025-05-24 11:54:28",
      "updated_at": "2025-05-24 11:54:28"
    }
  ];

  // Dữ liệu giả lập cho bảng work_schedules
  final List<Map<String, dynamic>> _mockWorkSchedules = [
    {
      "employee_id": 1,
      "status_id": 2,
      "shift_id": 3,
      "work_date": "2025-05-24",
      "is_day_off": false,
      "created_at": "2025-05-24 12:46:00",
      "updated_at": "2025-05-24 12:46:00"
    },
    {
      "employee_id": 2,
      "status_id": 2,
      "shift_id": 3,
      "work_date": "2025-05-24",
      "is_day_off": false,
      "created_at": "2025-05-24 12:46:00",
      "updated_at": "2025-05-24 12:46:00"
    }
  ];

  Future<List<Employee>> getEmployees() async {
    await Future.delayed(Duration(seconds: 1));
    return _mockEmployees.map((e) => Employee.fromJson(e)).toList();
  }

  Future<List<Attendance>> getAttendances() async {
    await Future.delayed(Duration(seconds: 1));
    return _mockAttendances.map((e) => Attendance.fromJson(e)).toList();
  }

  Future<List<Salary>> getSalaries() async {
    await Future.delayed(Duration(seconds: 1));
    return _mockSalaries.map((e) => Salary.fromJson(e)).toList();
  }

  Future<List<Allowance>> getAllowances() async {
    await Future.delayed(Duration(seconds: 1));
    return _mockAllowances.map((e) => Allowance.fromJson(e)).toList();
  }

  Future<List<EmployeeInsurance>> getEmployeeInsurances() async {
    await Future.delayed(Duration(seconds: 1));
    return _mockEmployeeInsurances.map((e) => EmployeeInsurance.fromJson(e)).toList();
  }

  Future<List<Leave>> getLeaves() async {
    await Future.delayed(Duration(seconds: 1));
    return _mockLeaves.map((e) => Leave.fromJson(e)).toList();
  }

  Future<List<Task>> getTasks() async {
    await Future.delayed(Duration(seconds: 1));
    return _mockTasks.map((e) => Task.fromJson(e)).toList();
  }

  Future<List<WorkSchedule>> getWorkSchedules() async {
    await Future.delayed(Duration(seconds: 1));
    return _mockWorkSchedules.map((e) => WorkSchedule.fromJson(e)).toList();
  }

  Future<bool> recordAttendance(String qrCodeData) async {
    await Future.delayed(Duration(seconds: 1));
    return qrCodeData.contains("employee_id");
  }

  Future<bool> submitLeaveRequest(int employeeId, int leaveTypeId, String leaveDate, String? note) async {
    await Future.delayed(Duration(seconds: 1));
    _mockLeaves.add({
      "employee_id": employeeId,
      "approved_by": 1,
      "approved_date": null,
      "leave_type_id": leaveTypeId,
      "leave_date": leaveDate,
      "note": note,
      "status": "pending",
      "created_at": "2025-05-24 12:46:00",
      "updated_at": "2025-05-24 12:46:00"
    });
    return true;
  }
}