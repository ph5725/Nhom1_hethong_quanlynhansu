import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:qr_code_scanner_plus/qr_code_scanner_plus.dart';
import '../services/hr_service.dart';

class AttendanceScreen extends StatefulWidget {
  final bool isTesting;

  const AttendanceScreen({this.isTesting = false});

  @override
  _AttendanceScreenState createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  final GlobalKey qrKey = GlobalKey(debugLabel: 'QR');
  Barcode? result;
  QRViewController? controller;
  final HrService _hrService = HrService();

  @override
  void dispose() {
    if (!kIsWeb && !widget.isTesting) {
      controller?.dispose();
    }
    super.dispose();
  }

  void _onQRViewCreated(QRViewController controller) {
    this.controller = controller;
    controller.scannedDataStream.listen((scanData) async {
      setState(() {
        result = scanData;
      });
      bool success = await _hrService.recordAttendance(scanData.code ?? '');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(success ? 'Chấm công thành công' : 'Chấm công thất bại')),
      );
      controller.pauseCamera();
    });
  }

  @override
  Widget build(BuildContext context) {
    if (kIsWeb || widget.isTesting) {
      return Scaffold(
        appBar: AppBar(title: Text('Chấm công QR')),
        body: Center(
          child: Text(
            'Tính năng quét mã QR không được hỗ trợ trong môi trường này.\nVui lòng sử dụng ứng dụng trên thiết bị di động.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16),
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: Text('Chấm công QR')),
      body: Column(
        children: [
          Expanded(
            flex: 5,
            child: QRView(
              key: qrKey,
              onQRViewCreated: _onQRViewCreated,
              overlay: QrScannerOverlayShape(
                borderColor: Colors.blue,
                borderRadius: 10,
                borderLength: 30,
                borderWidth: 10,
                cutOutSize: 300,
              ),
            ),
          ),
          Expanded(
            flex: 1,
            child: Center(
              child: (result != null)
                  ? Text('Mã QR: ${result!.code}')
                  : Text('Quét mã QR để chấm công'),
            ),
          ),
        ],
      ),
    );
  }
}