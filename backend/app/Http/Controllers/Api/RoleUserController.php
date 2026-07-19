<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\RoleUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleUserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = RoleUser::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'RoleUsers retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = RoleUser::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'RoleUser not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'RoleUser retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = RoleUser::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'RoleUser created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = RoleUser::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'RoleUser not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
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
            'message' => 'RoleUser updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = RoleUser::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'RoleUser not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'RoleUser deleted successfully'
        ]);
    }
}
