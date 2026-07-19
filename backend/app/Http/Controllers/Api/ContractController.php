<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\Employee;
use App\Models\Salary;
use App\Models\ContractType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class ContractController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $contracts = Contract::with([
            'employee:id,fullname',
            'salary:id,salary_level',
            'contractType:id,name'
        ])->get();

        $employees = Employee::select('id', 'fullname')->get();
        $salaries = Salary::select('id', 'salary_level')->get();
        $contractTypes = ContractType::select('id', 'name')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'contracts' => $contracts,
                'employees' => $employees,
                'salaries' => $salaries,
                'contractTypes' => $contractTypes
            ],
            'message' => 'Contracts and related lists retrieved successfully'
        ]);
    }

    public function show($id)
    {
        $data = Contract::with([
            'employee:id,fullname',
            'salary:id,salary_level',
            'contractType:id,name'
        ])->find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Contract not found'
            ], 404);
        }

        $data->year_of_service = $this->calculateYearOfService($data->start_date, $data->end_date);

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Contract retrieved successfully'
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'employee_id' => 'required|exists:employees,id',
            'type' => 'required|exists:contract_types,id',
            'salary_id' => 'required|exists:salaries,id',
            'contract_code' => 'required|string|max:255|unique:contracts,contract_code',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'sign_date' => 'required|date',
            'contract_file' => 'nullable|string',
            'status' => 'required|string',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $input = $request->all();
        $input['year_of_service'] = $this->calculateYearOfService($input['start_date'], $input['end_date'] ?? null);

        $data = Contract::create($input);
        $data->load([
            'employee:id,fullname',
            'salary:id,salary_level',
            'contractType:id,name'
        ]);

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Contract created successfully'
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $data = Contract::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Contract not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'employee_id' => 'sometimes|exists:employees,id',
            'type' => 'sometimes|exists:contract_types,id',
            'salary_id' => 'sometimes|exists:salaries,id',
            'contract_code' => 'sometimes|string|max:255|unique:contracts,contract_code,' . $id,
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after:start_date',
            'sign_date' => 'sometimes|date',
            'contract_file' => 'nullable|string',
            'status' => 'sometimes|string',
            'note' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $input = $request->all();

        if ($request->has('start_date') || $request->has('end_date')) {
            $startDate = $request->input('start_date', $data->start_date);
            $endDate = $request->input('end_date', $data->end_date);
            $input['year_of_service'] = $this->calculateYearOfService($startDate, $endDate);
        } elseif (!$request->has('year_of_service')) {
            $input['year_of_service'] = $this->calculateYearOfService($data->start_date, $data->end_date);
        }

        $data->update($input);
        $data->load([
            'employee:id,fullname',
            'salary:id,salary_level',
            'contractType:id,name'
        ]);

        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => 'Contract updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $data = Contract::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Contract not found'
            ], 404);
        }

        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contract deleted successfully'
        ]);
    }

    protected function calculateYearOfService($startDate, $endDate = null)
    {
        $start = Carbon::parse($startDate);
        if ($endDate) {
            $end = Carbon::parse($endDate);
            return $start->diffInYears($end);
        } else {
            return $start->diffInYears(Carbon::now());
        }
    }
}