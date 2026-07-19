<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Insurance;
use App\Models\InsuranceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InsuranceController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $insurances = Insurance::with('insuranceType')->get();
        $insuranceTypes = InsuranceType::select('id', 'name')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'insurances' => $insurances,
                'insuranceTypes' => $insuranceTypes,
            ],
            'message' => 'Insurances and types retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = Insurance::with('insuranceType')->find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Insurance not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Insurance retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|exists:insurance_types,id',
            'default_employee_pct' => 'required|numeric|min:0',
            'default_company_pct' => 'required|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $input = $request->all();
        // Calculate default_total_pct
        $input['default_total_pct'] = $input['default_employee_pct'] + $input['default_company_pct'];

        $data = Insurance::create($input);
        $data->load('insuranceType');

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Insurance created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = Insurance::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Insurance not 왔다'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|exists:insurance_types,id',
            'default_employee_pct' => 'sometimes|numeric|min:0',
            'default_company_pct' => 'sometimes|numeric|min:0',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $input = $request->all();

        // Check if percentage fields are present in the request before calculating total
        if (isset($input['default_employee_pct']) || isset($input['default_company_pct'])) {
            $employeePct = $input['default_employee_pct'] ?? $data->default_employee_pct;
            $companyPct = $input['default_company_pct'] ?? $data->default_company_pct;
            $input['default_total_pct'] = $employeePct + $companyPct;
        }

        $data->update($input);
        $data->load('insuranceType');

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Insurance updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = Insurance::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Insurance not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Insurance deleted successfully'
        ]);
    }
}