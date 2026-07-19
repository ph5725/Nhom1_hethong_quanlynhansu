<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AllowanceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AllowanceTypeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = AllowanceType::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'AllowanceTypes retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = AllowanceType::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'AllowanceType not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'AllowanceType retrieved successfully'
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

        $data = AllowanceType::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'AllowanceType created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = AllowanceType::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'AllowanceType not found'
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
            'message' => 'AllowanceType updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = AllowanceType::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'AllowanceType not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'AllowanceType deleted successfully'
        ]);
    }
}
