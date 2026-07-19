<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Allowance;
use App\Models\AllowanceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AllowanceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $allowances = Allowance::with('allowanceType')->get();
        $allowanceTypes = AllowanceType::select('id', 'name')->get(); // Fetch all allowance types

        return response()->json([
            'success' => true,
            'data' => [
                'allowances' => $allowances,
                'allowanceTypes' => $allowanceTypes, // Include allowance types in the response
            ],
            'message' => 'Allowances and types retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = Allowance::with('allowanceType')->find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Allowance not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Allowance retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'allowance_type_id' => 'required|exists:allowance_types,id',
            'amount' => 'required|numeric|min:0',
            'is_seniority_base' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = Allowance::create($request->all());
        $data->load('allowanceType');

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Allowance created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = Allowance::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Allowance not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'allowance_type_id' => 'sometimes|exists:allowance_types,id', // Changed to 'sometimes' for updates
            'amount' => 'sometimes|numeric|min:0',
            'is_seniority_base' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data->update($request->all());
        $data->load('allowanceType');

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Allowance updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = Allowance::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Allowance not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Allowance deleted successfully'
        ]);
    }
}