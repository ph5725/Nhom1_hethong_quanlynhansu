<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = Task::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Tasks retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = Task::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Task retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assigned_by_id' => 'required|exists:employees,id',
            'assigned_to_id' => 'required|exists:employees,id',
            'assigned_date' => 'required|date',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'due_date' => 'required|date|after:start_date',
            'status' => 'required|string',
            'priority' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = Task::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Task created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = Task::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'assigned_by_id' => 'sometimes|exists:employees,id',
            'assigned_to_id' => 'sometimes|exists:employees,id',
            'assigned_date' => 'sometimes|date',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after:start_date',
            'due_date' => 'sometimes|date|after:start_date',
            'status' => 'sometimes|string',
            'priority' => 'sometimes|string',
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
            'message' => 'Task updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = Task::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Task not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Task deleted successfully'
        ]);
    }
}
