import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';

class MyWorkScheduleScreen extends StatefulWidget {
  const MyWorkScheduleScreen({super.key});

  @override
  _MyWorkScheduleScreenState createState() => _MyWorkScheduleScreenState();
}

class _MyWorkScheduleScreenState extends State<MyWorkScheduleScreen> {
  Map<String, dynamic>? workSchedule;
  String error = '';
  int? employeeId;
  String? roleApi;

  @override
  void initState() {
    super.initState();
    fetchUserData();
    fetchRoleApi();
  }

  // Fetch user data to get employee_id
  Future<void> fetchUserData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final accessToken = prefs.getString('token');
      if (accessToken == null) {
        setState(() {
          error = 'Unauthenticated. Please log in.';
        });
        return;
      }

      const userUrl = 'http://192.168.1.6:8000/api/user';
      final response = await http.get(
        Uri.parse(userUrl),
        headers: {'Authorization': 'Bearer $accessToken'},
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success']) {
        setState(() {
          employeeId = data['data']['user']['employee']['id'];
        });
      } else {
        setState(() {
          error = 'Failed to retrieve user data';
        });
      }
    } catch (err) {
      setState(() {
        error = err.toString().contains('401')
            ? 'Unauthenticated. Please log in.'
            : 'Failed to fetch user data: $err';
      });
      print('Error fetching user data: $err');
    }
  }

  // Fetch roleApi from SharedPreferences
  Future<void> fetchRoleApi() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final storedRoles = prefs.getStringList('user_roles') ?? [];
      if (storedRoles.isEmpty) {
        throw Exception('No roles found.');
      }
      setState(() {
        roleApi = storedRoles[0]; // Select first role
      });
    } catch (err) {
      setState(() {
        error = 'Failed to load role. Using default role.';
        roleApi = 'user'; // Default role
      });
      print('Error fetching roles: $err');
    }
  }

  // Fetch work schedule
  Future<void> fetchWorkSchedule() async {
    if (employeeId == null || roleApi == null) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      final accessToken = prefs.getString('token');
      if (accessToken == null) {
        setState(() {
          error = 'Unauthenticated. Please log in.';
        });
        return;
      }

      final workScheduleUrl =
          'http://192.168.1.6:8000/api/$roleApi/my-schedule/show/$employeeId';
      final response = await http.get(
        Uri.parse(workScheduleUrl),
        headers: {'Authorization': 'Bearer $accessToken'},
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success']) {
        setState(() {
          workSchedule = data['data'];
        });
      } else {
        setState(() {
          error = 'Failed to retrieve work schedule';
        });
      }
    } catch (err) {
      setState(() {
        error = err.toString().contains('401')
            ? 'Unauthenticated. Please log in.'
            : 'Failed to fetch work schedule: $err';
      });
      print('Error fetching work schedule: $err');
    }
  }

  @override
  void didUpdateWidget(covariant MyWorkScheduleScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (employeeId != null && roleApi != null) {
      fetchWorkSchedule();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Work Schedule'),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40.0, vertical: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'My Work Schedule',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            if (error.isNotEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(8.0),
                decoration: BoxDecoration(
                  color: Colors.red[100],
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  error,
                  style: const TextStyle(color: Colors.red, fontSize: 16),
                ),
              ),
            const SizedBox(height: 16),
            Expanded(
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: DataTable(
                  columns: const [
                    DataColumn(label: Text('No.')),
                    DataColumn(label: Text('Work Date')),
                    DataColumn(label: Text('Shift')),
                    DataColumn(label: Text('Status')),
                    DataColumn(label: Text('Is Day Off')),
                  ],
                  rows: workSchedule != null
                      ? [
                          DataRow(cells: [
                            const DataCell(Text('1')),
                            DataCell(Text(
                              workSchedule!['work_date'] != null
                                  ? DateFormat('MM/dd/yyyy').format(
                                      DateTime.parse(workSchedule!['work_date']))
                                  : 'N/A',
                            )),
                            DataCell(Text(
                                workSchedule!['work_shift']?['shift_name'] ??
                                    'N/A')),
                            DataCell(Text(
                                workSchedule!['work_date_status']?['name'] ??
                                    'N/A')),
                            DataCell(
                                Text(workSchedule!['is_day_off'] ? 'Yes' : 'No')),
                          ]),
                        ]
                      : [
                          DataRow(cells: [
                            DataCell(
                              Container(
                                width: 400,
                                child: const Center(
                                  child: Text('No work schedule data available.'),
                                ),
                              ),
                            ),
                            const DataCell(Text('')),
                            const DataCell(Text('')),
                            const DataCell(Text('')),
                            const DataCell(Text('')),
                          ]),
                        ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}