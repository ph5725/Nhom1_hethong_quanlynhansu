<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\WorkShift;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WorkShiftController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = WorkShift::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'WorkShifts retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = WorkShift::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'WorkShift not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'WorkShift retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shift_name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'break_time' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = WorkShift::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'WorkShift created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = WorkShift::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'WorkShift not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'shift_name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'break_time' => 'required|integer|min:0',
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
            'message' => 'WorkShift updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = WorkShift::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'WorkShift not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'WorkShift deleted successfully'
        ]);
    }
}
