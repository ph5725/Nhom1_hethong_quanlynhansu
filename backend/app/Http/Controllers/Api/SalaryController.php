<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Salary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SalaryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = Salary::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Salarys retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = Salary::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Salary not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Salary retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'salary_level' => 'required|string|max:255',
            'basic_salary' => 'required|numeric|min:0',
            'base_coefficient' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = Salary::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Salary created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = Salary::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Salary not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'salary_level' => 'required|string|max:255',
            'basic_salary' => 'required|numeric|min:0',
            'base_coefficient' => 'required|numeric|min:0',
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
            'message' => 'Salary updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = Salary::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Salary not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Salary deleted successfully'
        ]);
    }
}
