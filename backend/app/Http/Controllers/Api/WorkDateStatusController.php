<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\WorkDateStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WorkDateStatusController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = WorkDateStatus::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'WorkDateStatuss retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = WorkDateStatus::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'WorkDateStatus not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'WorkDateStatus retrieved successfully'
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

        $data = WorkDateStatus::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'WorkDateStatus created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = WorkDateStatus::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'WorkDateStatus not found'
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
            'message' => 'WorkDateStatus updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = WorkDateStatus::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'WorkDateStatus not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'WorkDateStatus deleted successfully'
        ]);
    }
}
