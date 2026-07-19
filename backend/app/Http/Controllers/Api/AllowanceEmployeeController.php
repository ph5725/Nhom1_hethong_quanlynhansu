<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AllowanceEmployee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AllowanceEmployeeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = AllowanceEmployee::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'AllowanceEmployees retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = AllowanceEmployee::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'AllowanceEmployee not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'AllowanceEmployee retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'allowance_id' => 'required|exists:allowances,id',
            'employee_id' => 'required|exists:employees,id',
            'total_allowance' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = AllowanceEmployee::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'AllowanceEmployee created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = AllowanceEmployee::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'AllowanceEmployee not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'allowance_id' => 'required|exists:allowances,id',
            'employee_id' => 'required|exists:employees,id',
            'total_allowance' => 'required|numeric|min:0',
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
            'message' => 'AllowanceEmployee updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = AllowanceEmployee::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'AllowanceEmployee not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'AllowanceEmployee deleted successfully'
        ]);
    }
}
