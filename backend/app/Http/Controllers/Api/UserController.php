<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Role;
use App\Models\RoleUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = User::with('roles:name')->get(['id', 'name', 'email']);
        $role = Role::all(['id', 'name']);
        $employee = Employee::all(['user_id', 'fullname']);
        return response()->json([
            'success' => true,
            'data' => $data,
            'employee' => $employee,
            'message' => 'Users retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = User::with('roles:name')->find($id, ['id', 'name', 'email']);
        $role = Role::all(['id', 'name']);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'User retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id', // đảm bảo mỗi role_id đều tồn tại
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Tạo user mới với password đã hash
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Gán các role được chọn vào bảng role_user
        foreach ($request->roles as $roleId) {
            RoleUser::create([
                'user_id' => $user->id,
                'role_id' => $roleId,
            ]);
        }

        // Load role name để trả về
        $user->load('roles:name');

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'User created successfully'
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'roles' => 'nullable|array',
            'roles.*' => 'integer|exists:roles,id',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed for user update:', ['errors' => $validator->errors()->toArray(), 'request' => $request->all()]);

            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($request->only(['name', 'email']));

        if ($request->has('roles')) {
            $validRoleIds = collect($request->roles)->filter(function ($roleId) {
                return is_numeric($roleId) && (int)$roleId == $roleId && $roleId > 0;
            })->map(function ($roleId) {
                return (int) $roleId;
            })->toArray();

            Log::info('Syncing roles for user ' . $user->id . ' with IDs:', $validRoleIds);

            $user->roles()->sync($validRoleIds);
        } else {
            $user->roles()->sync([]);
        }

        $user->load('roles');

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'User updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = User::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }
}
