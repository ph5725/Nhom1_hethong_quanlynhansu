import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class CheckInScreen extends StatefulWidget {
  const CheckInScreen({super.key});

  @override
  State<CheckInScreen> createState() => _CheckInScreenState();
}

class _CheckInScreenState extends State<CheckInScreen> {
  MobileScannerController cameraController = MobileScannerController(
    detectionSpeed: DetectionSpeed.normal,
    returnImage: false,
  );
  bool _isScanning = true;
  TorchState _torchState = TorchState.off;
  CameraFacing _cameraFacing = CameraFacing.back;

  final String apiBaseUrl = 'http://192.168.1.6:8000/api/per';

  @override
  void initState() {
    super.initState();
    _updateStates();
  }

  Future<void> _updateStates() async {
    setState(() {});
  }

  @override
  void dispose() {
    cameraController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan QR Check-in'),
        actions: [
          IconButton(
            color: Colors.white,
            icon: Icon(
              _torchState == TorchState.on ? Icons.flash_on : Icons.flash_off,
              color: _torchState == TorchState.on ? Colors.yellow : Colors.grey,
            ),
            onPressed: () async {
              await cameraController.toggleTorch();
              setState(() {
                _torchState = _torchState == TorchState.on ? TorchState.off : TorchState.on;
              });
            },
          ),
          IconButton(
            color: Colors.white,
            icon: Icon(
              _cameraFacing == CameraFacing.front ? Icons.camera_front : Icons.camera_rear,
            ),
            onPressed: () async {
              await cameraController.switchCamera();
              setState(() {
                _cameraFacing = _cameraFacing == CameraFacing.front ? CameraFacing.back : CameraFacing.front;
              });
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          MobileScanner(
            controller: cameraController,
            onDetect: (BarcodeCapture capture) {
              if (!_isScanning) return;

              final List<Barcode> barcodes = capture.barcodes;
              if (barcodes.isNotEmpty) {
                final String? rawCode = barcodes.first.rawValue;

                if (rawCode != null) {
                  setState(() {
                    _isScanning = false;
                  });
                  cameraController.stop();

                  _processQrData(rawCode);
                }
              }
            },
          ),
          Align(
            alignment: Alignment.center,
            child: Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.red, width: 2),
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<String?> _getAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<void> _recordAttendance(Map<String, dynamic> qrData) async {
    try {
      final token = await _getAuthToken();
      print('Token: $token');
      if (token == null) {
        throw Exception('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
      }

      final now = DateTime.now();
      final attendanceDate = "${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}";
      final checkInTime = "${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}";

      final Map<String, dynamic> attendanceData = {
        'employee_id': qrData['id'],
        'attendance_date': attendanceDate,
        'check_in': checkInTime,
        'status': 'present',
      };

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Dữ liệu chấm công: ${attendanceData.toString()}'),
          duration: const Duration(seconds: 5),
        ),
      );

      debugPrint('Dữ liệu gửi API: $attendanceData');

      final response = await http.post(
        Uri.parse('$apiBaseUrl/attendances'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(attendanceData),
      );
      debugPrint('Phản hồi API: ${response.statusCode} - ${response.body}');
      debugPrint('Dữ liệu gửi: $attendanceData');

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 201 || response.statusCode == 200) {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Chấm công thành công'),
              content: Text(responseData['message'] ?? 'Check-in thành công'),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    setState(() {
                      _isScanning = true;
                    });
                    cameraController.start();
                  },
                  child: const Text('Đóng và Tiếp tục quét'),
                ),
              ],
            );
          },
        );
      } else {
        throw Exception(responseData['message'] ?? 'Lỗi không xác định từ API (Status: ${response.statusCode})');
      }
    } catch (e) {
      debugPrint('Lỗi khi chấm công: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Lỗi khi chấm công: $e'),
          duration: const Duration(seconds: 3),
        ),
      );
      setState(() {
        _isScanning = true;
      });
      cameraController.start();
    }
  }

  void _processQrData(String qrCodeData) {
    print('Dữ liệu QR nhận được: $qrCodeData');

    if (qrCodeData.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Mã QR rỗng hoặc không hợp lệ'),
          duration: Duration(seconds: 3),
        ),
      );
      setState(() {
        _isScanning = true;
      });
      cameraController.start();
      return;
    }

    try {
      Map<String, dynamic> decodedData = jsonDecode(qrCodeData);

      if (decodedData is! Map<String, dynamic>) {
        throw Exception('Dữ liệu QR không phải định dạng JSON hợp lệ');
      }

      if (!decodedData.containsKey('id')) {
        throw Exception('Mã QR không chứa id');
      }

      String id = decodedData['id']?.toString() ?? 'Không có ID';
      String fullname = decodedData['fullname'] ?? 'Không có Tên';
      String generatedAt = decodedData['generated_at'] ?? 'Không có Thời gian';

      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (BuildContext context) {
          return AlertDialog(
            title: const Text('Thông tin từ Mã QR'),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('ID: $id'),
                Text('Họ và tên: $fullname'),
                Text('Thời gian tạo: $generatedAt'),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  setState(() {
                    _isScanning = true;
                  });
                  cameraController.start();
                },
                child: const Text('Hủy'),
              ),
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  _recordAttendance(decodedData);
                },
                child: const Text('Xác nhận check-in'),
              ),
            ],
          );
        },
      );
    } catch (e) {
      print('Lỗi giải mã QR: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Không thể giải mã mã QR: ${e.toString()}'),
          duration: const Duration(seconds: 3),
        ),
      );
      setState(() {
        _isScanning = true;
      });
      cameraController.start();
    }
  }
}