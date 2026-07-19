import 'package:flutter/material.dart';
import '../models/employee.dart';
import '../services/hr_service.dart';

class EmployeeInfoScreen extends StatelessWidget {
  final HrService _hrService = HrService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Thông tin nhân viên')),
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
                subtitle: Text('Email: ${employee.email}\nĐịa chỉ: ${employee.address}'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => EmployeeDetailScreen(employee: employee),
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

class EmployeeDetailScreen extends StatelessWidget {
  final Employee employee;

  const EmployeeDetailScreen({required this.employee});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(employee.fullname)),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Họ và tên: ${employee.fullname}', style: TextStyle(fontSize: 18)),
            SizedBox(height: 8),
            Text('Ngày sinh: ${employee.dateOfBirth}', style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text('Giới tính: ${employee.gender}', style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text('Nơi sinh: ${employee.birthplace}', style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text('Dân tộc: ${employee.ethnicity}', style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text('Địa chỉ: ${employee.address}', style: TextStyle(fontSize: 16)),
            SizedBox(height: 8),
            Text('Email: ${employee.email}', style: TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }
}