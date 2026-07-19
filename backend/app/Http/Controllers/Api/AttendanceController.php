<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\WorkSchedule; // Import WorkSchedule model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator; // Đã sửa lỗi cú pháp
use Illuminate\Support\Facades\Auth; // Đã sửa lỗi cú pháp
use Carbon\Carbon; // Đã sửa lỗi cú pháp

class AttendanceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        // Lấy employee_id của người dùng hiện tại
        $employeeId = Auth::user()->employee->id ?? null;

        if (!$employeeId) {
            return response()->json([
                'success' => false,
                'message' => 'Employee ID not found for the authenticated user.'
            ], 403); // Forbidden
        }

        // Lấy tất cả các bản ghi chấm công cho employee_id này và eager load mối quan hệ 'employee'
        // Chỉ chọn id và fullname từ bảng employee để tối ưu
        $data = Attendance::where('employee_id', $employeeId)
                            ->with('employee:id,fullname')
                            ->get();

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Attendances retrieved successfully for the current employee'
        ]);
    }

    public function show($id)
    {
        // Lấy employee_id của người dùng hiện tại
        $employeeId = Auth::user()->employee->id ?? null;

        if (!$employeeId) {
            return response()->json([
                'success' => false,
                'message' => 'Employee ID not found for the authenticated user.'
            ], 403);
        }

        // Tìm bản ghi chấm công và đảm bảo nó thuộc về người dùng hiện tại, eager load mối quan hệ 'employee'
        // Chỉ chọn id và fullname từ bảng employee để tối ưu
        $data = Attendance::where('id', $id)
                            ->where('employee_id', $employeeId)
                            ->with('employee:id,fullname')
                            ->first();

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance not found or you do not have permission to view it'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Attendance retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        // Lấy employee_id của người dùng đã đăng nhập
        $employeeId = Auth::user()->employee->id ?? null;

        if (!$employeeId) {
            return response()->json([
                'success' => false,
                'message' => 'Employee ID not found for the authenticated user. Cannot record attendance.'
            ], 403);
        }

        // Chuẩn bị dữ liệu cho validation, đảm bảo employee_id là của người dùng hiện tại
        $requestData = $request->all();
        $requestData['employee_id'] = $employeeId; // Ghi đè employee_id nếu nó được gửi từ client

        $validator = Validator::make($requestData, [
            'employee_id' => 'required|exists:employees,id',
            'attendance_date' => 'required|date_format:Y-m-d',
            'check_in' => 'required|date_format:H:i:s',
            'check_out' => 'nullable|date_format:H:i:s|after:check_in',
            'id' => 'nullable|integer|exists:attendances,id' // Thêm validation cho 'id' nếu có
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $attendanceDate = $requestData['attendance_date'];
        $checkInTime = $requestData['check_in'];

        // Thêm kiểm tra: attendance_date phải là ngày hiện tại
        $todayDate = Carbon::now()->format('Y-m-d');
        if ($attendanceDate !== $todayDate) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance can only be recorded for today\'s date.'
            ], 400); // Bad Request
        }

        // 1. Kiểm tra xem có ca làm hợp lệ cho nhân viên vào ngày hôm nay không
        $workSchedule = WorkSchedule::where('employee_id', $employeeId)
            ->whereDate('work_date', $attendanceDate)
            ->where('is_day_off', false)
            ->with('workShift')
            ->first();

        if (!$workSchedule || !$workSchedule->workShift) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có ca làm việc hợp lệ để chấm công vào ngày hôm nay.'
            ], 403);
        }

        // Lấy giờ bắt đầu ca làm từ WorkShift
        $shiftStartTime = Carbon::parse($workSchedule->workShift->start_time);
        $actualCheckIn = Carbon::parse($checkInTime);

        // Xác định status dựa trên thời gian check-in
        $status = 'present';
        if ($actualCheckIn->greaterThan($shiftStartTime)) {
            $status = 'late';
        }

        // 2. Kiểm tra xem đã check-in cho ngày này chưa
        $existingAttendance = Attendance::where('employee_id', $employeeId)
                                        ->whereDate('attendance_date', $attendanceDate)
                                        ->first();

        // Kiểm tra thêm: Nếu ID được cung cấp trong request, nó phải khớp với ID của bản ghi chấm công hiện có
        // hoặc nếu ID được cung cấp nhưng không tìm thấy bản ghi cho ngày hôm nay
        if ($request->has('id')) {
            if ($existingAttendance) {
                if ($requestData['id'] != $existingAttendance->id) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Provided attendance ID does not match the existing attendance record for today. Please use the update endpoint for specific record updates.'
                    ], 409); // Conflict
                }
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Provided attendance ID does not correspond to an existing record for today, or no record found for today.'
                ], 404); // Not Found
            }
        }


        if ($existingAttendance) {
            // Nếu đã có bản ghi, cập nhật check_out (nếu có trong request)
            if ($requestData['check_out'] ?? null) {
                $existingAttendance->check_out = $requestData['check_out'];
                $existingAttendance->save();

                // Tải lại mối quan hệ employee để đảm bảo fullname có trong response sau khi cập nhật
                $existingAttendance->load('employee:id,fullname');

                return response()->json([
                    'success' => true,
                    'data' => $existingAttendance,
                    'message' => 'Check-out recorded successfully for today.'
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn đã chấm công (check-in) cho ngày hôm nay rồi. Nếu bạn muốn chấm công ra, vui lòng cung cấp thời gian check-out.'
                ], 409);
            }
        } else {
            // Nếu chưa có bản ghi, tạo bản ghi check-in mới
            if (!($requestData['check_in'] ?? null)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vui lòng cung cấp thời gian check-in.'
                ], 422);
            }

            $data = Attendance::create([
                'employee_id' => $employeeId,
                'attendance_date' => $attendanceDate,
                'check_in' => $checkInTime,
                'check_out' => $requestData['check_out'] ?? null,
                'status' => $status,
            ]);

            // Tải lại mối quan hệ employee để đảm bảo fullname có trong response sau khi tạo mới
            $data->load('employee:id,fullname');

            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'Attendance (Check-in) created successfully'
            ], 201);
        }
    }

    public function update(Request $request, $id)
    {
        // Lấy employee_id của người dùng hiện tại
        $employeeId = Auth::user()->employee->id ?? null;

        if (!$employeeId) {
            return response()->json([
                'success' => false,
                'message' => 'Employee ID not found for the authenticated user.'
            ], 403);
        }

        // Tìm bản ghi và đảm bảo nó thuộc về người dùng hiện tại
        $data = Attendance::where('id', $id)
                            ->where('employee_id', $employeeId)
                            ->first();

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance not found or you do not have permission to update it'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'attendance_date' => 'required|date_format:Y-m-d',
            'check_in' => 'required|date_format:H:i:s',
            'check_out' => 'nullable|date_format:H:i:s|after:check_in',
            'status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Đảm bảo employee_id trong request match với người dùng hiện tại
        if ($request->input('employee_id') != $employeeId) {
             return response()->json([
                 'success' => false,
                 'message' => 'You are not authorized to update attendance for another employee.'
             ], 403);
        }

        $data->update($request->all());
        // Tải lại mối quan hệ employee để đảm bảo fullname có trong response sau khi cập nhật
        $data->load('employee:id,fullname');

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Attendance updated successfully'
        ]);
    }

    /**
     * Cập nhật thời gian check-out cho một bản ghi chấm công cụ thể.
     * Kiểm tra xem thời gian check-out có sớm hơn 30 phút so với giờ kết thúc ca làm việc hay không.
     *
     * @param Request $request
     * @param int $id ID của bản ghi chấm công cần cập nhật
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateCheckOut(Request $request, $id)
    {
        // Lấy employee_id của người dùng hiện tại
        $employeeId = Auth::user()->employee->id ?? null;

        if (!$employeeId) {
            return response()->json([
                'success' => false,
                'message' => 'Employee ID not found for the authenticated user.'
            ], 403); // Forbidden
        }

        // Tìm bản ghi chấm công và đảm bảo nó thuộc về người dùng hiện tại
        $attendance = Attendance::where('id', $id)
                                ->where('employee_id', $employeeId)
                                ->first();

        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance record not found or you do not have permission to update it.'
            ], 404);
        }

        // Thêm kiểm tra: attendance_date của bản ghi phải là ngày hiện tại
        $todayDate = Carbon::now()->format('Y-m-d');
        if ($attendance->attendance_date !== $todayDate) {
            return response()->json([
                'success' => false,
                'message' => 'Check-out can only be updated for today\'s attendance record.'
            ], 400); // Bad Request
        }

        // Validate request chỉ cho trường check_out
        $validator = Validator::make($request->all(), [
            'check_out' => 'required|date_format:H:i:s',
        ]);

        // Ghi đè rule 'after:check_in' để so sánh với check_in của bản ghi hiện có
        $validator->after(function ($validator) use ($request, $attendance) {
            $checkOutTime = Carbon::parse($request->input('check_out'));
            $checkInTime = Carbon::parse($attendance->check_in);

            if ($checkOutTime->lessThanOrEqualTo($checkInTime)) {
                $validator->errors()->add('check_out', 'The check out time must be after the check in time.');
            }
        });


        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $requestedCheckOutTime = Carbon::parse($request->input('check_out'));
        $attendanceDate = $attendance->attendance_date; // Lấy ngày từ bản ghi chấm công hiện có

        // Lấy lịch làm việc cho ngày chấm công của nhân viên
        $workSchedule = WorkSchedule::where('employee_id', $employeeId)
            ->whereDate('work_date', $attendanceDate)
            ->where('is_day_off', false)
            ->with('workShift')
            ->first();

        if (!$workSchedule || !$workSchedule->workShift) {
            return response()->json([
                'success' => false,
                'message' => 'No valid work shift found for the attendance date. Cannot verify check-out time.'
            ], 403);
        }

        // Lấy giờ kết thúc ca làm từ WorkShift
        $shiftEndTime = Carbon::parse($workSchedule->workShift->end_time);

        // So sánh thời gian check-out với giờ kết thúc ca làm, cho phép sớm hơn 30 phút
        // Nếu check-out sớm hơn shiftEndTime trừ đi 30 phút
        if ($requestedCheckOutTime->lessThan($shiftEndTime->copy()->subMinutes(30))) {
            return response()->json([
                'success' => false,
                'message' => 'You are checking out more than 30 minutes earlier than your scheduled shift end time.'
            ], 400); // Bad Request
        }

        // Cập nhật thời gian check-out
        $attendance->check_out = $requestedCheckOutTime->format('H:i:s');
        $attendance->save();

        // Tải lại mối quan hệ employee để đảm bảo fullname có trong response sau khi cập nhật
        $attendance->load('employee:id,fullname');

        return response()->json([
            'success' => true,
            'data' => $attendance,
            'message' => 'Check-out time updated successfully.'
        ]);
    }

    public function destroy($id)
    {
        // Lấy employee_id của người dùng hiện tại
        $employeeId = Auth::user()->employee->id ?? null;

        if (!$employeeId) {
            return response()->json([
                'success' => false,
                'message' => 'Employee ID not found for the authenticated user.'
            ], 403);
        }

        // Tìm bản ghi và đảm bảo nó thuộc về người dùng hiện tại
        $data = Attendance::where('id', $id)
                            ->where('employee_id', $employeeId)
                            ->first();

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance not found or you do not have permission to delete it'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Attendance deleted successfully'
        ]);
    }
}
