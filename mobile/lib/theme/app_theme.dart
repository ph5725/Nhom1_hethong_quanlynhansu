// lib/app_theme.dart

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

@Deprecated('Use g instead. Will be removed in 4.0.0.')
class AppTheme {
  // Define your color palette
  static const Color brandLight = Color(0xFFE0F2F7);
  static const Color brandDark = Color(0xFF0D47A1);
  static const Color success = Color(0xFF4CAF50);
  static const Color hint = Color(0xFFFFECB3);
  static const Color error = Color(0xFFFF6E71);
  static const Color textPrimary =
      Color(0xFFFFFFFF); // Text on dark backgrounds (your current white)
  static const Color textSecondary = Color(0xFFCCCCCC);
  static const Color backgroundDark = Color(0xFF1A1A1A);

  // >> THÊM CÁC MÀU MỚI TỪ CSS CỦA BẠN <<
  static const Color backgroundLight =
      Color(0xFFFFFFFF); // Màu nền trắng cho container chính, form-card, input
  static const Color defaultInputText =
      Color(0xFF495057); // Màu chữ mặc định cho input
  static const Color defaultInputBorder =
      Color(0xFFCED4DA); // Màu viền input mặc định
  static const Color defaultPlaceholder =
      Color(0xFF6C757D); // Màu placeholder, icon calendar, nút cancel
  static const Color focusBorderColor = Color(0xFF80BDFF); // Màu viền khi focus
  static const Color focusShadowColor =
      Color.fromRGBO(0, 123, 255, 0.25); // Màu box shadow khi focus
  static const Color btnCancelHoverBg =
      Color(0xFF5A6268); // Màu nền nút cancel khi hover
  static const Color btnCancelHoverBorder =
      Color(0xFF545B62); // Màu viền nút cancel khi hover
  static const Color btnSaveHoverBg =
      Color(0xFF0056B3); // Màu nền nút save khi hover
  static const Color defaultCardBorder =
      Color(0xFFDEE2E6); // Màu viền cho form-card

  // >> THÊM CÁC MÀU MỚI TỪ CSS CỦA BẠN CHO BẢNG <<
  static const Color tableBorderColor =
      Color(0xFFDEE2E6); // Màu viền bảng và các hàng
  static const Color tableContentTextColor =
      Color(0xFF343A40); // Màu chữ cho nội dung bảng
  static const Color tableHoverColor =
      Color(0xFFF0F0F0); // Màu nền hàng khi hover
  static const Color tableIconHoverColor =
      Color(0xFF007BFF); // Màu icon khi hover

  static ThemeData get lightTheme {
    return ThemeData(
      scaffoldBackgroundColor:
          backgroundDark, // Vẫn giữ nền tối nếu app của bạn tổng thể tối
      useMaterial3: true,

      textTheme: TextTheme(
        displaySmall: GoogleFonts.gelasio(
          // Không còn là named parameter trong constructor TextTheme
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: brandDark,
        ),
        headlineSmall: GoogleFonts.gelasio(
          // Không còn là named parameter
          fontSize: 20,
          fontWeight: FontWeight.normal,
          color: textPrimary,
        ),
        titleMedium: GoogleFonts.gelasio(
          // Không còn là named parameter
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: textPrimary,
        ),
        labelMedium: GoogleFonts.newsreader(
          // Không còn là named parameter
          fontSize: 14,
          fontWeight: FontWeight.normal,
          color: textSecondary,
        ),
        // ... các TextStyle khác
      ),

      // >> CẬP NHẬT INPUT DECORATION THEME <<
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: backgroundLight, // Nền trắng cho input fields
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(
              color: defaultInputBorder, width: 1), // Viền mặc định
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(color: defaultInputBorder, width: 1),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(
              color: focusBorderColor, width: 2), // Viền khi focus
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(color: error, width: 2),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(color: error, width: 2),
        ),
        hintStyle: GoogleFonts.newsreader(
          fontSize: 16,
          color: defaultPlaceholder, // Màu placeholder
        ),
        // Style cho text nhập vào trong TextField
        // Bạn có thể dùng `AppTheme.lightTheme.textTheme.bodyLarge` để lấy style này.
        // Đây chỉ là style cho label/helper text, không phải style của input text trực tiếp.
      ),

      // >> THÊM CARD THEME CHO .form-card <<
      cardTheme: CardThemeData(
        color: backgroundLight, // Màu nền trắng
        margin: EdgeInsets
            .zero, // Để kiểm soát margin bằng Padding/SizedBox bên ngoài
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8), // border-radius: 8px
          side: const BorderSide(
              color: defaultCardBorder, width: 1), // border: 1px solid #dee2e6
        ),
        elevation:
            2, // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) -> elevation 2 khá giống
        shadowColor: Colors.black.withOpacity(0.1),
      ),

      // Giữ nguyên các định nghĩa ButtonTheme đã có (elevatedButtonTheme, outlinedButtonTheme)
      // vì chúng là các theme mặc định cho nút của bạn.
      // Các nút .btn-cancel, .btn-save, .btn-add sẽ được định nghĩa riêng nếu chúng không theo theme chung.
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(4),
          ),
          textStyle: GoogleFonts.newsreader(
            fontSize: 14,
            fontWeight: FontWeight.normal,
          ),
          // Các màu mặc định này có thể bị override bởi các ButtonStyle riêng
          foregroundColor: brandDark,
          backgroundColor: brandLight,
          side: const BorderSide(color: brandDark, width: 1),
        ).copyWith(
          backgroundColor: MaterialStateProperty.resolveWith<Color?>(
            (Set<MaterialState> states) {
              if (states.contains(MaterialState.hovered) ||
                  states.contains(MaterialState.pressed)) {
                return brandDark;
              }
              return brandLight;
            },
          ),
          foregroundColor: MaterialStateProperty.resolveWith<Color?>(
            (Set<MaterialState> states) {
              if (states.contains(MaterialState.hovered) ||
                  states.contains(MaterialState.pressed)) {
                return brandLight;
              }
              return brandDark;
            },
          ),
          side: MaterialStateProperty.resolveWith<BorderSide?>(
            (Set<MaterialState> states) {
              if (states.contains(MaterialState.hovered) ||
                  states.contains(MaterialState.pressed)) {
                return const BorderSide(color: brandLight, width: 1);
              }
              return const BorderSide(color: brandDark, width: 1);
            },
          ),
        ),
      ),

      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(4),
          ),
          textStyle: GoogleFonts.newsreader(
            fontSize: 14,
            fontWeight: FontWeight.normal,
          ),
          foregroundColor: textPrimary,
          backgroundColor: brandDark,
          side: const BorderSide(color: brandLight, width: 1),
        ).copyWith(
          backgroundColor: MaterialStateProperty.resolveWith<Color?>(
            (Set<MaterialState> states) {
              if (states.contains(MaterialState.hovered) ||
                  states.contains(MaterialState.pressed)) {
                return brandLight;
              }
              return brandDark;
            },
          ),
          foregroundColor: MaterialStateProperty.resolveWith<Color?>(
            (Set<MaterialState> states) {
              if (states.contains(MaterialState.hovered) ||
                  states.contains(MaterialState.pressed)) {
                return brandDark;
              }
              return textPrimary;
            },
          ),
          side: MaterialStateProperty.resolveWith<BorderSide?>(
            (Set<MaterialState> states) {
              if (states.contains(MaterialState.hovered) ||
                  states.contains(MaterialState.pressed)) {
                return const BorderSide(color: brandDark, width: 1);
              }
              return const BorderSide(color: brandLight, width: 1);
            },
          ),
        ),
      ),
    );
  }

  // >> ĐỊNH NGHĨA CÁC BUTTON STYLE RIÊNG BIỆT CHO PAYROLL <<
  // Bạn sẽ sử dụng các style này trực tiếp khi tạo ElevatedButton hoặc TextButton
  // thay vì chỉ dựa vào elevatedButtonTheme/outlinedButtonTheme mặc định.

  static ButtonStyle get btnCancelStyle {
    return ElevatedButton.styleFrom(
      backgroundColor: defaultPlaceholder, // Màu xám #6c757d
      foregroundColor: textPrimary, // Màu chữ trắng
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
      textStyle:
          GoogleFonts.newsreader(fontSize: 14, fontWeight: FontWeight.normal),
      side: const BorderSide(
          color: defaultPlaceholder, width: 1), // Viền trùng màu nền
    ).copyWith(
      backgroundColor: MaterialStateProperty.resolveWith<Color?>(
        (Set<MaterialState> states) {
          if (states.contains(MaterialState.hovered) ||
              states.contains(MaterialState.pressed)) {
            return btnCancelHoverBg; // Màu hover #5a6268
          }
          return defaultPlaceholder;
        },
      ),
      side: MaterialStateProperty.resolveWith<BorderSide?>(
        (Set<MaterialState> states) {
          if (states.contains(MaterialState.hovered) ||
              states.contains(MaterialState.pressed)) {
            return const BorderSide(
                color: btnCancelHoverBorder, width: 1); // Viền hover #545b62
          }
          return const BorderSide(color: defaultPlaceholder, width: 1);
        },
      ),
    );
  }

  static ButtonStyle get btnSaveStyle {
    return ElevatedButton.styleFrom(
      backgroundColor: brandDark, // Màu xanh đậm
      foregroundColor: textPrimary, // Màu chữ trắng
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
      textStyle:
          GoogleFonts.newsreader(fontSize: 14, fontWeight: FontWeight.normal),
      side: const BorderSide(color: brandDark, width: 1), // Viền trùng màu nền
    ).copyWith(
      backgroundColor: MaterialStateProperty.resolveWith<Color?>(
        (Set<MaterialState> states) {
          if (states.contains(MaterialState.hovered) ||
              states.contains(MaterialState.pressed)) {
            return btnSaveHoverBg; // Màu hover #0056b3
          }
          return brandDark;
        },
      ),
      side: MaterialStateProperty.resolveWith<BorderSide?>(
        (Set<MaterialState> states) {
          if (states.contains(MaterialState.hovered) ||
              states.contains(MaterialState.pressed)) {
            return const BorderSide(
                color: btnSaveHoverBg, width: 1); // Viền hover
          }
          return const BorderSide(color: brandDark, width: 1);
        },
      ),
    );
  }

  static ButtonStyle get btnAddStyle {
    return ElevatedButton.styleFrom(
      backgroundColor: brandDark, // Màu xanh đậm
      foregroundColor: textPrimary, // Màu chữ trắng
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
      textStyle:
          GoogleFonts.newsreader(fontSize: 14, fontWeight: FontWeight.normal),
      side:
          const BorderSide(color: brandLight, width: 1), // Viền màu brandLight
    ).copyWith(
      backgroundColor: MaterialStateProperty.resolveWith<Color?>(
        (Set<MaterialState> states) {
          if (states.contains(MaterialState.hovered) ||
              states.contains(MaterialState.pressed)) {
            return brandLight; // Màu nền khi hover là brandLight
          }
          return brandDark;
        },
      ),
      foregroundColor: MaterialStateProperty.resolveWith<Color?>(
        (Set<MaterialState> states) {
          if (states.contains(MaterialState.hovered) ||
              states.contains(MaterialState.pressed)) {
            return brandDark; // Màu chữ khi hover là brandDark
          }
          return textPrimary;
        },
      ),
      side: MaterialStateProperty.resolveWith<BorderSide?>(
        (Set<MaterialState> states) {
          if (states.contains(MaterialState.hovered) ||
              states.contains(MaterialState.pressed)) {
            return const BorderSide(
                color: brandDark, width: 1); // Viền khi hover là brandDark
          }
          return const BorderSide(color: brandLight, width: 1);
        },
      ),
    );
  }
}
