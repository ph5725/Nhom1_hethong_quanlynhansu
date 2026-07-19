import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/pages/login/login.dart';
import 'package:mobile/screens/scanner_screen.dart';
import 'package:mobile/pages/attendance/attendance_widget.dart';
import 'package:mobile/pages/personal_information/information_widget.dart';
import 'package:mobile/pages/schedule/schedule_widget.dart'; // Import MyWorkScheduleScreen
import 'package:mobile/pages/payroll/payroll_widget.dart'; // Import EmployeePayrollDetailScreen

class Sidebar extends StatefulWidget {
  const Sidebar({super.key});

  @override
  _SidebarState createState() => _SidebarState();
}

class _SidebarState extends State<Sidebar> {
  static const Color primaryDarkBlue = Color.fromRGBO(13, 71, 161, 1);
  static const Color secondaryLightBlue = Color.fromRGBO(224, 242, 247, 1);

  String? _userName;
  String? _userEmail;
  bool _isLoadingUser = true;
  String _userErrorMessage = '';

  final Dio _dio = Dio();

  @override
  void initState() {
    super.initState();
    _fetchUserData();
  }

  Future<void> _fetchUserData() async {
    setState(() {
      _isLoadingUser = true;
      _userErrorMessage = '';
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) {
        setState(() {
          _userErrorMessage = 'Token not found. Please log in again.';
          _isLoadingUser = false;
        });
        return;
      }

      final response = await _dio.get(
        'http://192.168.1.6:8000/api/user',
        options: Options(
          headers: {'Authorization': 'Bearer $token'},
          receiveTimeout: const Duration(milliseconds: 5000),
          sendTimeout: const Duration(milliseconds: 5000),
        ),
      );

      if (response.statusCode == 200 &&
          response.data != null &&
          response.data['data'] != null) {
        final userData = response.data['data']['user'];
        setState(() {
          _userName = userData['name'] as String?;
          _userEmail = userData['email'] as String?;
          _isLoadingUser = false;
        });
        print('User data fetched: Name - $_userName, Email - $_userEmail');
      } else {
        setState(() {
          _userErrorMessage =
              'Failed to load user data. Status: ${response.statusCode}';
          _isLoadingUser = false;
        });
        print('Failed to load user data: Status ${response.statusCode}');
      }
    } on DioException catch (e) {
      setState(() {
        _userErrorMessage =
            'Connection error fetching user data: ${e.message}.';
        if (e.response != null) {
          _userErrorMessage += '\nError Code: ${e.response!.statusCode}';
          if (e.response!.data != null) {
            _userErrorMessage += '\nDetails: ${e.response!.data.toString()}';
          }
        }
        _isLoadingUser = false;
      });
      print('DioException fetching user data: $_userErrorMessage');
    } catch (e) {
      setState(() {
        _userErrorMessage = 'Unknown error fetching user data: $e';
        _isLoadingUser = false;
      });
      print('Unknown error fetching user data: $e');
    }
  }

  Future<void> _handleLogout() async {
    Navigator.pop(context);

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token != null) {
        await _dio.post(
          'http://192.168.1.6:8000/api/logout',
          options: Options(
            headers: {'Authorization': 'Bearer $token'},
            receiveTimeout: const Duration(milliseconds: 5000),
            sendTimeout: const Duration(milliseconds: 5000),
          ),
        );
        print('Logout API called successfully.');
      }

      await prefs.remove('token');

      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Đăng xuất thành công!')),
        );
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
          (Route<dynamic> route) => false,
        );
      }
    } on DioException catch (e) {
      print('Logout API error: ${e.message}');
      String errorMessage = 'Đăng xuất thất bại: ${e.message}.';
      if (e.response != null) {
        errorMessage += '\nMã lỗi: ${e.response!.statusCode}';
        if (e.response!.data != null) {
          errorMessage += '\nChi tiết: ${e.response!.data.toString()}';
        }
      }
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(errorMessage)),
        );
        await (await SharedPreferences.getInstance()).remove('token');
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
          (Route<dynamic> route) => false,
        );
      }
    } catch (e) {
      print('Unknown logout error: $e');
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text(
                  'Đã xảy ra lỗi không mong muốn trong quá trình đăng xuất: $e')),
        );
        await (await SharedPreferences.getInstance()).remove('token');
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const LoginPage()),
          (Route<dynamic> route) => false,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> menuItems = [
      {'name': 'Dashboard', 'link': '/dashboard', 'icon': Icons.home},
      {
        'name': 'Personal Information',
        'link': '/personal-information',
        'icon': Icons.person
      },
      {
        'name': 'Attendance',
        'link': '/attendance_records',
        'icon': Icons.calendar_today
      },
      // {
      //   'name': 'Apply For Leave',
      //   'link': '/leaves',
      //   'icon': Icons.edit_document
      // },
      {'name': 'My Payroll', 'link': '/payroll', 'icon': Icons.receipt_long},
      {'name': 'My Schedule', 'link': '/schedules', 'icon': Icons.schedule},
      {
        'name': 'Attendance (Scanner)',
        'link': '/scanner',
        'icon': Icons.qr_code_scanner
      },
      {'name': 'Logout', 'link': '/logout', 'icon': Icons.logout},
    ];

    return Drawer(
      child: Container(
        decoration: const BoxDecoration(
          color: primaryDarkBlue,
        ),
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            Container(
              height: 200,
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                color: primaryDarkBlue,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  CircleAvatar(
                    radius: 35,
                    backgroundColor: secondaryLightBlue,
                    backgroundImage: const NetworkImage(
                        'https://placehold.co/100x100/E0F2F7/0D47A1?text=DP'),
                  ),
                  const SizedBox(height: 10),
                  _isLoadingUser
                      ? const CircularProgressIndicator(
                          color: secondaryLightBlue)
                      : _userErrorMessage.isNotEmpty
                          ? Text(
                              _userErrorMessage,
                              style: TextStyle(
                                  fontSize: 16, color: Colors.red.shade200),
                            )
                          : Text(
                              _userName ?? 'User Name',
                              style: const TextStyle(
                                fontFamily: 'Consolas',
                                fontWeight: FontWeight.w800,
                                fontSize: 22,
                                color: secondaryLightBlue,
                              ),
                            ),
                  _isLoadingUser
                      ? const SizedBox.shrink()
                      : _userErrorMessage.isNotEmpty
                          ? const SizedBox.shrink()
                          : Text(
                              _userEmail ?? 'user@example.com',
                              style: TextStyle(
                                fontSize: 14,
                                color: secondaryLightBlue.withOpacity(0.8),
                              ),
                            ),
                ],
              ),
            ),
            ...menuItems.map((item) {
              return ListTile(
                leading: Icon(
                  item['icon'] as IconData,
                  color: secondaryLightBlue,
                ),
                title: Text(
                  item['name'] as String,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: secondaryLightBlue,
                  ),
                ),
                onTap: () {
                  Navigator.pop(context);

                  if (item['link'] == '/logout') {
                    _handleLogout();
                  } else if (item['link'] == '/scanner') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const ScannerScreen()),
                    );
                  } else if (item['link'] == '/attendance_records') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => AttendanceShowScreen()),
                    );
                  } else if (item['link'] == '/personal-information') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => PersonalInformationScreen()),
                    );
                  } else if (item['link'] == '/schedules') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => MyWorkScheduleScreen()),
                    );
                  } else if (item['link'] == '/payroll') {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => EmployeePayrollDetailScreen()),
                    );
                  } else if (item['link'] != null) {
                    Navigator.pushNamed(context, item['link'] as String);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                          content: Text('${item['name']} not yet implemented')),
                    );
                  }
                },
              );
            }).toList(),
          ],
        ),
      ),
    );
  }
}
