import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile/models/attendance.dart'; 

// (Paste the Employee and Attendance model classes here)
// Make sure to include the Employee and Attendance model classes defined above.

class AttendanceShowScreen extends StatefulWidget {
  static const Color primaryDarkBlue = Color.fromRGBO(13, 71, 161, 1); // Main dark blue (0D47A1)
  static const Color secondaryLightBlue = Color.fromRGBO(224, 242, 247, 1); // Main light blue/grey (E0F2F7)
  
  @override
  _AttendanceShowScreenState createState() => _AttendanceShowScreenState();
}

class _AttendanceShowScreenState extends State<AttendanceShowScreen> {
  List<Attendance> _attendances = [];
  String _error = '';
  String? _roleApi;
  bool _isLoading = true; // To show a loading indicator

  @override
  void initState() {
    super.initState();
    _loadRoleAndFetchAttendances();
  }

  Future<void> _loadRoleAndFetchAttendances() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      final String? userRolesString = prefs.getString('user_roles');
      if (userRolesString != null && userRolesString.isNotEmpty) {
        final List<dynamic> storedRoles = json.decode(userRolesString);
        if (storedRoles.isNotEmpty) {
          setState(() {
            _roleApi = storedRoles[0]; // Assuming the first role is used
          });
        } else {
          _setError('No roles found. Using default role.');
          setState(() {
            _roleApi = 'user'; // Default role
          });
        }
      } else {
        _setError('No roles found in local storage. Using default role.');
        setState(() {
          _roleApi = 'user'; // Default role
        });
      }
    } catch (e) {
      _setError('Error loading roles: ${e.toString()}. Using default role.');
      setState(() {
        _roleApi = 'user'; // Default role
      });
    } finally {
      if (_roleApi != null) {
        _fetchAttendances();
      } else {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _fetchAttendances() async {
    setState(() {
      _isLoading = true;
      _error = '';
    });

    if (_roleApi == null) {
      _setError('Role not set. Cannot fetch attendances.');
      setState(() {
        _isLoading = false;
      });
      return;
    }

    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      final String? accessToken = prefs.getString('token');

      if (accessToken == null) {
        _setError('Access token not found. Please log in.');
        setState(() {
          _isLoading = false;
        });
        return;
      }

      final String apiUrl = 'http://192.168.1.6:8000/api/per/attendances';
      final response = await http.get(
        Uri.parse(apiUrl),
        headers: {
          'Authorization': 'Bearer $accessToken',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        if (responseData['success']) {
          List<Attendance> loadedAttendances = (responseData['data'] as List)
              .map((item) => Attendance.fromJson(item))
              .toList();
          setState(() {
            _attendances = loadedAttendances;
          });
        } else {
          _setError(responseData['message'] ?? 'Failed to fetch attendances.');
        }
      } else {
        _setError('Failed to fetch attendances. Status code: ${response.statusCode}');
      }
    } catch (e) {
      _setError('An error occurred: ${e.toString()}');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _setError(String message) {
    setState(() {
      _error = message;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // Main background color is white
      appBar: AppBar(
        title: const Text('Attendence'),
        backgroundColor: Color.fromRGBO(13, 71, 161, 1),
        foregroundColor: Color.fromRGBO(224, 242, 247, 1),
        // You can add leading/actions here if needed, like a menu icon
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_error.isNotEmpty)
              Container(
                margin: const EdgeInsets.only(bottom: 16.0),
                child: Card(
                  color: Colors.red.shade100,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                    side: BorderSide(color: Colors.red.shade400),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Row(
                      children: [
                        Icon(Icons.error_outline, color: Colors.red.shade700),
                        SizedBox(width: 8.0),
                        Expanded(
                          child: Text(
                            _error,
                            style: TextStyle(color: Colors.red.shade700),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            _isLoading
                ? Center(child: CircularProgressIndicator())
                : _attendances.isEmpty
                    ? Center(
                        child: Text(
                          _error.isEmpty ? 'No attendance records found.' : '',
                          style: TextStyle(fontSize: 16),
                        ),
                      )
                    : PaginatedDataTable(
                        header: const Text('Attendance Details'),
                        columns: const <DataColumn>[
                          DataColumn(label: Text('No.')),
                          DataColumn(label: Text('Employee')),
                          DataColumn(label: Text('Attendance Date')),
                          DataColumn(label: Text('Check In')),
                          DataColumn(label: Text('Check Out')),
                          DataColumn(label: Text('Status')),
                        ],
                        source: AttendanceDataSource(_attendances),
                        rowsPerPage: 10, // You can adjust this
                      ),
          ],
        ),
      ),
    );
  }
}

class AttendanceDataSource extends DataTableSource {
  final List<Attendance> _attendances;

  AttendanceDataSource(this._attendances);

  @override
  DataRow? getRow(int index) {
    if (index >= _attendances.length) {
      return null;
    }
    final attendance = _attendances[index];
    return DataRow(cells: [
      DataCell(Text((index + 1).toString())),
      DataCell(Text(attendance.employee?.fullname ?? 'N/A')),
      DataCell(Text(attendance.attendanceDate)),
      DataCell(Text(attendance.checkIn)),
      DataCell(Text(attendance.checkOut ?? 'N/A')),
      DataCell(Text(attendance.status)),
    ]);
  }

  @override
  bool get isRowCountApproximate => false;

  @override
  int get rowCount => _attendances.length;

  @override
  int get selectedRowCount => 0;
}