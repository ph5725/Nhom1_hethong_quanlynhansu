<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\WorkSchedule;
use App\Models\Employee;
use App\Models\WorkShift;
use App\Models\WorkDateStatus;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WorkScheduleController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $workSchedules = WorkSchedule::with(['employee.department', 'workShift', 'workDateStatus'])->get();
        $employees = Employee::select('id', 'fullname')->get();
        $workShifts = WorkShift::select('id', 'shift_name')->get();
        $workDateStatuses = WorkDateStatus::select('id', 'name')->get();
        $departments = Department::select('id', 'name')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'workSchedules' => $workSchedules,
                'employees' => $employees,
                'workShifts' => $workShifts,
                'workDateStatuses' => $workDateStatuses,
                'departments' => $departments,
            ],
            'message' => 'Work schedules and related lists retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = WorkSchedule::with(['employee.department', 'workShift', 'workDateStatus'])->find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'WorkSchedule not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'WorkSchedule retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'shift_id' => 'required|exists:work_shifts,id',
            'status_id' => 'required|exists:work_date_statuses,id',
            'work_date' => 'required|date',
            'is_day_off' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = WorkSchedule::create($request->all());
        $data->load(['employee.department', 'workShift', 'workDateStatus']);

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'WorkSchedule created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = WorkSchedule::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'WorkSchedule not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'shift_id' => 'required|exists:work_shifts,id',
            'status_id' => 'required|exists:work_date_statuses,id',
            'work_date' => 'required|date',
            'is_day_off' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data->update($request->all());
        $data->load(['employee.department', 'workShift', 'workDateStatus']);

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'WorkSchedule updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = WorkSchedule::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'WorkSchedule not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'WorkSchedule deleted successfully'
        ]);
    }
}