import 'package:flutter/material.dart';
import '../models/employee.dart';
import '../models/work_schedule.dart';
import '../services/hr_service.dart';

class WorkScheduleScreen extends StatelessWidget {
  final HrService _hrService = HrService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Lịch làm việc')),
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
                      builder: (context) => WorkScheduleDetailScreen(employee: employee),
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

class WorkScheduleDetailScreen extends StatelessWidget {
  final Employee employee;
  final HrService _hrService = HrService();

  WorkScheduleDetailScreen({required this.employee});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Lịch làm việc - ${employee.fullname}')),
      body: FutureBuilder<List<WorkSchedule>>(
        future: _hrService.getWorkSchedules(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Lỗi: ${snapshot.error}'));
          }
          final schedules = snapshot.data ?? [];
          final employeeSchedules = schedules.where((schedule) => schedule.employeeId == employee.id).toList();
          return ListView.builder(
            itemCount: employeeSchedules.length,
            itemBuilder: (context, index) {
              final schedule = employeeSchedules[index];
              return ListTile(
                title: Text('Ngày làm: ${schedule.workDate}'),
                subtitle: Text(
                  'Ca làm: ${schedule.shiftId}\n'
                  'Trạng thái: ${schedule.isDayOff ? "Nghỉ" : "Làm việc"}',
                ),
              );
            },
          );
        },
      ),
    );
  }
}