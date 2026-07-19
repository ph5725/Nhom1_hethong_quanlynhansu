<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\InsuranceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InsuranceTypeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = InsuranceType::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'InsuranceTypes retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = InsuranceType::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'InsuranceType not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'InsuranceType retrieved successfully'
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

        $data = InsuranceType::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'InsuranceType created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = InsuranceType::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'InsuranceType not found'
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
            'message' => 'InsuranceType updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = InsuranceType::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'InsuranceType not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'InsuranceType deleted successfully'
        ]);
    }
}
