<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\User; // Đảm bảo import User model nếu chưa có

class AuthController extends Controller
{
    public function login(Request $request)
    {
        Log::info('Login request received', $request->all());

        // Kiểm tra đầu vào
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Đăng nhập
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Sai email hoặc mật khẩu'], 401);
        }

        // Lấy người dùng
        $user = Auth::user();
        // Eager load mối quan hệ employee ngay khi lấy user
        // Đảm bảo rằng bạn eager load nó ngay tại đây hoặc trong middleware
        $user = User::with('employee')->find($user->id); // Lấy lại user với employee eager loaded
        // Nếu user đã được eager load từ AuthenticatedUser, bạn có thể bỏ dòng trên
        // và chỉ cần kiểm tra $user->employee

        $roles = $user->roles()->pluck('name');

        // Tạo token
        $token = $user->createToken('api_token')->plainTextToken;

        // Trích xuất thông tin nhân viên
        $employeeId = null;
        $employeeFullname = null;

        if ($user->employee) {
            $employeeId = $user->employee->id;
            $employeeFullname = $user->employee->fullname; // Giả sử cột là 'fullname'
            // Hoặc $employeeFullname = $user->employee->name; tùy thuộc vào tên cột của bạn
        }


        // Trả về token và thông tin người dùng, kèm theo thông tin nhân viên
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user, // Có thể chứa cả thông tin employee nếu bạn để lại
            'roles' => $roles,
            'employee_info' => [ // Thêm một object mới chứa thông tin nhân viên
                'id' => $employeeId,
                'fullname' => $employeeFullname,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đăng xuất thành công',
        ]);
    }

    public function user(Request $request)
    {
        // Lấy người dùng hiện tại, eager load mối quan hệ 'employee'
        $user = $request->user()->load('employee'); // Sử dụng load() để eager load mối quan hệ

        $roles = $user->roles()->pluck('name'); // Lấy danh sách vai trò

        $employeeId = null;
        $employeeFullname = null;

        if ($user->employee) {
            $employeeId = $user->employee->id;
            $employeeFullname = $user->employee->fullname; // Giả sử cột là 'fullname'
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'roles' => $roles,
                'employee_info' => [ // Thêm object chứa thông tin nhân viên
                    'id' => $employeeId,
                    'fullname' => $employeeFullname,
                ]
            ],
            'message' => 'User retrieved successfully'
        ]);
    }
}