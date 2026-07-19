import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:provider/provider.dart';
// Ensure this path is correct for your sidebar.dart file
import '../sidebar/sidebar.dart'; 

class DashboardWidget extends StatefulWidget {
  const DashboardWidget({super.key});

  @override
  _DashboardWidgetState createState() => _DashboardWidgetState();
}

class _DashboardWidgetState extends State<DashboardWidget> {
  Map<String, dynamic>? _dashboardData;
  String _errorMessage = ''; // Initialize with empty string
  bool _isLoading = true;
  final _dio = Dio();

  // Define the two main colors for consistency
  static const Color primaryDarkBlue = Color.fromRGBO(13, 71, 161, 1); // Main dark blue (0D47A1)
  static const Color secondaryLightBlue = Color.fromRGBO(224, 242, 247, 1); // Main light blue/grey (E0F2F7)

  @override
  void initState() {
    super.initState();
    print('DashboardWidget: initState called, starting data fetch.');
    _fetchDashboardData();
  }

  Future<void> _fetchDashboardData() async {
    print('DashboardWidget: _fetchDashboardData started.');
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    if (token == null) {
      setState(() {
        _errorMessage = 'Token not found. Please log in again.';
        _isLoading = false;
        print('DashboardWidget: Token not found, setting error: $_errorMessage');
      });
      return;
    }

    try {
      print('DashboardWidget: Fetching data from API with token...');
      final response = await _dio.get(
        'http://192.168.1.6:8000/api/per/dashboard/personal',
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
          },
          receiveTimeout:
              const Duration(milliseconds: 5000), // 5 seconds timeout
          sendTimeout: const Duration(milliseconds: 5000),
        ),
      );

      if (response.statusCode == 200) {
        setState(() {
          _dashboardData = response.data; 
          _isLoading = false;
          print('DashboardWidget: Data fetched successfully: $_dashboardData');
        });
      } else {
        setState(() {
          _errorMessage =
              'Error loading dashboard data. Status code: ${response.statusCode}';
          _isLoading = false;
          print('DashboardWidget: API returned error status: ${response.statusCode}, error: $_errorMessage');
        });
      }
    } on DioException catch (e) {
      setState(() {
        _errorMessage = 'Connection error: ${e.message}. Check server or network.';
        if (e.response != null) {
          _errorMessage += '\nError Code: ${e.response!.statusCode}';
          if (e.response!.data != null) {
             _errorMessage += '\nDetails: ${e.response!.data.toString()}';
          }
        }
        _isLoading = false; 
        print('DashboardWidget: DioException caught: $_errorMessage');
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Unknown error: $e';
        _isLoading = false; 
        print('DashboardWidget: Unknown error caught: $_errorMessage');
      });
    } finally {
      setState(() {
        _isLoading = false; 
        print('DashboardWidget: Data fetch finished. isLoading: $_isLoading, errorMessage: $_errorMessage, dashboardData is null: ${_dashboardData == null}');
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    print('DashboardWidget: Building UI. isLoading: $_isLoading, errorMessage.isNotEmpty: ${_errorMessage.isNotEmpty}, dashboardData is null: ${_dashboardData == null}');

    // Define dashboard action items with labels and icons
    // You can customize these based on the data you want to highlight or actions
    final List<Map<String, dynamic>> dashboardActionItems = [
      {'label': 'Attendances', 'icon': Icons.calendar_today, 'valueKey': 'total_attendances'},
      {'label': 'Tasks', 'icon': Icons.task, 'valueKey': 'total_tasks'},
      {'label': 'Leaves', 'icon': Icons.sick, 'valueKey': 'total_leaves_applied'},
      {'label': 'Schedules', 'icon': Icons.schedule, 'valueKey': 'total_schedules'},
      {'label': 'Net Salary', 'icon': Icons.attach_money, 'valueKey': 'net_salary'},
    ];

    return Scaffold(
      backgroundColor: Colors.white, // Main background color is white
      appBar: AppBar(
        title: const Text('Dashboard'),
        backgroundColor: primaryDarkBlue,
        foregroundColor: secondaryLightBlue,
        // You can add leading/actions here if needed, like a menu icon
      ),
      drawer: const Sidebar(), // Your existing Sidebar
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(primaryDarkBlue)))
          : _errorMessage.isNotEmpty 
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Text(
                      _errorMessage, 
                      style: const TextStyle(color: Colors.red),
                      textAlign: TextAlign.center,
                    ),
                  ),
                )
              : _dashboardData == null || _dashboardData!.isEmpty
                  ? const Center(
                      child: Text(
                        'No dashboard data to display.',
                        style: TextStyle(color: Colors.grey),
                        textAlign: TextAlign.center,
                      ),
                    )
                  : SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Top curved header section
                          ClipPath(
                            clipper: _DashboardClipper(),
                            child: Container(
                              height: 180, // Fixed height for the header
                              decoration: const BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [primaryDarkBlue, Color(0xFF42A5F5)], // Dark blue gradient
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                              ),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 25.0, vertical: 30.0),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    Expanded(
                                      child: Column(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: const [
                                          Text(
                                            'Hi Friend!', // Placeholder name
                                            style: TextStyle(
                                              color: Colors.white,
                                              fontSize: 28,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          SizedBox(height: 5),
                                          Text(
                                            'Have a nice day!', // Greeting
                                            style: TextStyle(
                                              color: Colors.white70,
                                              fontSize: 16,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    // Profile Picture (placeholder)
                                    CircleAvatar(
                                      radius: 40,
                                      backgroundColor: secondaryLightBlue,
                                      backgroundImage: NetworkImage('https://placehold.co/100x100/0D47A1/E0F2F7?text=DP'), // Placeholder image
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          
                          // Grid of action cards
                          Padding(
                            padding: const EdgeInsets.all(15.0),
                            child: GridView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(), // Disable GridView's own scrolling
                              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: MediaQuery.of(context).size.width > 600 ? 4 : 2, // 2 or 4 columns
                                crossAxisSpacing: 15,
                                mainAxisSpacing: 15,
                                childAspectRatio: 1.0, // Square cards
                              ),
                              itemCount: dashboardActionItems.length,
                              itemBuilder: (context, index) {
                                final item = dashboardActionItems[index];
                                // Get the value from _dashboardData if valueKey exists
                                final dynamic value = item['valueKey'] != null 
                                    ? (_dashboardData![item['valueKey']] ?? 'N/A') 
                                    : null; // Use 'N/A' if value is null
                                
                                return Card(
                                  elevation: 6, // Increased shadow for more depth
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(15),
                                  ),
                                  color: Colors.white, // White background for cards
                                  child: InkWell( // Make cards clickable
                                    onTap: () {
                                      // Handle tap on each card (e.g., navigate to a specific page)
                                      print('Tapped on ${item['label']}');
                                    },
                                    borderRadius: BorderRadius.circular(15),
                                    child: Padding(
                                      padding: const EdgeInsets.all(12.0),
                                      child: Column(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Icon(
                                            item['icon'],
                                            size: 40,
                                            color: primaryDarkBlue, // Dark blue icon color
                                          ),
                                          const SizedBox(height: 10),
                                          Text(
                                            item['label'],
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                              fontSize: 15,
                                              fontWeight: FontWeight.bold,
                                              color: primaryDarkBlue, // Dark blue label color
                                            ),
                                          ),
                                          if (value != null) // Display value if available
                                            Text(
                                              value.toString(),
                                              style: const TextStyle(
                                                fontSize: 18,
                                                fontWeight: FontWeight.w800,
                                                color: Colors.black87, // Keep value text dark for readability
                                              ),
                                            ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                        ],
                      ),
                    ),
    );
  }
}

// Custom Clipper for the curved background shape in Dashboard
class _DashboardClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    Path path = Path();
    path.lineTo(0, size.height * 0.85); // Start from top-left, go down
    path.quadraticBezierTo(
      size.width / 2, 
      size.height, 
      size.width, 
      size.height * 0.85
    ); // Create a curve
    path.lineTo(size.width, 0); // Go to top-right
    path.close(); // Close the path
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}
