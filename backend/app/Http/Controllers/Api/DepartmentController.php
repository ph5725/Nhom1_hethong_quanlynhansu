<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $departments = Department::with('manager')->get();
        $employees = Employee::select('id', 'fullname')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'departments' => $departments,
                'employees' => $employees,
            ],
            'message' => 'Departments and employees list retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = Department::with('manager')->find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Department not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Department retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'address' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20|unique:departments,phone',
            'manager' => 'nullable|exists:employees,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = Department::create($request->all());
        $data->load('manager:id,fullname');

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Department created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = Department::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Department not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:100',
            'address' => 'sometimes|nullable|string|max:255',
            'phone' => 'sometimes|nullable|string|max:20|unique:departments,phone,' . $id,
            'manager' => 'sometimes|nullable|exists:employees,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data->update($request->all());
        $data->load('manager:id,fullname');

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Department updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = Department::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Department not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Department deleted successfully'
        ]);
    }
}