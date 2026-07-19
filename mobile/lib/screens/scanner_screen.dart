import 'package:flutter/material.dart';
import './check_in.dart';
import './check_out.dart';

class ScannerScreen extends StatelessWidget {
  const ScannerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // Main background color is white
        appBar: AppBar(
          title: const Text('Scan QR'),
          backgroundColor: Color.fromRGBO(13, 71, 161, 1),
          foregroundColor: Color.fromRGBO(224, 242, 247, 1),
          // You can add leading/actions here if needed, like a menu icon
        ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const CheckInScreen()),
                );
              },
              child: const Text('Check-in'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const CheckOutScreen()),
                );
              },
              child: const Text('Check-out'),
            ),
          ],
        ),
      ),
    );
  }
}
