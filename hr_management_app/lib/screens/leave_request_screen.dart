import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/employee.dart';
import '../models/leave.dart';
import '../services/hr_service.dart';

class LeaveRequestScreen extends StatefulWidget {
  @override
  _LeaveRequestScreenState createState() => _LeaveRequestScreenState();
}

class _LeaveRequestScreenState extends State<LeaveRequestScreen> {
  final HrService _hrService = HrService();
  final _formKey = GlobalKey<FormState>();
  DateTime? _selectedDate;
  String? _note;
  int _leaveTypeId = 1; // Giả sử có 4 loại nghỉ phép (theo JSON)
  Employee? _selectedEmployee;

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2025),
      lastDate: DateTime(2030),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Xin nghỉ phép')),
      body: Column(
        children: [
          // Form xin nghỉ phép
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  FutureBuilder<List<Employee>>(
                    future: _hrService.getEmployees(),
                    builder: (context, snapshot) {
                      if (!snapshot.hasData) {
                        return CircularProgressIndicator();
                      }
                      return DropdownButtonFormField<Employee>(
                        decoration: InputDecoration(labelText: 'Chọn nhân viên'),
                        value: _selectedEmployee,
                        items: snapshot.data!.map((employee) {
                          return DropdownMenuItem(
                            value: employee,
                            child: Text(employee.fullname),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedEmployee = value;
                          });
                        },
                        validator: (value) => value == null ? 'Vui lòng chọn nhân viên' : null,
                      );
                    },
                  ),
                  SizedBox(height: 16),
                  DropdownButtonFormField<int>(
                    decoration: InputDecoration(labelText: 'Loại nghỉ phép'),
                    value: _leaveTypeId,
                    items: [
                      DropdownMenuItem(value: 1, child: Text('Nghỉ bệnh')),
                      DropdownMenuItem(value: 2, child: Text('Nghỉ lễ')),
                      DropdownMenuItem(value: 3, child: Text('Nghỉ phép hằng năm')),
                      DropdownMenuItem(value: 4, child: Text('Nghỉ phép thường')),
                    ],
                    onChanged: (value) {
                      setState(() {
                        _leaveTypeId = value!;
                      });
                    },
                  ),
                  SizedBox(height: 16),
                  TextFormField(
                    readOnly: true,
                    decoration: InputDecoration(
                      labelText: 'Ngày nghỉ',
                      suffixIcon: Icon(Icons.calendar_today),
                    ),
                    onTap: () => _selectDate(context),
                    controller: TextEditingController(
                      text: _selectedDate != null
                          ? DateFormat('yyyy-MM-dd').format(_selectedDate!)
                          : '',
                    ),
                    validator: (value) =>
                        _selectedDate == null ? 'Vui lòng chọn ngày nghỉ' : null,
                  ),
                  SizedBox(height: 16),
                  TextFormField(
                    decoration: InputDecoration(labelText: 'Ghi chú (nếu có)'),
                    onChanged: (value) {
                      _note = value;
                    },
                  ),
                  SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        bool success = await _hrService.submitLeaveRequest(
                          _selectedEmployee!.id,
                          _leaveTypeId,
                          DateFormat('yyyy-MM-dd').format(_selectedDate!),
                          _note,
                        );
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(success
                                ? 'Gửi yêu cầu nghỉ phép thành công'
                                : 'Gửi yêu cầu thất bại'),
                          ),
                        );
                        setState(() {}); // Cập nhật danh sách yêu cầu
                      }
                    },
                    child: Text('Gửi yêu cầu'),
                  ),
                ],
              ),
            ),
          ),
          // Danh sách yêu cầu nghỉ phép
          Expanded(
            child: FutureBuilder<List<Leave>>(
              future: _hrService.getLeaves(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Lỗi: ${snapshot.error}'));
                }
                final leaves = snapshot.data ?? [];
                return ListView.builder(
                  itemCount: leaves.length,
                  itemBuilder: (context, index) {
                    final leave = leaves[index];
                    return ListTile(
                      title: Text('Nhân viên ID: ${leave.employeeId}'),
                      subtitle: Text('Ngày nghỉ: ${leave.leaveDate}\nTrạng thái: ${leave.status}'),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}