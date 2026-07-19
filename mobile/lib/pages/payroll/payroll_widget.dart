import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';

class EmployeePayrollDetailScreen extends StatefulWidget {
  const EmployeePayrollDetailScreen({super.key});

  @override
  _EmployeePayrollDetailScreenState createState() =>
      _EmployeePayrollDetailScreenState();
}

class _EmployeePayrollDetailScreenState
    extends State<EmployeePayrollDetailScreen> {
  Map<String, dynamic>? payroll;
  String error = '';
  int? employeeId;

  @override
  void initState() {
    super.initState();
    fetchUserData();
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
          // Optionally save user data to SharedPreferences
          prefs.setString('user', jsonEncode(data['data']['user']));
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

  // Fetch payroll details
  Future<void> fetchPayroll() async {
    if (employeeId == null) return;

    try {
      final prefs = await SharedPreferences.getInstance();
      final accessToken = prefs.getString('token');
      if (accessToken == null) {
        setState(() {
          error = 'Unauthenticated. Please log in.';
        });
        return;
      }

      const payrollUrl = 'http://192.168.1.6:8000/api/per/my-payroll';
      final response = await http.get(
        Uri.parse(payrollUrl),
        headers: {'Authorization': 'Bearer $accessToken'},
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        setState(() {
          payroll = data;
        });
      } else if (response.statusCode == 401) {
        setState(() {
          error = 'Unauthenticated. Please log in.';
        });
      } else if (response.statusCode == 404) {
        setState(() {
          error = 'No active contract or employee record found.';
        });
      } else {
        setState(() {
          error = data['error'] ?? 'Failed to fetch payroll details';
        });
      }
    } catch (err) {
      setState(() {
        error = err.toString().contains('401')
            ? 'Unauthenticated. Please log in.'
            : 'Failed to fetch payroll details: $err';
      });
      print('Error fetching payroll details: $err');
    }
  }

  @override
  void didUpdateWidget(covariant EmployeePayrollDetailScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (employeeId != null) {
      fetchPayroll();
    }
  }

  // Format currency to USD
  String formatCurrency(double? value) {
    return NumberFormat.currency(locale: 'en_US', symbol: '\$')
        .format(value ?? 0);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Payroll Details'),
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 40.0, vertical: 24.0),
        child: payroll == null
            ? Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'My Payroll Details',
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
                  if (error.isEmpty)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(8.0),
                      decoration: BoxDecoration(
                        color: Colors.blue[100],
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        'Loading...',
                        style: TextStyle(color: Colors.blue, fontSize: 16),
                      ),
                    ),
                ],
              )
            : SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'My Payroll Details for ${payroll!['employee_name'] ?? 'N/A'}',
                      style: const TextStyle(
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
                          style:
                              const TextStyle(color: Colors.red, fontSize: 16),
                        ),
                      ),
                    const SizedBox(height: 16),
                    const Text(
                      'Basic Pay',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Card(
                      elevation: 2,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Basic Pay',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              formatCurrency(payroll!['basic_pay']?.toDouble()),
                              style: const TextStyle(fontSize: 16),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Allowances',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Card(
                      elevation: 2,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Total Allowance',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              formatCurrency(
                                  payroll!['total_allowance']?.toDouble()),
                              style: const TextStyle(fontSize: 16),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Insurance & Net Salary',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Card(
                            elevation: 2,
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Insurance Cost',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    formatCurrency(
                                        payroll!['insurance_cost']?.toDouble()),
                                    style: const TextStyle(fontSize: 16),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Card(
                            elevation: 2,
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Net Salary',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    formatCurrency(
                                        payroll!['net_salary']?.toDouble()),
                                    style: const TextStyle(fontSize: 16),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
      ),
    );
  }
}
