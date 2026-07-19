<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Contract;
use App\Models\AllowanceEmployee;
use App\Models\Allowance;
use App\Models\EmployeeInsurance;
use App\Models\Insurance;

class PayrollController extends Controller
{
    /**
     * Helper function: Thực hiện logic tính lương chi tiết cho một nhân viên.
     * Hàm này sẽ được các phương thức công khai khác gọi nội bộ.
     *
     * @param int $employeeId ID của nhân viên cần tính lương.
     * @return array|null Mảng chứa chi tiết lương hoặc null nếu không tìm thấy hợp đồng.
     */
    private function _calculatePayrollForEmployee($employeeId)
    {
        // Tìm hợp đồng đang hoạt động của nhân viên
        $contract = Contract::where('employee_id', $employeeId)
            ->where('status', 'Active')
            ->with('salary') // Eager load mối quan hệ salary
            ->first();

        if (!$contract) {
            return null; // Không tìm thấy hợp đồng đang hoạt động
        }

        // --- 1. Tính lương cơ bản ---
        $baseSalary = $contract->salary->basic_salary;
        $coefficient = $contract->salary->base_coefficient;
        $basicPay = $baseSalary * $coefficient;

        // --- 2. Tính tổng phụ cấp ---
        $allowances = AllowanceEmployee::where('employee_id', $employeeId)->get();
        $totalAllowance = 0;

        foreach ($allowances as $allowanceEmployee) {
            $allowance = Allowance::find($allowanceEmployee->allowance_id);
            $yearOfService = $contract->year_of_service; // Giả định 'year_of_service' có sẵn trong Contract

            if ($allowance->is_seniority_base == 0) {
                // Phụ cấp không dựa trên thâm niên
                $totalAllowance += $allowanceEmployee->total_allowance;
            } else {
                // Phụ cấp dựa trên thâm niên (ví dụ: sau 5 năm phục vụ)
                $seniorityRate = $yearOfService >= 5 ? $yearOfService / 100 : 0; // 1% cho mỗi năm từ năm thứ 5 trở đi
                $seniorityBonus = $allowanceEmployee->total_allowance * $seniorityRate;
                $totalAllowance += $allowanceEmployee->total_allowance + $seniorityBonus;
            }
        }

        // --- 3. Tính chi phí bảo hiểm (phần đóng của nhân viên) ---
        $employeeInsurance = EmployeeInsurance::where('employee_id', $employeeId)->first();
        $insuranceCost = 0;

        if ($employeeInsurance) {
            $insurance = Insurance::find($employeeInsurance->insurance_id);
            // Giả định 'default_employee_pct' là tỷ lệ phần trăm nhân viên đóng (ví dụ: 10 => 10%)
            $insuranceRate = $insurance->default_employee_pct / 100;
            $insuranceCost = $basicPay * $insuranceRate;
        }

        // --- 4. Tính lương ròng ---
        $netSalary = $basicPay + $totalAllowance - $insuranceCost;

        // Trả về dữ liệu chi tiết
        return [
            'employee_id' => $employeeId,
            'basic_pay' => $basicPay,
            'total_allowance' => $totalAllowance,
            'insurance_cost' => $insuranceCost,
            'net_salary' => $netSalary,
        ];
    }

    /**
     * 1. Xem danh sách lương của tất cả nhân viên.
     * Yêu cầu xác thực và chỉ cho phép người dùng có vai trò 'admin' hoặc 'fm'.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function viewAllPayrolls(Request $request)
    {
        $user = auth()->user();

        // Kiểm tra xem người dùng có được xác thực không
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Lấy vai trò của người dùng
        $userRoles = $user->roles->pluck('name')->toArray();

        // Chỉ cho phép 'admin' hoặc 'fm' xem tất cả bảng lương
        if (!in_array('admin', $userRoles) && !in_array('fm', $userRoles)) {
            return response()->json(['error' => 'Unauthorized to view all payrolls'], 403);
        }

        // Lấy danh sách tất cả nhân viên có hợp đồng active để tính toán
        // Sử dụng eager loading 'employee' để lấy tên nhân viên sau này
        $contracts = Contract::where('status', 'Active')->with('employee', 'salary')->get();
        $payrolls = [];

        foreach ($contracts as $contract) {
            $employeeId = $contract->employee_id;
            $payrollData = $this->_calculatePayrollForEmployee($employeeId);

            if ($payrollData) {
                // Thêm tên nhân viên vào dữ liệu lương
                $payrollData['employee_name'] = $contract->employee->fullname ?? 'N/A';
                $payrolls[] = $payrollData;
            }
        }

        return response()->json([
            'success' => true,
            'data' => $payrolls,
        ]);
    }

    /**
     * 2. Xem lương của một nhân viên bất kỳ (công khai).
     * KHÔNG yêu cầu xác thực. Bất kỳ ai cũng có thể truy cập.
     *
     * @param int $employeeId ID của nhân viên cần xem lương.
     * @return \Illuminate\Http\JsonResponse
     */
    public function viewAnyEmployeePayroll($employeeId)
    {
        $payrollData = $this->_calculatePayrollForEmployee($employeeId);

        if (!$payrollData) {
            return response()->json(['error' => 'No active contract found for this employee or employee does not exist'], 404);
        }

        // Nếu bạn muốn thêm tên nhân viên vào đây, bạn cần tìm Employee model
        $employee = Employee::find($employeeId);
        if ($employee) {
            $payrollData['employee_name'] = $employee->fullname ?? 'N/A';
        } else {
            $payrollData['employee_name'] = 'N/A';
        }

        return response()->json($payrollData);
    }

    /**
     * 3. Xem lương của chính mình.
     * Yêu cầu xác thực. Chỉ cho phép nhân viên xem lương của chính họ.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function viewMyOwnPayroll()
    {
        $user = auth()->user();

        // Kiểm tra xem người dùng có được xác thực không
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated. Please log in.'], 401);
        }

        // Đảm bảo người dùng đã xác thực có mối quan hệ với Employee model
        if (!$user->employee) {
            return response()->json(['error' => 'Your user account is not linked to an employee record.'], 404);
        }

        $employeeId = $user->employee->id;
        $payrollData = $this->_calculatePayrollForEmployee($employeeId);

        if (!$payrollData) {
            return response()->json(['error' => 'No active contract found for your employee record.'], 404);
        }

        // Thêm tên của chính nhân viên vào dữ liệu
        $payrollData['employee_name'] = $user->employee->fullname ?? 'N/A';

        return response()->json($payrollData);
    }
}
