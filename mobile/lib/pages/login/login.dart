import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:provider/provider.dart';
// Ensure this path is correct if you have a sidebar, though not directly used in LoginPage
// import '../sidebar/sidebar.dart'; 

class AuthProvider with ChangeNotifier {
  String? _token;
  List<String>? _roles;

  String? get token => _token;
  List<String>? get roles => _roles;

  void setAuthData(String token, List<String> roles) {
    _token = token;
    _roles = roles;
    notifyListeners();
  }

  void clearAuthData() {
    _token = null;
    _roles = null;
    notifyListeners();
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  String _errorMessage = ''; // Initialize with empty string for consistency
  bool _isLoading = false;
  final _dio = Dio();

  // Define the two main colors for consistency
  static const Color primaryDarkBlue = Color.fromRGBO(13, 71, 161, 1); // Main dark blue
  static const Color secondaryLightBlue = Color.fromRGBO(224, 242, 247, 1); // Main light blue/grey

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = ''; // Clear previous error messages
    });

    try {
      final response = await _dio.post(
        'http://192.168.1.6:8000/api/login', // Make sure this IP is correct for your server
        data: {
          'email': _emailController.text,
          'password': _passwordController.text,
        },
        options: Options(
          receiveTimeout:
              const Duration(milliseconds: 5000), // 5 seconds timeout
          sendTimeout: const Duration(milliseconds: 5000),
        ),
      );

      if (response.statusCode == 200) {
        final token = response.data['access_token'];
        final roles = List<String>.from(response.data['roles'] ?? []);

        // Print token and roles for debugging
        print('Login successful!');
        print('Token: $token');
        print('Roles: $roles');

        if (roles.contains('per')) {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString('token', token);
          Provider.of<AuthProvider>(context, listen: false)
              .setAuthData(token, roles);
          Navigator.pushReplacementNamed(context, '/dashboard');
        } else {
          setState(() {
            _errorMessage = 'Your account does not have permission to access this page.';
          });
        }
      } else {
        setState(() {
          _errorMessage = 'Login failed. Status code: ${response.statusCode}';
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
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Unknown error: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // Main background color
      body: Stack( // Use Stack to layer the curved background
        children: [
          // Curved background shape (simulating the image)
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: ClipPath(
              clipper: _LoginClipper(),
              child: Container(
                height: MediaQuery.of(context).size.height * 0.3, // Adjust height as needed
                decoration: const BoxDecoration(
                  gradient: LinearGradient( // Use gradient for the curved background
                    colors: [primaryDarkBlue, Color.fromRGBO(176, 238, 255, 1)], // Blend primaryDarkBlue with a lighter blue for gradient
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.only(left: 30.0, top: 60.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        'WELCOM BACK!',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Smart HR - Smart Business',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          Center( // Center the login form
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Column( // Use Column to manage spacing from the top
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(height: MediaQuery.of(context).size.height * 0.25), // Space for the curved header
                  Container(
                    width: 330,
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      color: Colors.white, // White background for the form box
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1), // Lighter shadow for a modern look
                          offset: const Offset(0, 5),
                          blurRadius: 20,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    
                    child: Form(
                      key: _formKey,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                        'Login',
                        style: TextStyle(
                          color: const Color.fromRGBO(13, 71, 161, 1),
                          fontSize: 36,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 8),
                          TextFormField(
                            controller: _emailController,
                            decoration: InputDecoration(
                              labelText: 'Your Email', // Changed label
                              labelStyle: TextStyle(color: Colors.grey.shade600), // Grey label
                              prefixIcon: Icon(Icons.email_outlined, color: primaryDarkBlue), // Email icon
                              filled: true,
                              fillColor: const Color.fromRGBO(224, 242, 247, 1), // Light blue background for input fields
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide.none, // No border by default
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide(color: const Color.fromRGBO(13, 71, 161, 1), width: 2), // Dark blue border on focus
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide.none,
                              ),
                            ),
                            keyboardType: TextInputType.emailAddress,
                            validator: (value) =>
                                value!.isEmpty ? 'Please enter your email' : null,
                          ),
                          const SizedBox(height: 20),
                          TextFormField(
                            controller: _passwordController,
                            decoration: InputDecoration(
                              labelText: 'Password',
                              labelStyle: TextStyle(color: Colors.grey.shade600), // Grey label
                              prefixIcon: Icon(Icons.lock_outline, color: primaryDarkBlue), // Lock icon
                              filled: true,
                              fillColor: const Color.fromRGBO(224, 242, 247, 1), // Light blue background for input fields
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide.none,
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide(color: Color.fromRGBO(13, 71, 161, 1), width: 2),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide.none,
                              ),
                            ),
                            obscureText: true,
                            validator: (value) =>
                                value!.isEmpty ? 'Please enter your password' : null,
                          ),
                          if (_errorMessage.isNotEmpty) ...[
                            const SizedBox(height: 15),
                            Text(
                              _errorMessage,
                              style: const TextStyle(color: Colors.red, fontSize: 14),
                              textAlign: TextAlign.center,
                            ),
                          ],
                          const SizedBox(height: 30),
                          _isLoading
                              ? const CircularProgressIndicator(
                                  valueColor: AlwaysStoppedAnimation<Color>(primaryDarkBlue), // Color the spinner
                                )
                              : ElevatedButton(
                                  onPressed: _login,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: primaryDarkBlue, // Button background color
                                    foregroundColor: Colors.white, // Text color
                                    minimumSize: const Size(double.infinity, 50), // Full width button
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(10), // Rounded button
                                    ),
                                    elevation: 5, // Button shadow
                                  ),
                                  child: const Text(
                                    'LOGIN',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                          const SizedBox(height: 50),
                          
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Custom Clipper for the curved background shape
class _LoginClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    Path path = Path();
    path.lineTo(0, size.height * 0.7); // Start from top-left, go down
    path.quadraticBezierTo(
      size.width / 2, 
      size.height, 
      size.width, 
      size.height * 0.7
    ); // Create a curve
    path.lineTo(size.width, 0); // Go to top-right
    path.close(); // Close the path
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}
