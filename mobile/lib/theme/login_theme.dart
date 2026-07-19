import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/theme/app_theme.dart'; // Đảm bảo đường dẫn này đúng với file app_theme.dart của bạn

class LoginTheme extends StatelessWidget {
  const LoginTheme({super.key});

@Deprecated('Use g instead. Will be removed in 4.0.0.')
  @override
  Widget build(BuildContext context) {
    // Tương ứng với .login-page trong CSS
    return Scaffold(
      body: Container(
        // min-height: 100vh -> BoxConstraints.expand() hoặc chiều cao của màn hình
        constraints:
            BoxConstraints.expand(height: MediaQuery.of(context).size.height),
        decoration: const BoxDecoration(
          // background: linear-gradient(#0d4a71, #E0F2F7)
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            // Sử dụng màu từ AppTheme của bạn
            colors: [AppTheme.brandDark, AppTheme.brandLight],
          ),
        ),
        child: Center(
          // justify-content: center, align-items: center
          child: SingleChildScrollView(
            // Đảm bảo cuộn được trên màn hình nhỏ
            padding: const EdgeInsets.all(20.0), // padding: 20px
            child: ConstrainedBox(
              constraints:
                  const BoxConstraints(maxWidth: 900), // max-width: 900px
              child: Container(
                // Tương ứng với .login-row (cho border-radius và overflow hidden)
                decoration: BoxDecoration(
                  borderRadius:
                      BorderRadius.circular(10.0), // border-radius: 10px
                ),
                clipBehavior: Clip.antiAlias, // overflow: hidden
                child: IntrinsicHeight(
                  // Giúp các phần tử trong Row lấy chiều cao của phần tử cao nhất
                  child: Row(
                    // display: flex
                    children: [
                      // Phần form đăng nhập
                      Expanded(
                        flex: 5, // Tỷ lệ chiều rộng, bạn có thể điều chỉnh
                        child: _LoginFormSection(),
                      ),
                      // Phần chào mừng
                      Expanded(
                        flex: 4, // Tỷ lệ chiều rộng, bạn có thể điều chỉnh
                        child: _WelcomeSection(),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// Widget riêng cho phần Form đăng nhập
class _LoginFormSection extends StatelessWidget {
  const _LoginFormSection({super.key});

  @Deprecated('Use g instead. Will be removed in 4.0.0.')
  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppTheme.brandDark, // background-color: var(--brand-dark)
      padding: const EdgeInsets.all(40.0), // padding: 40px
      // border-radius: 8px (cho top-left và bottom-left) được áp dụng ở Container cha (.login-row)
      child: Center(
        // Để căn giữa nội dung bên trong
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 350), // max-width: 350px
          child: Column(
            mainAxisSize: MainAxisSize
                .min, // Giúp Column chỉ chiếm đủ không gian cần thiết
            children: [
              // Tương ứng với .user-icon
              Container(
                width: 120,
                height: 120,
                decoration: const BoxDecoration(
                  color: AppTheme
                      .textPrimary, // Bạn có thể dùng màu khác cho nền icon, ví dụ trắng
                  shape: BoxShape.circle, // border-radius: 50%
                ),
                alignment: Alignment
                    .center, // justify-content: center, align-items: center
                margin:
                    const EdgeInsets.only(bottom: 20.0), // margin-bottom: 20px
                child: const Icon(
                  Icons.person, // Icon người dùng
                  size: 40, // font-size: 40px
                  color: AppTheme.brandDark, // Màu icon
                ),
              ),
              // Tương ứng với .login-form-section .title
              Text(
                'Chào Mừng!', // Tiêu đề
                style: Theme.of(context).textTheme.displaySmall?.copyWith(
                      // <--- THÊM .textTheme VÀO ĐÂY
                      // Sử dụng displaySmall từ AppTheme và ghi đè màu
                      color: const Color(0xFF0D4A71), // color: #0d4a71
                    ),
                textAlign: TextAlign.center, // text-align: center
              ),

              // Custom Input (textfield-wrapper)
              // Sử dụng hàm _buildTextFieldWithIcon để tái sử dụng
              _buildTextFieldWithIcon(
                context,
                icon: Icons.email,
                hintText: 'Email',
              ),
              const SizedBox(height: 15), // Khoảng cách giữa các textfield
              _buildTextFieldWithIcon(
                context,
                icon: Icons.lock,
                hintText: 'Mật khẩu',
                obscureText: true,
              ),

              // Tương ứng với .login-form-section .btn-light
              Align(
                alignment: Alignment.center, // Căn giữa nút
                child: Padding(
                  padding: const EdgeInsets.only(top: 20.0), // margin-top: 20px
                  child: ElevatedButton(
                    onPressed: () {
                      // Xử lý logic đăng nhập tại đây
                    },
                    style: Theme.of(context)
                        .elevatedButtonTheme
                        .style, // Áp dụng style từ AppTheme
                    child: const Text('Đăng Nhập'),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @Deprecated('Use g instead. Will be removed in 4.0.0.')
  // Hàm trợ giúp để xây dựng TextField tùy chỉnh giống .textfield-wrapper
  Widget _buildTextFieldWithIcon(
    BuildContext context, {
    required IconData icon,
    required String hintText,
    bool obscureText = false,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(
          horizontal: 12, vertical: 8), // padding: 8px 12px
      decoration: BoxDecoration(
        color: AppTheme.brandLight, // background-color: var(--brand-light)
        borderRadius: BorderRadius.circular(6), // border-radius: 6px
        border: Border.all(
            color: Colors.transparent,
            width: 2), // border: 2px solid transparent
      ),
      // Để mô phỏng :focus-within, cần StatefulWidget và FocusNode.
      // Với ví dụ đơn giản này, ta dựa vào InputDecorationTheme cho border khi focus của TextField.
      child: Row(
        children: [
          Icon(
            icon,
            size: 16, // font-size: 16px cho icon
            color: AppTheme.brandDark, // color: var(--brand-dark)
          ),
          const SizedBox(width: 8), // gap: 8px
          Expanded(
            child: TextField(
              obscureText: obscureText,
              style: GoogleFonts.newsreader(
                // font-family, font-size, color cho input
                fontSize: 16,
                color: AppTheme
                    .brandDark, // color: var(--brand-dark) cho text nhập vào
              ),
              decoration: InputDecoration(
                hintText: hintText,
                border: InputBorder
                    .none, // border: none (TextField mặc định không có border)
                isDense: true, // Làm cho TextField gọn hơn
                contentPadding:
                    EdgeInsets.zero, // Loại bỏ padding mặc định của TextField
                hintStyle: GoogleFonts.newsreader(
                  // color: var(--brand-dark) (cho .custom-input và .textfield-wrapper)
                  color: AppTheme.brandDark.withOpacity(0.6), // Màu chữ gợi ý
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Widget riêng cho phần chào mừng
class _WelcomeSection extends StatelessWidget {
  const _WelcomeSection({super.key});

  @Deprecated('Use g instead. Will be removed in 4.0.0.')
  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppTheme.brandLight, // background-color: var(--brand-light)
      padding: const EdgeInsets.all(40.0), // padding: 40px
      // border-radius: 8px (cho top-right và bottom-right) được áp dụng ở Container cha (.login-row)
      child: Center(
        // Để căn giữa nội dung bên trong
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 350), // max-width: 350px
          child: Column(
            mainAxisSize: MainAxisSize
                .min, // Giúp Column chỉ chiếm đủ không gian cần thiết
            mainAxisAlignment:
                MainAxisAlignment.center, // Căn giữa theo chiều dọc
            children: [
              // Tương ứng với .welcome-section .title
              Text(
                'Chào Mừng Trở Lại!', // Tiêu đề
                style: Theme.of(context).textTheme.displaySmall?.copyWith(
                      // <--- THÊM .textTheme VÀO ĐÂY
                      // Sử dụng displaySmall từ AppTheme và ghi đè màu
                      color: AppTheme.brandDark, // color: var(--brand-dark)
                    ),
                textAlign: TextAlign.center, // text-align: center
              ),
              const SizedBox(height: 10), // margin-bottom: 10px cho title
              Text(
                'Để giữ kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn.', // Nội dung
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppTheme.brandDark, // Màu chữ nội dung
                    ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 30), // Khoảng cách trước nút
              OutlinedButton(
                // Bạn có thể dùng OutlinedButton cho nút đăng ký/tạo tài khoản
                onPressed: () {
                  // Xử lý logic đăng ký tại đây
                },
                style: Theme.of(context).outlinedButtonTheme.style?.copyWith(
                      // Điều chỉnh màu sắc để phù hợp với phần welcome (nền sáng, chữ đậm)
                      foregroundColor: MaterialStateProperty.all(
                          AppTheme.brandDark), // Màu chữ nút
                      backgroundColor: MaterialStateProperty.all(
                          Colors.transparent), // Không có nền
                      side: MaterialStateProperty.all(const BorderSide(
                          color: AppTheme.brandDark)), // Viền nút
                    ),
                child: const Text('Đăng Ký'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
