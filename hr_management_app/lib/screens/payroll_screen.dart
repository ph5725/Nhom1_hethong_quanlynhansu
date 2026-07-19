import 'package:flutter/material.dart';
import '../models/employee.dart';
import '../models/salary.dart';
import '../models/allowance.dart';
import '../models/employee_insurance.dart';
import '../services/hr_service.dart';

class PayrollScreen extends StatelessWidget {
  final HrService _hrService = HrService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Bảng lương')),
      body: FutureBuilder<List<Employee>>(
        future: _hrService.getEmployees(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Lỗi: ${snapshot.error}'));
          }
          final employees = snapshot.data ?? [];
          return ListView.builder(
            itemCount: employees.length,
            itemBuilder: (context, index) {
              final employee = employees[index];
              return ListTile(
                title: Text(employee.fullname),
                subtitle: Text('Email: ${employee.email}'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => PayrollDetailScreen(employee: employee),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}

class PayrollDetailScreen extends StatelessWidget {
  final Employee employee;
  final HrService _hrService = HrService();

  PayrollDetailScreen({required this.employee});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Bảng lương - ${employee.fullname}')),
      body: FutureBuilder(
        future: Future.wait([
          _hrService.getSalaries(),
          _hrService.getAllowances(),
          _hrService.getEmployeeInsurances(),
        ]),
        builder: (context, AsyncSnapshot<List<dynamic>> snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Lỗi: ${snapshot.error}'));
          }

          final salaries = snapshot.data![0] as List<Salary>;
          final allowances = snapshot.data![1] as List<Allowance>;
          final insurances = snapshot.data![2] as List<EmployeeInsurance>;

          // Lấy thông tin lương của nhân viên
          final employeeSalary = salaries.firstWhere(
            (salary) => salary.id == employee.id,
            orElse: () => Salary(
              id: 0,
              salaryLevel: 'Không có dữ liệu',
              basicSalary: 0.0,
              baseCoefficient: 0.0,
              createdAt: '',
              updatedAt: '',
            ),
          );

          // Lấy thông tin trợ cấp
          final employeeAllowance = allowances.firstWhere(
            (allowance) => allowance.id == employee.id,
            orElse: () => Allowance(
              id: 0,
              allowanceTypeId: 0,
              amount: 0.0,
              isSeniorityBase: false,
              createdAt: '',
              updatedAt: '',
            ),
          );

          // Lấy thông tin bảo hiểm
          final employeeInsurance = insurances.firstWhere(
            (insurance) => insurance.employeeId == employee.id,
            orElse: () => EmployeeInsurance(
              employeeId: 0,
              insuranceId: 0,
              actualEmployeePct: 0.0,
              actualCompanyPct: 0.0,
              actualTotalPct: 0.0,
              note: null,
              createdAt: '',
              updatedAt: '',
            ),
          );

          // Tính tổng lương
          final totalSalary = employeeSalary.basicSalary + employeeAllowance.amount;

          return Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Lương cơ bản: ${employeeSalary.basicSalary.toStringAsFixed(2)} VNĐ',
                    style: TextStyle(fontSize: 16)),
                SizedBox(height: 8),
                Text('Hệ số: ${employeeSalary.baseCoefficient.toStringAsFixed(1)}',
                    style: TextStyle(fontSize: 16)),
                SizedBox(height: 8),
                Text('Trợ cấp: ${employeeAllowance.amount.toStringAsFixed(2)} VNĐ',
                    style: TextStyle(fontSize: 16)),
                SizedBox(height: 8),
                Text('Bảo hiểm (Nhân viên đóng): ${employeeInsurance.actualEmployeePct.toStringAsFixed(1)}%',
                    style: TextStyle(fontSize: 16)),
                SizedBox(height: 8),
                Text('Bảo hiểm (Công ty đóng): ${employeeInsurance.actualCompanyPct.toStringAsFixed(1)}%',
                    style: TextStyle(fontSize: 16)),
                SizedBox(height: 16),
                Text('Tổng lương: ${totalSalary.toStringAsFixed(2)} VNĐ',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ],
            ),
          );
        },
      ),
    );
  }
}