<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class EmployeeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = Employee::with([
            'department:id,name',
            'position:id,name',
            'educationLevel:id,level',
            'user:id,name'
        ])
        ->select([
            'id', 'fullname', 'date_of_birth', 'gender', 'birthplace', 'ethnicity', 'address', 'email',
            'id_card', // Thêm id_card vào các cột được chọn
            'image_path', // Thêm image_path vào các cột được chọn
            'user_id', 'department_id', 'education_id', 'position_id',
            'created_at', 'updated_at' // Thêm các cột timestamps nếu muốn
        ])
        ->get();

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Employees retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = Employee::with([
            'department:id,name',
            'contract:id,employee_id,salary_id', // Đảm bảo lấy employee_id nếu cần, và salary_id
            'position:id,name',
            'educationLevel:id,level',
            'user:id,name'
        ])
        ->select([
            'id', 'fullname', 'date_of_birth', 'gender', 'birthplace', 'ethnicity', 'address', 'email',
            'id_card', // Thêm id_card vào các cột được chọn
            'image_path', // Thêm image_path vào các cột được chọn
            'user_id', 'department_id', 'education_id', 'position_id',
            'created_at', 'updated_at'
        ])
        ->find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Employee retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|exists:users,id',
            'department_id' => 'required|exists:departments,id',
            'education_id' => 'required|exists:education_levels,id',
            'position_id' => 'required|exists:positions,id',
            'fullname' => 'required|string|max:100', // max:100 như migration
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:Male,Female,Other', // Thêm 'Other' nếu cần như migration
            'birthplace' => 'nullable|string|max:100', // nullable như migration
            'ethnicity' => 'nullable|string|max:50', // nullable như migration
            'address' => 'nullable|string|max:250', // nullable như migration
            'email' => 'required|email|unique:employees,email',
            'id_card' => 'nullable|string|max:20|unique:employees,id_card', // Thêm validation cho id_card, unique
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Thêm validation cho image_path
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = Employee::create($request->all());
        $data->load([
            'department:id,name',
            'position:id,name',
            'educationLevel:id,level',
            'user:id,name'
        ]);

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Employee created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = Employee::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'sometimes|nullable|exists:users,id',
            'department_id' => 'sometimes|required|exists:departments,id',
            'education_id' => 'sometimes|required|exists:education_levels,id',
            'position_id' => 'sometimes|required|exists:positions,id',
            'fullname' => 'sometimes|string|max:100',
            'date_of_birth' => 'sometimes|date',
            'gender' => 'sometimes|in:Male,Female,Other',
            'birthplace' => 'sometimes|nullable|string|max:100',
            'ethnicity' => 'sometimes|nullable|string|max:50',
            'address' => 'sometimes|nullable|string|max:250',
            'email' => 'sometimes|email|unique:employees,email,' . $id,
            'id_card' => 'sometimes|nullable|string|max:20|unique:employees,id_card,' . $id, // Thêm validation cho id_card, unique ngoại trừ chính nó
            'image_path' => 'sometimes|nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Hoặc 'sometimes|nullable|string|max:255' nếu không có file mới
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data->update($request->all());
        $data->load([
            'department:id,name',
            'position:id,name',
            'educationLevel:id,level',
            'user:id,name'
        ]);

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Employee updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = Employee::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Employee deleted successfully'
        ]);
    }

    // Hàm mới để lấy thông tin cá nhân của nhân viên đã xác thực
    public function personalInformation()
    {
        // Lấy người dùng đã xác thực
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized or no authenticated user found'
            ], 401);
        }

        // Tìm nhân viên liên kết với người dùng đã xác thực
        $employee = Employee::with([
            'department:id,name',
            'contract:id,employee_id,salary_id',
            'position:id,name',
            'educationLevel:id,level',
            'user:id,name'
        ])
        ->select([ // Đảm bảo lấy các cột cần thiết, bao gồm id_card và image_path
            'id', 'fullname', 'date_of_birth', 'gender', 'birthplace', 'ethnicity', 'address', 'email',
            'id_card',
            'image_path',
            'user_id', 'department_id', 'education_id', 'position_id',
            'created_at', 'updated_at'
        ])
        ->where('user_id', $user->id)
        ->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee information not found for the authenticated user'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $employee,
            'message' => 'Personal information retrieved successfully'
        ]);
    }
}