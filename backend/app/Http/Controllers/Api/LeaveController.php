<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Leave;
use App\Models\Employee;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon; // Đảm bảo Carbon được import

class LeaveController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $leaves = Leave::with([
            'employee:id,fullname',
            'approved:id,fullname',
            'leaveType:id,name'
        ])->get();

        $employees = Employee::select('id', 'fullname')->get();
        $leaveTypes = LeaveType::select('id', 'name')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'leaves' => $leaves,
                'employees' => $employees,
                'leaveTypes' => $leaveTypes,
            ],
            'message' => 'Leaves and related lists retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = Leave::with([
            'employee:id,fullname',
            'approved:id,fullname',
            'leaveType:id,name'
        ])->find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Leave not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Leave retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:500',
            'note' => 'nullable|string',
            'status' => 'nullable|string|in:pending,approved,rejected',
            'approved_by' => 'nullable|exists:employees,id',
            'approved_date' => 'nullable|date',
            // 'request_date' KHÔNG NÊN ĐẶT Ở ĐÂY VÌ NÓ KHÔNG PHẢI LÀ INPUT TỪ CLIENT
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $requestData = $request->all();

        // THÊM request_date TRƯỚC KHI TẠO
        // Luôn set request_date là ngày hiện tại khi tạo mới một đơn xin nghỉ phép
        $requestData['request_date'] = Carbon::now()->toDateString(); // Sử dụng toDateString() để lấy định dạng 'YYYY-MM-DD'

        // Đảm bảo status được set là 'pending' nếu không có trong request (hoặc nếu bạn muốn mặc định)
        if (!isset($requestData['status'])) {
            $requestData['status'] = 'pending';
        }

        $data = Leave::create($requestData);
        $data->load([
            'employee:id,fullname',
            'approved:id,fullname',
            'leaveType:id,name'
        ]);

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Leave created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = Leave::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Leave not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'employee_id' => 'sometimes|required|exists:employees,id',
            'leave_type_id' => 'sometimes|required|exists:leave_types,id',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'reason' => 'sometimes|required|string|max:500',
            'note' => 'nullable|string',
            'status' => 'sometimes|required|string|in:pending,approved,rejected',
            'approved_by' => 'nullable|exists:employees,id',
            'approved_date' => 'nullable|date',
            // 'request_date' KHÔNG NÊN ĐẶT Ở ĐÂY
            // Nếu bạn muốn cho phép cập nhật request_date, hãy thêm nó vào validation rule
            // nhưng nó thường không thay đổi sau khi tạo
            'request_date' => 'sometimes|required|date', // Chỉ thêm dòng này nếu bạn thực sự muốn cho phép cập nhật request_date
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $updateData = $request->all();
        // Cân nhắc KHÔNG cập nhật request_date khi update trừ khi có lý do đặc biệt.
        // Nếu muốn cập nhật, bạn phải gửi nó từ frontend.
        // $updateData['request_date'] = Carbon::now()->toDateString(); // Không nên làm nếu không cần update

        $data->update($updateData); // $request->all() đã được validate và có thể chứa các trường cần update
        $data->load([
            'employee:id,fullname',
            'approved:id,fullname',
            'leaveType:id,name'
        ]);

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Leave updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = Leave::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Leave not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Leave deleted successfully'
        ]);
    }

    public function submitLeaveRequest(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated.'
            ], 401);
        }

        $employee = $user->employee;

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Authenticated user is not associated with an employee record.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'leave_type_id' => 'required|exists:leave_types,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|max:500',
            'note' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $leave = Leave::create([
            'employee_id' => $employee->id,
            'leave_type_id' => $request->leave_type_id,
            'request_date' => Carbon::now()->toDateString(), // CHỈNH SỬA Ở ĐÂY: Dùng toDateString()
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'note' => $request->note,
            'status' => 'pending',
            'approved_by' => null,
            'approved_date' => null,
        ]);

        $leave->load([
            'employee:id,fullname',
            'leaveType:id,name'
        ]);

        return response()->json([
            'success' => true,
            'data' => $leave,
            'message' => 'Leave request submitted successfully'
        ], 201);
    }

    public function approveLeave($id)
    {
        $leave = Leave::find($id);

        if (!$leave) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request not found'
            ], 404);
        }

        if ($leave->status === 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Leave request is already approved'
            ], 400);
        }
        if ($leave->status === 'rejected') {
            return response()->json([
                'success' => false,
                'message' => 'Leave request was rejected and cannot be approved'
            ], 400);
        }

        $employee = Auth::user()->employee ?? null;
        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Authenticated user is not associated with an employee record.'
            ], 403);
        }
        $approvedEmployeeId = $employee->id;


        $leave->update([
            'status' => 'approved',
            'approved_by' => $approvedEmployeeId,
            'approved_date' => now(),
        ]);

        $leave->load(['employee:id,fullname', 'approved:id,fullname', 'leaveType:id,name']);

        return response()->json([
            'success' => true,
            'data' => $leave,
            'message' => 'Leave request approved successfully'
        ], 201);
    }

    public function rejectLeave($id)
    {
        $leave = Leave::find($id);

        if (!$leave) {
            return response()->json([
                'success' => false,
                'message' => 'Leave request not found'
            ], 404);
        }

        if ($leave->status === 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Leave request was approved and cannot be rejected'
            ], 400);
        }
        if ($leave->status === 'rejected') {
            return response()->json([
                'success' => false,
                'message' => 'Leave request is already rejected'
            ], 400);
        }

        $employee = Auth::user()->employee ?? null;
        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Authenticated user is not associated with an employee record.'
            ], 403);
        }
        $approvedEmployeeId = $employee->id;

        $leave->update([
            'status' => 'rejected',
            'approved_by' => $approvedEmployeeId,
            'approved_date' => now(),
        ]);

        $leave->load(['employee:id,fullname', 'approved:id,fullname', 'leaveType:id,name']);

        return response()->json([
            'success' => true,
            'data' => $leave,
            'message' => 'Leave request rejected successfully'
        ]);
    }
}