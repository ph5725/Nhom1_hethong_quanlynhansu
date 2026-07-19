<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AllowanceController;
use App\Http\Controllers\Api\AllowanceTypeController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\ContractTypeController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\EducationLevelController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\InsuranceController;
use App\Http\Controllers\Api\InsuranceTypeController;
use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\LeaveTypeController;
use App\Http\Controllers\Api\PositionController;
use App\Http\Controllers\Api\SalaryController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\WorkDateStatusController;
use App\Http\Controllers\Api\WorkScheduleController;
use App\Http\Controllers\Api\WorkShiftController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PayrollController;

use App\Http\Controllers\Api\AllowanceEmployeeController;
use App\Http\Controllers\Api\ContractEmployeePositionController;
use App\Http\Controllers\Api\EmployeeInsuranceController;
use App\Http\Controllers\Api\EmployeeTaskController;
use App\Http\Controllers\Api\RoleUserController;

use App\Http\Controllers\MenuController;
use App\Http\Controllers\QrCodeController;

Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/menu', [MenuController::class, 'getMenu']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/qrcode', [QrCodeController::class, 'generate']);
    // Lấy bảng lương của một nhân viên cụ thể
    Route::get('/payrolls/{employeeId}', [PayrollController::class, 'viewAnyEmployeePayroll']);

    // Administrator: Truy cập tất cả
    Route::middleware(['role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard/admin', [DashboardController::class, 'administratorDashboard']);

        Route::apiResource('users', UserController::class);
        Route::apiResource('allowance-types', AllowanceTypeController::class);
        Route::apiResource('leave-types', LeaveTypeController::class);
        Route::apiResource('contract-types', ContractTypeController::class);
        Route::apiResource('work-shifts', WorkShiftController::class);
        Route::apiResource('work-date-statuses', WorkDateStatusController::class);
        Route::apiResource('insurance-types', InsuranceTypeController::class);
        Route::apiResource('contracts', ContractController::class);
        Route::apiResource('employees', EmployeeController::class);
        Route::apiResource('positions', PositionController::class);
        Route::apiResource('departments', DepartmentController::class);
        Route::apiResource('education-levels', EducationLevelController::class);
        Route::apiResource('work-schedules', WorkScheduleController::class);
        Route::apiResource('salaries', SalaryController::class);
        Route::apiResource('allowances', AllowanceController::class);
        Route::apiResource('insurances', InsuranceController::class);
        Route::apiResource('tasks', TaskController::class);
        Route::apiResource('leaves', LeaveController::class);
        Route::apiResource('roles', RoleController::class);
        Route::apiResource('attendances', AttendanceController::class);

        // Lấy bảng lương của tất cả nhân viên
        Route::get('/payrolls', [PayrollController::class, 'viewAllPayrolls']);
        // Route để chấp nhận đơn xin nghỉ phép
        Route::post('leaves/{id}/approve', [LeaveController::class, 'approveLeave']);
        // Route để từ chối đơn xin nghỉ phép
        Route::post('leaves/{id}/reject', [LeaveController::class, 'rejectLeave']);
        Route::get('personal-information', [EmployeeController::class, 'personalInformation']);
        Route::get('my-payroll', [PayrollController::class, 'viewMyOwnPayroll']);
        Route::get('my-schedule/show/{id}', [WorkScheduleController::class, 'show']);
    });

    // Human Resource Management
    Route::middleware(['role:hrm'])->prefix('hrm')->group(function () {
        Route::get('/dashboard/hrm', [DashboardController::class, 'hrmDashboard']);

        Route::apiResource('users', UserController::class);
        Route::apiResource('contracts', ContractController::class);
        Route::apiResource('employees', EmployeeController::class);
        Route::apiResource('positions', PositionController::class);
        Route::apiResource('departments', DepartmentController::class);
        Route::apiResource('education-levels', EducationLevelController::class);
        Route::apiResource('work-schedules', WorkScheduleController::class);
        Route::get('my-schedule/show/{id}', [WorkScheduleController::class, 'show']);
    });

    // Financial Management
    Route::middleware(['role:fm'])->prefix('fm')->group(function () {
        Route::get('/dashboard/fm', [DashboardController::class, 'fmDashboard']);

        Route::apiResource('salaries', SalaryController::class);
        Route::apiResource('allowances', AllowanceController::class);
        Route::apiResource('insurances', InsuranceController::class);
        Route::get('payroll', [PayrollController::class]);
        // Lấy bảng lương của một nhân viên cụ thể
        Route::get('/payrolls/{employeeId}', [PayrollController::class, 'viewAnyEmployeePayroll']);
        // Lấy bảng lương của tất cả nhân viên
        Route::get('/payrolls', [PayrollController::class, 'viewAllPayrolls']);
        Route::get('my-schedule/show/{id}', [WorkScheduleController::class, 'show']);
    });

    // Management
    Route::middleware(['role:m'])->prefix('m')->group(function () {
        Route::get('/dashboard/manager', [DashboardController::class, 'managementDashboard']);

        Route::apiResource('tasks', TaskController::class);
        Route::apiResource('leaves', LeaveController::class);
        // Route để chấp nhận đơn xin nghỉ phép
        Route::post('leaves/{id}/approve', [LeaveController::class, 'approveLeave']);
        // Route để từ chối đơn xin nghỉ phép
        Route::post('leaves/{id}/reject', [LeaveController::class, 'rejectLeave']);
        Route::get('my-schedule/show/{id}', [WorkScheduleController::class, 'show']);
    });

    // Employee
    Route::middleware(['role:per'])->prefix('per')->group(function () {
        Route::get('/dashboard/personal', [DashboardController::class, 'employeeDashboard']);

        Route::get('personal-information', [EmployeeController::class, 'personalInformation']);
        Route::apiResource('attendances', AttendanceController::class);
        Route::put('/attendances/{id}/checkout', [AttendanceController::class, 'updateCheckOut']);
        Route::get('tasks', [TaskController::class, 'userTasks']);
        Route::get('/my-payroll', [PayrollController::class, 'viewMyOwnPayroll']);

        Route::post('leaves', [LeaveController::class, 'store']);
        Route::post('leaves/submit', [LeaveController::class, 'submitLeaveRequest']);
        Route::get('my-schedule/show/{id}', [WorkScheduleController::class, 'show']);
    });
});
