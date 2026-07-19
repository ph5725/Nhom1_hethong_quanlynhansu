// lib/screens/personal_information_screen.dart

import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/models/employee_personal_info.dart'; // Đảm bảo import đúng đường dẫn model
import 'package:intl/intl.dart'; // Để định dạng ngày tháng

class PersonalInformationScreen extends StatefulWidget {
  const PersonalInformationScreen({super.key});

  @override
  State<PersonalInformationScreen> createState() =>
      _PersonalInformationScreenState();
}

class _PersonalInformationScreenState extends State<PersonalInformationScreen> {
  EmployeePersonalInfo? _employee;
  String? _error;
  bool _isLoading = true;
  String? _roleApi;

  final Dio _dio = Dio(); // Khởi tạo Dio

  @override
  void initState() {
    super.initState();
    _fetchRoleAndData();
  }

  // Hàm để lấy role từ SharedPreferences và sau đó tải dữ liệu
  Future<void> _fetchRoleAndData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? userRolesJson = prefs.getString('user_roles');
      if (userRolesJson != null) {
        final List<dynamic> storedRoles =
            json.decode(userRolesJson); // Cần import dart:convert
        if (storedRoles.isNotEmpty) {
          _roleApi = storedRoles[0] as String;
        }
      }

      if (_roleApi == null) {
        // Nếu không tìm thấy role, dùng default 'user'
        _roleApi = 'user';
        print(
            'Không tìm thấy vai trò người dùng, sử dụng vai trò mặc định: user');
      }
      await _fetchPersonalInformation(); // Sau khi có role, tải thông tin
    } catch (e) {
      setState(() {
        _error = 'Lỗi khi tải vai trò người dùng: $e';
        _isLoading = false;
        _roleApi = 'user'; // Đảm bảo có giá trị default
      });
      print('Lỗi fetchRoleAndData: $e');
      await _fetchPersonalInformation(); // Vẫn cố gắng tải với role mặc định
    }
  }

  // Hàm tải dữ liệu thông tin cá nhân
  Future<void> _fetchPersonalInformation() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) {
        setState(() {
          _error = 'Token xác thực không tìm thấy. Vui lòng đăng nhập lại.';
          _isLoading = false;
        });
        return;
      }

      final API_URL =
          'http://192.168.1.6:8000/api/per/personal-information'; // Sử dụng _roleApi
      final response = await _dio.get(
        API_URL,
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
          },
          // Thêm timeout nếu cần
          receiveTimeout: const Duration(milliseconds: 10000), // 10 giây
          sendTimeout: const Duration(milliseconds: 10000), // 10 giây
        ),
      );

      if (response.statusCode == 200 && response.data != null) {
        if (response.data['success']) {
          setState(() {
            _employee = EmployeePersonalInfo.fromJson(response.data['data']);
            _isLoading = false;
          });
          print('Thông tin nhân viên đã được tải thành công.');
        } else {
          setState(() {
            _error =
                response.data['message'] ?? 'Không thể tải thông tin cá nhân.';
            _isLoading = false;
          });
          print('Lỗi API: ${response.data['message']}');
        }
      } else {
        setState(() {
          _error =
              'Lỗi khi tải thông tin cá nhân. Mã trạng thái: ${response.statusCode}';
          _isLoading = false;
        });
        print(
            'Lỗi HTTP: Mã trạng thái ${response.statusCode}, Dữ liệu: ${response.data}');
      }
    } on DioException catch (e) {
      setState(() {
        _error = 'Lỗi kết nối: ${e.message}.';
        if (e.response != null) {
          _error = '\nMã lỗi: ${e.response!.statusCode}';
          if (e.response!.data != null) {
            _error = '\nChi tiết: ${e.response!.data.toString()}';
          }
        }
        _isLoading = false;
      });
      print('DioException: $_error');
    } catch (e) {
      setState(() {
        _error = 'Đã xảy ra lỗi không xác định: $e';
        _isLoading = false;
      });
      print('Lỗi không xác định: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(title: const Text('Thông tin cá nhân')),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_error != null) {
      return Scaffold(
        backgroundColor: Colors.white, // Main background color is white
        appBar: AppBar(
          title: const Text('Information'),
          backgroundColor: Color.fromRGBO(13, 71, 161, 1),
          foregroundColor: Color.fromRGBO(224, 242, 247, 1),
          // You can add leading/actions here if needed, like a menu icon
        ),
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.error_outline, color: Colors.red, size: 60),
                const SizedBox(height: 20),
                Text(
                  _error!,
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.red, fontSize: 16),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _fetchPersonalInformation, // Thử tải lại
                  child: const Text('Thử lại'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (_employee == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Thông tin cá nhân')),
        body: const Center(
          child: Text(
            'Không tìm thấy thông tin nhân viên.',
            style: TextStyle(fontSize: 18, color: Colors.grey),
          ),
        ),
      );
    }

    // Định dạng ngày tháng cho 'Last login' (ví dụ: lấy ngày hiện tại)
    // Thực tế bạn cần nhận 'last_login' từ API nếu nó có.
    final String lastLogin = DateFormat('EEEE, MMMM d, yyyy hh:mm a', 'vi_VN')
        .format(DateTime.now());

    return Scaffold(
      appBar: AppBar(
        title: const Text('Thông tin', style: TextStyle(color: Colors.white)),
        backgroundColor:
            const Color.fromRGBO(13, 71, 161, 1), // primaryDarkBlue
        iconTheme: const IconThemeData(color: Colors.white), // Màu icon drawer
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Information',
              style: TextStyle(
                color: Color.fromRGBO(13, 71, 161, 1), // brand-dark
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            // Container cho 2 card nằm ngang
            LayoutBuilder(
              builder: (context, constraints) {
                // Sử dụng Row nếu đủ rộng, nếu không thì dùng Column
                if (constraints.maxWidth > 600) {
                  // Ví dụ: màn hình rộng hơn 600px thì xếp ngang
                  return Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                          child: _buildPersonalInfoCard(_employee!, lastLogin)),
                      const SizedBox(width: 20),
                      Expanded(child: _buildWorkInfoCard(_employee!)),
                    ],
                  );
                } else {
                  return Column(
                    children: [
                      _buildPersonalInfoCard(_employee!, lastLogin),
                      const SizedBox(height: 20),
                      _buildWorkInfoCard(_employee!),
                    ],
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPersonalInfoCard(
      EmployeePersonalInfo employee, String lastLogin) {
    return Card(
      elevation: 5, // Thêm đổ bóng
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      margin: EdgeInsets.zero, // Loại bỏ margin mặc định của Card
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: CircleAvatar(
                radius: 75,
                backgroundImage: const NetworkImage(
                    'https://via.placeholder.com/150'), // Placeholder image
                backgroundColor: const Color.fromRGBO(
                    224, 242, 247, 1), // secondaryLightBlue
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Thông tin cá nhân',
              style: TextStyle(
                color: Color.fromRGBO(13, 71, 161, 1), // brand-dark
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Divider(),
            _buildInfoRow('Lần đăng nhập cuối:', lastLogin),
            _buildInfoRow('Họ và tên:', employee.fullname),
            _buildInfoRow('Ngày sinh:', employee.dateOfBirth ?? 'N/A'),
            _buildInfoRow('Giới tính:', employee.gender ?? 'N/A'),
            _buildInfoRow('Nơi sinh:', employee.birthplace ?? 'N/A'),
            _buildInfoRow('Dân tộc:', employee.ethnicity ?? 'N/A'),
            _buildInfoRow('Địa chỉ:', employee.address ?? 'N/A'),
            _buildInfoRow('Email:', employee.email ?? 'N/A'),
            const SizedBox(height: 20),
            Center(
              child: ElevatedButton(
                onPressed: () {
                  // Xử lý sự kiện cập nhật
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                        content:
                            Text('Chức năng cập nhật đang được phát triển!')),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor:
                      const Color.fromRGBO(13, 71, 161, 1), // btn-dark
                  foregroundColor: Colors.white,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: const Text('Cập nhật'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildWorkInfoCard(EmployeePersonalInfo employee) {
    return Card(
      elevation: 5,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      margin: EdgeInsets.zero,
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Thông tin công việc',
              style: TextStyle(
                color: Color.fromRGBO(13, 71, 161, 1), // brand-dark
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const Divider(),
            _buildInfoRow('Phòng ban:', employee.department?.name ?? 'N/A'),
            _buildInfoRow('Vị trí:', employee.position?.name ?? 'N/A'),
            _buildInfoRow(
                'Trình độ học vấn:', employee.educationLevel?.level ?? 'N/A'),
            _buildInfoRow('Tên đăng nhập:', employee.user?.name ?? 'N/A'),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: RichText(
        text: TextSpan(
          text: '$label ',
          style: const TextStyle(
            color: Colors.black87, // Màu chữ cho label
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
          children: [
            TextSpan(
              text: value,
              style: const TextStyle(
                color: Colors.black54, // Màu chữ cho value
                fontWeight: FontWeight.normal,
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
