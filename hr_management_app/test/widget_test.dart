
import 'package:flutter_test/flutter_test.dart';
import 'package:hr_management_app/main.dart';

void main() {
  testWidgets('MainScreen displays EmployeeInfoScreen with correct title', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget( MyApp());

    // Wait for any async operations (e.g., FutureBuilder) to complete.
    await tester.pumpAndSettle();

    // Verify that the AppBar title in EmployeeInfoScreen is displayed.
    expect(find.text('Thông tin nhân viên'), findsOneWidget);

    // Verify that the BottomNavigationBar is displayed with the correct labels.
    expect(find.text('Thông tin'), findsOneWidget);
    expect(find.text('Nghỉ phép'), findsOneWidget);
    expect(find.text('Lương'), findsOneWidget);
    expect(find.text('Công việc'), findsOneWidget);
    expect(find.text('Lịch làm'), findsOneWidget);
    expect(find.text('Chấm công'), findsOneWidget);
  });
}