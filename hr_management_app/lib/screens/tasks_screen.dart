import 'package:flutter/material.dart';
import '../models/employee.dart';
import '../models/task.dart';
import '../services/hr_service.dart';

class TasksScreen extends StatelessWidget {
  final HrService _hrService = HrService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Danh sách công việc')),
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
                      builder: (context) => TaskDetailScreen(employee: employee),
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

class TaskDetailScreen extends StatelessWidget {
  final Employee employee;
  final HrService _hrService = HrService();

  TaskDetailScreen({required this.employee});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Công việc của ${employee.fullname}')),
      body: FutureBuilder<List<Task>>(
        future: _hrService.getTasks(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Lỗi: ${snapshot.error}'));
          }
          final tasks = snapshot.data ?? [];
          final employeeTasks = tasks.where((task) => task.assignedToId == employee.id).toList();
          return ListView.builder(
            itemCount: employeeTasks.length,
            itemBuilder: (context, index) {
              final task = employeeTasks[index];
              return ListTile(
                title: Text(task.title),
                subtitle: Text('Hạn hoàn thành: ${task.dueDate}\nTrạng thái: ${task.status}'),
              );
            },
          );
        },
      ),
    );
  }
}