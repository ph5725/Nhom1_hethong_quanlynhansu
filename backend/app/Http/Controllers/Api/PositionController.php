<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Position;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PositionController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the positions.
     * Hiển thị danh sách các chức vụ.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $data = Position::all();
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Positions retrieved successfully' // Chức vụ được truy xuất thành công
        ]);
    }

    /**
     * Display the specified position.
     * Hiển thị chức vụ cụ thể.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $data = Position::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Position not found' // Không tìm thấy chức vụ
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Position retrieved successfully' // Chức vụ được truy xuất thành công
        ]);
    }

    /**
     * Store a newly created position in storage.
     * Lưu trữ một chức vụ mới được tạo.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100', // Cập nhật max length thành 100 để khớp với migration
            // Đã xóa 'manager' vì cột này không có trong cấu trúc migration của bảng 'positions'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = Position::create($request->only('name')); // Chỉ lưu cột 'name'

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Position created successfully' // Chức vụ được tạo thành công
        ], 201);
    }

    /**
     * Update the specified position in storage.
     * Cập nhật chức vụ cụ thể trong bộ nhớ.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        $data = Position::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Position not found' // Không tìm thấy chức vụ
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:100', // Cập nhật max length thành 100 để khớp với migration
            // Đã xóa 'manager' vì cột này không có trong cấu trúc migration của bảng 'positions'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data->update($request->only('name')); // Chỉ cập nhật cột 'name'

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Position updated successfully' // Chức vụ được cập nhật thành công
        ]);
    }

    /**
     * Remove the specified position from storage.
     * Xóa chức vụ cụ thể khỏi bộ nhớ.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $data = Position::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Position not found' // Không tìm thấy chức vụ
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Position deleted successfully' // Chức vụ đã được xóa thành công
        ]);
    }
}
