<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ContractEmployeePosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContractEmployeePositionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = ContractEmployeePosition::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'ContractEmployeePositions retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = ContractEmployeePosition::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'ContractEmployeePosition not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'ContractEmployeePosition retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'contract_id' => 'required|exists:contracts,id',
            'position_id' => 'required|exists:positions,id',
            'is_main' => 'required|boolean',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'base_salary' => 'required|numeric|min:0',
            'ratio' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = ContractEmployeePosition::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'ContractEmployeePosition created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = ContractEmployeePosition::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'ContractEmployeePosition not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'contract_id' => 'required|exists:contracts,id',
            'position_id' => 'required|exists:positions,id',
            'is_main' => 'required|boolean',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'base_salary' => 'required|numeric|min:0',
            'ratio' => 'required|numeric|min:0',
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
            'message' => 'ContractEmployeePosition updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = ContractEmployeePosition::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'ContractEmployeePosition not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'ContractEmployeePosition deleted successfully'
        ]);
    }
}
