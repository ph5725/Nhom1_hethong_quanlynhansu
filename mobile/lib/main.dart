import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'pages/login/login.dart';
import 'pages/dashboard/dashboard_widget.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart';

void main() async  {
  await initializeDateFormatting('vi_VN', null);
  DateFormat format = DateFormat.yMMMMd('vi_VN');
  runApp(
    ChangeNotifierProvider(
      create: (_) => AuthProvider(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Employee App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/login',
      routes: {
        '/login': (context) => const LoginPage(),
        '/dashboard': (context) => const DashboardWidget(),
        '/personal-information': (context) => const Scaffold(body: Center(child: Text('Personal Information'))),
        '/attendances': (context) => const Scaffold(body: Center(child: Text('Attendance'))),
        '/leaves': (context) => const Scaffold(body: Center(child: Text('Apply For Leave'))),
        '/payroll': (context) => const Scaffold(body: Center(child: Text('Payroll'))),
        '/schedules': (context) => const Scaffold(body: Center(child: Text('Schedule'))),
      },
    );
  }
}