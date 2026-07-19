<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\EducationLevel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EducationLevelController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $data = EducationLevel::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'EducationLevels retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = EducationLevel::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'EducationLevel not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'EducationLevel retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'level' => 'required|string|max:255',
            'major' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = EducationLevel::create($request->all());

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'EducationLevel created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = EducationLevel::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'EducationLevel not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'level' => 'required|string|max:255',
            'major' => 'required|string|max:255',
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
            'message' => 'EducationLevel updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = EducationLevel::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'EducationLevel not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'EducationLevel deleted successfully'
        ]);
    }
}
