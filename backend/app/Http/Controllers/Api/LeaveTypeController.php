<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LeaveType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LeaveTypeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = LeaveType::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'LeaveTypes retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = LeaveType::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'LeaveType not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'LeaveType retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = LeaveType::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'LeaveType created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = LeaveType::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'LeaveType not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
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
            'message' => 'LeaveType updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = LeaveType::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'LeaveType not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'LeaveType deleted successfully'
        ]);
    }
}
