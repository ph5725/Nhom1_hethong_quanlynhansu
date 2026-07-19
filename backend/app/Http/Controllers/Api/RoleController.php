<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = Role::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Roles retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = Role::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Role retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:125',
            'guard_name' => 'required|string|max:125', // Added validation for guard_name
            'description' => 'nullable|string|max:191',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = Role::create($request->all()); // Ensure 'guard_name' is fillable in your Role model

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Role created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = Role::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:125',
            'guard_name' => 'sometimes|required|string|max:125', // Added validation for guard_name
            'description' => 'nullable|string|max:191', 
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data->update($request->all()); // Ensure 'guard_name' is fillable in your Role model

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Role updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = Role::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully'
        ]);
    }
}