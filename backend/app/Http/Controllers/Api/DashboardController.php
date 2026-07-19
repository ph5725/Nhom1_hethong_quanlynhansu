<?php

namespace App\Http\Controllers\API;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\EducationLevel;
use App\Models\Contract;
use App\Models\ContractType;
use App\Models\WorkShift;
use App\Models\WorkDateStatus;
use App\Models\InsuranceType;
use App\Models\AllowanceType;
use App\Models\LeaveType;
use App\Models\Salary;
use App\Models\Allowance;
use App\Models\Insurance;
use App\Models\Task;
use App\Models\Leave;
use App\Models\WorkSchedule;
use App\Models\Attendance;
use App\Models\AllowanceEmployee;
use App\Models\EmployeeInsurance;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    // ADMINISTRATOR
    public function administratorDashboard()
    {
        $totalNetSalary = $this->calculateTotalNetSalaryForAll();
        $data = [
            'total_departments' => Department::count(),
            'total_users' => Employee::count(),
            'total_positions' => Position::count(),
            'total_allowance_types' => AllowanceType::count(),
            'total_leave_types' => LeaveType::count(),
            'total_contract_types' => ContractType::count(),
            'total_work_shifts' => WorkShift::count(),
            'total_work_date_statuses' => WorkDateStatus::count(),
            'total_insurance_types' => InsuranceType::count(),
            'total_net_salary' => $totalNetSalary,
        ];
        return response()->json($data);
    }

    // HUMAN RESOURCE MANAGEMENT
    public function hrmDashboard()
    {
        $totalNetSalary = $this->calculateTotalNetSalaryForAll();
        $data = [
            'total_contracts' => Contract::count(),
            'total_employees' => Employee::count(),
            'total_positions' => Position::count(),
            'total_departments' => Department::count(),
            'total_education_levels' => EducationLevel::count(),
            'total_work_schedules' => WorkSchedule::count(),
            'total_net_salary' => $totalNetSalary,
        ];
        return response()->json($data);
    }

    // FINANCIAL MANAGEMENT
    public function fmDashboard()
    {
        $totalNetSalary = $this->calculateTotalNetSalaryForAll();
        $data = [
            'total_salaries' => Salary::count(),
            'total_allowances' => Allowance::count(),
            'total_insurances' => Insurance::count(),
            'total_net_salary' => $totalNetSalary,
        ];
        return response()->json($data);
    }

    // MANAGEMENT
    public function managementDashboard()
    {
        $managerId = auth()->user()->employee_id; // Giả định manager là người đăng nhập
        $managedEmployees = Task::where('assigned_by_id', $managerId)->pluck('assigned_to_id')->unique();
        $totalNetSalary = $managedEmployees->isEmpty() ? 0 : $this->calculateTotalNetSalaryForEmployees($managedEmployees);
        $data = [
            'total_tasks' => Task::count(),
            'total_leaves' => Leave::count(),
            'total_net_salary' => $totalNetSalary,
        ];
        return response()->json($data);
    }

    // EMPLOYEE
    public function employeeDashboard()
    {
        $employeeId = auth()->user()->employee_id;
        $netSalary = $this->calculateNetSalaryForEmployee($employeeId);
        $data = [
            'total_attendances' => Attendance::where('employee_id', $employeeId)->count(),
            'total_tasks' => Task::where('assigned_to_id', $employeeId)->count(),
            'total_leaves_applied' => Leave::where('employee_id', $employeeId)->count(),
            'total_schedules' => WorkSchedule::where('employee_id', $employeeId)->count(),
            'net_salary' => $netSalary,
        ];
        return response()->json($data);
    }

    // Helper methods
    private function calculateTotalNetSalaryForAll()
    {
        $employees = Employee::all();
        $totalNetSalary = 0;
        foreach ($employees as $employee) {
            $netSalary = $this->calculateNetSalaryForEmployee($employee->id);
            $totalNetSalary += $netSalary;
        }
        return $totalNetSalary;
    }

    private function calculateTotalNetSalaryForEmployees($employeeIds)
    {
        $totalNetSalary = 0;
        foreach ($employeeIds as $employeeId) {
            $netSalary = $this->calculateNetSalaryForEmployee($employeeId);
            $totalNetSalary += $netSalary;
        }
        return $totalNetSalary;
    }

    public function calculateNetSalaryForEmployee($employeeId)
    {
        $contract = Contract::where('employee_id', $employeeId)
            ->where('status', 'Active')
            ->first();

        if (!$contract) {
            return 0; // Hoặc xử lý khác
        }

        $salary = $contract->salary;
        $baseSalary = $salary->basic_salary;
        $coefficient = $salary->base_coefficient;
        $basicPay = $baseSalary * $coefficient;

        $allowances = AllowanceEmployee::where('employee_id', $employeeId)->get();
        $totalAllowance = 0;

        foreach ($allowances as $allowanceEmployee) {
            $allowance = Allowance::find($allowanceEmployee->allowance_id);
            if (!$allowance) continue; // Bỏ qua nếu không tìm thấy allowance

            $yearOfService = $contract->year_of_service;
            if ($allowance->is_seniority_base == 0) {
                $totalAllowance += $allowanceEmployee->total_allowance;
            } else {
                $seniorityRate = $yearOfService >= 5 ? $yearOfService / 100 : 0;
                $seniorityBonus = $allowanceEmployee->total_allowance * $seniorityRate;
                $totalAllowance += $allowanceEmployee->total_allowance + $seniorityBonus;
            }
        }

        $employeeInsurance = EmployeeInsurance::where('employee_id', $employeeId)->first();
        $insuranceCost = 0;

        if ($employeeInsurance) {
            $insurance = Insurance::find($employeeInsurance->insurance_id);
            $insuranceRate = $insurance ? $insurance->default_employee_pct / 100 : 0;
            $insuranceCost = $basicPay * $insuranceRate;
        }

        return $basicPay + $totalAllowance - $insuranceCost;
    }
}
