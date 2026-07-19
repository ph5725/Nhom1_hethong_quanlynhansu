<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ContractType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContractTypeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = ContractType::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'ContractTypes retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = ContractType::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'ContractType not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'ContractType retrieved successfully'
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

        $data = ContractType::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'ContractType created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = ContractType::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'ContractType not found'
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
            'message' => 'ContractType updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = ContractType::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'ContractType not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'ContractType deleted successfully'
        ]);
    }
}
