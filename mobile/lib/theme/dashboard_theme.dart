import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart'; // Import AppTheme của bạn

class DashboardTheme extends StatelessWidget {
  const DashboardTheme({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        constraints:
            BoxConstraints.expand(height: MediaQuery.of(context).size.height),
        color: AppTheme.backgroundDark, // Ví dụ: đặt màu nền cho dashboard
        child: Column(
          children: [
            AppBar(
              title: Text('Dashboard',
                  // SỬA LỖI Ở ĐÂY: Thêm .textTheme
                  style: Theme.of(context)
                      .textTheme
                      .displaySmall
                      ?.copyWith(color: AppTheme.textPrimary)),
              backgroundColor: AppTheme.brandDark,
            ),
            Expanded(
              child: Container(
                padding: const EdgeInsets.all(20.0),
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Chào mừng đến với Dashboard!',
                        // SỬA LỖI Ở ĐÂY: Thêm .textTheme
                        style: Theme.of(context)
                            .textTheme
                            .headlineSmall
                            ?.copyWith(color: AppTheme.textPrimary),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'Đây là nội dung chính của bảng điều khiển. Bạn có thể thêm các widget khác như biểu đồ, danh sách, v.v. tại đây.',
                        style: Theme.of(context)
                            .textTheme
                            .bodyMedium
                            ?.copyWith(color: AppTheme.textPrimary),
                      ),
                      for (int i = 0; i < 50; i++)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4.0),
                          child: Text(
                            'Dòng nội dung thứ ${i + 1} để kiểm tra cuộn.',
                            style: Theme.of(context)
                                .textTheme
                                .bodyMedium
                                ?.copyWith(color: AppTheme.textSecondary),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
