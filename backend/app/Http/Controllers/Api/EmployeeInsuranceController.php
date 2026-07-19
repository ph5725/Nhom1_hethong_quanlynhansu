<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\EmployeeInsurance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EmployeeInsuranceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = EmployeeInsurance::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'EmployeeInsurances retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = EmployeeInsurance::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'EmployeeInsurance not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'EmployeeInsurance retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'insurance_id' => 'required|exists:insurances,id',
            'actual_employee_pct' => 'required|numeric|min:0',
            'actual_company_pct' => 'required|numeric|min:0',
            'actual_total_pct' => 'required|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = EmployeeInsurance::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'EmployeeInsurance created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = EmployeeInsurance::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'EmployeeInsurance not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'insurance_id' => 'required|exists:insurances,id',
            'actual_employee_pct' => 'required|numeric|min:0',
            'actual_company_pct' => 'required|numeric|min:0',
            'actual_total_pct' => 'required|numeric|min:0',
            'note' => 'nullable|string',
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
            'message' => 'EmployeeInsurance updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = EmployeeInsurance::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'EmployeeInsurance not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'EmployeeInsurance deleted successfully'
        ]);
    }
}
