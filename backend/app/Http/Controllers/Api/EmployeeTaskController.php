<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\EmployeeTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmployeeTaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = EmployeeTask::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'EmployeeTasks retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = EmployeeTask::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'EmployeeTask not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'EmployeeTask retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'task_id' => 'required|exists:tasks,id',
            'employee_id' => 'required|exists:employees,id',
            'role' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = EmployeeTask::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'EmployeeTask created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = EmployeeTask::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'EmployeeTask not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'task_id' => 'required|exists:tasks,id',
            'employee_id' => 'required|exists:employees,id',
            'role' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data->update($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'EmployeeTask updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = EmployeeTask::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'EmployeeTask not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'EmployeeTask deleted successfully'
        ]);
    }
}
