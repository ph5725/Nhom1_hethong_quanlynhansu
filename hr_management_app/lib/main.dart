import 'package:flutter/material.dart';
import 'screens/employee_info_screen.dart';
import 'screens/leave_request_screen.dart';
import 'screens/payroll_screen.dart';
import 'screens/tasks_screen.dart';
import 'screens/work_schedule_screen.dart';
import 'screens/attendance_screen.dart';

void main() {
  runApp(MyApp());
}


class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ứng dụng quản lý nhân sự',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  final List<Widget> _screens = [
    EmployeeInfoScreen(),
    LeaveRequestScreen(),
    PayrollScreen(),
    TasksScreen(),
    WorkScheduleScreen(),
    AttendanceScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Thông tin'),
          BottomNavigationBarItem(icon: Icon(Icons.event), label: 'Nghỉ phép'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet), label: 'Lương'),
          BottomNavigationBarItem(icon: Icon(Icons.task), label: 'Công việc'),
          BottomNavigationBarItem(icon: Icon(Icons.schedule), label: 'Lịch làm'),
          BottomNavigationBarItem(icon: Icon(Icons.qr_code), label: 'Chấm công'),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        onTap: _onItemTapped,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}