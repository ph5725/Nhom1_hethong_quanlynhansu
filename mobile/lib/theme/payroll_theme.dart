// lib/screens/payroll_management_page.dart

import 'package:flutter/material.dart';
import 'package:mobile/theme/app_theme.dart'; // Đảm bảo đường dẫn đúng

class PayrollTheme extends StatefulWidget {
  const PayrollTheme({super.key});

  @override
  State<PayrollTheme> createState() => _PayrollThemeState();
}

class _PayrollThemeState extends State<PayrollTheme> {
  String? _selectedEmployee;
  String? _selectedLeaveType;
  final TextEditingController _leaveDateController = TextEditingController();
  final TextEditingController _noteController = TextEditingController();

  final List<String> _employees = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];
  final List<String> _leaveTypes = [
    'Nghỉ phép năm',
    'Nghỉ ốm',
    'Nghỉ không lương'
  ];

  String? _errorMessage;

  @override
  void dispose() {
    _leaveDateController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  Future<void> _selectLeaveDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2101),
      builder: (context, child) {
        return Theme(
          data: AppTheme.lightTheme,
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() {
        _leaveDateController.text =
            "${picked.day}/${picked.month}/${picked.year}";
      });
    }
  }

  void _handleSubmit() {
    if (_selectedEmployee == null ||
        _selectedLeaveType == null ||
        _leaveDateController.text.isEmpty) {
      setState(() {
        _errorMessage =
            "Vui lòng điền đầy đủ thông tin vào các trường bắt buộc.";
      });
    } else {
      setState(() {
        _errorMessage = null;
      });
      debugPrint('Employee: $_selectedEmployee');
      debugPrint('Leave Type: $_selectedLeaveType');
      debugPrint('Leave Date: ${_leaveDateController.text}');
      debugPrint('Note: ${_noteController.text}');
    }
  }

  @Deprecated('Use g instead. Will be removed in 4.0.0.')
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(36.0),
          constraints:
              BoxConstraints(minHeight: MediaQuery.of(context).size.height),
          decoration: BoxDecoration(
            color: AppTheme.backgroundLight,
            borderRadius: BorderRadius.circular(15),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.1),
                blurRadius: 20,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Align(
                alignment: Alignment.center,
                child: Text(
                  'Quản lý Đơn Nghỉ Phép',
                  style: Theme.of(context).textTheme.displaySmall,
                ),
              ),
              const SizedBox(height: 24),
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton(
                  onPressed: () {
                    debugPrint('Add button pressed');
                  },
                  style: AppTheme.btnAddStyle,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.add, size: 14),
                      const SizedBox(width: 8),
                      Text('Thêm Mới',
                          style: Theme.of(context)
                              .textTheme
                              .bodyMedium
                              ?.copyWith(color: AppTheme.textPrimary)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              if (_errorMessage != null)
                Align(
                  alignment: Alignment.center,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: Text(
                      _errorMessage!,
                      style: Theme.of(context).textTheme.bodySmall,
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 500),
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Padding(
                            padding: const EdgeInsets.only(bottom: 16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Nhân Viên',
                                  style: Theme.of(context).textTheme.labelLarge,
                                ),
                                const SizedBox(height: 8),
                                DropdownButtonFormField<String>(
                                  value: _selectedEmployee,
                                  hint: Text('Chọn nhân viên',
                                      style: Theme.of(context)
                                          .inputDecorationTheme
                                          .hintStyle),
                                  // SỬA LỖI Ở ĐÂY
                                  decoration: const InputDecoration()
                                      .applyDefaults(Theme.of(context)
                                          .inputDecorationTheme),
                                  items: _employees.map((String employee) {
                                    return DropdownMenuItem<String>(
                                      value: employee,
                                      child: Text(employee,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyLarge),
                                    );
                                  }).toList(),
                                  onChanged: (String? newValue) {
                                    setState(() {
                                      _selectedEmployee = newValue;
                                    });
                                  },
                                  icon: Icon(Icons.arrow_drop_down,
                                      color: AppTheme.defaultPlaceholder),
                                  style: Theme.of(context).textTheme.bodyLarge,
                                ),
                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.only(bottom: 16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Loại Nghỉ Phép',
                                  style: Theme.of(context).textTheme.labelLarge,
                                ),
                                const SizedBox(height: 8),
                                DropdownButtonFormField<String>(
                                  value: _selectedLeaveType,
                                  hint: Text('Chọn loại nghỉ phép',
                                      style: Theme.of(context)
                                          .inputDecorationTheme
                                          .hintStyle),
                                  // SỬA LỖI Ở ĐÂY
                                  decoration: const InputDecoration()
                                      .applyDefaults(Theme.of(context)
                                          .inputDecorationTheme),
                                  items: _leaveTypes.map((String type) {
                                    return DropdownMenuItem<String>(
                                      value: type,
                                      child: Text(type,
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyLarge),
                                    );
                                  }).toList(),
                                  onChanged: (String? newValue) {
                                    setState(() {
                                      _selectedLeaveType = newValue;
                                    });
                                  },
                                  icon: Icon(Icons.arrow_drop_down,
                                      color: AppTheme.defaultPlaceholder),
                                  style: Theme.of(context).textTheme.bodyLarge,
                                ),
                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.only(bottom: 16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Ngày Nghỉ',
                                  style: Theme.of(context).textTheme.labelLarge,
                                ),
                                const SizedBox(height: 8),
                                GestureDetector(
                                  onTap: () => _selectLeaveDate(context),
                                  child: AbsorbPointer(
                                    child: TextField(
                                      controller: _leaveDateController,
                                      // SỬA LỖI Ở ĐÂY (dòng copyWith này cũng cần được áp dụng default trước)
                                      decoration: const InputDecoration()
                                          .applyDefaults(Theme.of(context)
                                              .inputDecorationTheme)
                                          .copyWith(
                                            hintText: 'Chọn ngày',
                                            suffixIcon: Icon(
                                                Icons.calendar_today,
                                                color:
                                                    AppTheme.defaultPlaceholder,
                                                size: 18),
                                          ),
                                      style:
                                          Theme.of(context).textTheme.bodyLarge,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.only(bottom: 16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Ghi Chú',
                                  style: Theme.of(context).textTheme.labelLarge,
                                ),
                                const SizedBox(height: 8),
                                TextField(
                                  controller: _noteController,
                                  // SỬA LỖI Ở ĐÂY
                                  decoration: const InputDecoration()
                                      .applyDefaults(Theme.of(context)
                                          .inputDecorationTheme)
                                      .copyWith(
                                        hintText: 'Nhập ghi chú...',
                                      ),
                                  maxLines: 4,
                                  minLines: 3,
                                  style: Theme.of(context).textTheme.bodyLarge,
                                ),
                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.only(top: 24.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                ElevatedButton(
                                  onPressed: () {
                                    debugPrint('Cancel button pressed');
                                  },
                                  style: AppTheme.btnCancelStyle,
                                  child: const Text('Hủy'),
                                ),
                                const SizedBox(width: 8),
                                ElevatedButton(
                                  onPressed: _handleSubmit,
                                  style: AppTheme.btnSaveStyle,
                                  child: const Text('Lưu'),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
