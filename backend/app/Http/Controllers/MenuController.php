<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MenuController extends Controller
{
    /**
     * Lấy danh sách menu dựa trên vai trò của người dùng
     */
    public function getMenu(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $menu = [];

        // Kiểm tra vai trò admin trước
        if ($user->hasRole('admin', 'api')) {
            $menu = [
                [
                    'title' => 'ADMINISTRATOR',
                    'items' => [
                        ['name' => 'Dashboard', 'link' => '/admin', 'icon' => 'bi-grid'],
                        ['name' => 'User manager', 'link' => '/admin/users', 'icon' => 'bi-people'],
                        ['name' => 'Allowance - type', 'link' => '/admin/allowance-types', 'icon' => 'bi-wallet'],
                        ['name' => 'Leave - type', 'link' => '/admin/leave-types', 'icon' => 'bi-calendar-x'],
                        ['name' => 'Contract - type', 'link' => '/admin/contract-types', 'icon' => 'bi-file-earmark-text'],
                        ['name' => 'Work - shift', 'link' => '/admin/work-shifts', 'icon' => 'bi-clock'],
                        ['name' => 'Working day status', 'link' => '/admin/work-date-statuses', 'icon' => 'bi-calendar-check'],
                        ['name' => 'Insurance - type', 'link' => '/admin/insurance-types', 'icon' => 'bi-heart-pulse'],
                        ['name' => 'Role', 'link' => '/admin/roles', 'icon' => 'bi-key'],
                    ],
                ],
                [
                    'title' => 'HUMAN RESOURCE MANAGEMENT',
                    'items' => [
                        ['name' => 'Dashboard', 'link' => '/hrm', 'icon' => 'bi-grid'],
                        ['name' => 'Contract', 'link' => '/hrm/contracts', 'icon' => 'bi-file-text'],
                        ['name' => 'Employee', 'link' => '/hrm/employees', 'icon' => 'bi-person'],
                        ['name' => 'Position', 'link' => '/hrm/positions', 'icon' => 'bi-briefcase'],
                        ['name' => 'Department', 'link' => '/hrm/departments', 'icon' => 'bi-building'],
                        ['name' => 'Education - Level', 'link' => '/hrm/education-levels', 'icon' => 'bi-mortarboard'],
                        ['name' => 'Work - schedule', 'link' => '/hrm/work-schedules', 'icon' => 'bi-calendar3'],
                    ],
                ],
                [
                    'title' => 'FINANCIAL MANAGEMENT',
                    'items' => [
                        ['name' => 'Dashboard', 'link' => '/fm', 'icon' => 'bi-grid'],
                        ['name' => 'Salary', 'link' => '/fm/salaries', 'icon' => 'bi-currency-dollar'],
                        ['name' => 'Allowance', 'link' => '/fm/allowances', 'icon' => 'bi-cash-coin'],
                        ['name' => 'Insurance', 'link' => '/fm/insurances', 'icon' => 'bi-shield-check'],
                        ['name' => 'Payroll', 'link' => '/fm/payrolls', 'icon' => 'bi-cash-stack'],
                    ],
                ],
                [
                    'title' => 'MANAGEMENT',
                    'items' => [
                        ['name' => 'Dashboard', 'link' => '/m', 'icon' => 'bi-grid'],
                        // ['name' => 'Task', 'link' => '/m/tasks', 'icon' => 'bi-clipboard-check'],
                        ['name' => 'Leave List', 'link' => '/m/leaves', 'icon' => 'bi-card-list'],
                    ],
                ],
                [
                    'title' => 'EMPLOYEE',
                    'items' => [
                        ['name' => 'Dashboard', 'link' => '/per', 'icon' => 'bi-grid'],
                        ['name' => 'Personal Information', 'link' => '/per/personal-information', 'icon' => 'bi-person-circle'],
                        ['name' => 'Attendance', 'link' => '/per/attendances', 'icon' => 'bi-calendar-event'],
                        // ['name' => 'Task List', 'link' => '/per/tasks', 'icon' => 'bi-list-task'],
                        ['name' => 'My Payroll', 'link' => '/per/my-payroll', 'icon' => 'bi-receipt-cutoff'],
                        ['name' => 'Apply For Leave', 'link' => '/per/leaves', 'icon' => 'bi-pencil-square'],
                        ['name' => 'My Schedule', 'link' => '/per/my-schedule', 'icon' => 'bi-person-badge'],
                    ],
                ],
            ];
            // Nếu là admin, không cần kiểm tra các role khác
            return response()->json($menu);
        }

        // Nếu không phải admin, kiểm tra các role khác
        if ($user->hasRole('hrm', 'api')) {
            $menu[] = [
                'title' => 'HUMAN RESOURCE MANAGEMENT',
                'items' => [
                    ['name' => 'Dashboard', 'link' => '/hrm', 'icon' => 'bi-grid'],
                    ['name' => 'Contract', 'link' => '/hrm/contracts', 'icon' => 'bi-file-text'],
                    ['name' => 'Employee', 'link' => '/hrm/employees', 'icon' => 'bi-person'],
                    ['name' => 'Position', 'link' => '/hrm/positions', 'icon' => 'bi-briefcase'],
                    ['name' => 'Department', 'link' => '/hrm/departments', 'icon' => 'bi-building'],
                    ['name' => 'Education - Level', 'link' => '/hrm/education-levels', 'icon' => 'bi-mortarboard'],
                    ['name' => 'Work - schedule', 'link' => '/hrm/work-schedules', 'icon' => 'bi-calendar3'],
                ],
            ];
        }

        if ($user->hasRole('fm', 'api')) {
            $menu[] = [
                'title' => 'FINANCIAL MANAGEMENT',
                'items' => [
                    ['name' => 'Dashboard', 'link' => '/fm', 'icon' => 'bi-grid'],
                    ['name' => 'Salary', 'link' => '/fm/salaries', 'icon' => 'bi-currency-dollar'],
                    ['name' => 'Allowance', 'link' => '/fm/allowances', 'icon' => 'bi-cash-coin'],
                    ['name' => 'Insurance', 'link' => '/fm/insurances', 'icon' => 'bi-shield-check'],
                    ['name' => 'Payroll', 'link' => '/fm/payrolls', 'icon' => 'bi-cash-stack'],
                ],
            ];
        }

        if ($user->hasRole('m', 'api')) {
            $menu[] = [
                'title' => 'MANAGEMENT',
                'items' => [
                    ['name' => 'Dashboard', 'link' => '/m', 'icon' => 'bi-grid'],
                    // ['name' => 'Task', 'link' => '/m/tasks', 'icon' => 'bi-clipboard-check'],
                    ['name' => 'Leave List', 'link' => '/m/leaves', 'icon' => 'bi-card-list'],
                ],
            ];
        }

        if ($user->hasRole('per', 'api')) {
            $menu[] = [
                'title' => 'EMPLOYEE',
                'items' => [
                    ['name' => 'Dashboard', 'link' => '/per', 'icon' => 'bi-grid'],
                    ['name' => 'Personal Information', 'link' => '/per/personal-information', 'icon' => 'bi-person-circle'],
                    ['name' => 'Attendance', 'link' => '/per/attendances', 'icon' => 'bi-calendar-event'],
                    // ['name' => 'Task List', 'link' => '/per/tasks', 'icon' => 'bi-list-task'],
                    // ['name' => 'Apply For Leave', 'link' => '/per/leaves', 'icon' => 'bi-pencil-square'],
                    ['name' => 'My Payroll', 'link' => '/per/my-payroll', 'icon' => 'bi-receipt-cutoff'],
                    ['name' => 'My Schedule', 'link' => '/per/my-schedule', 'icon' => 'bi-person-badge'],
                ],
            ];
        }

        return response()->json($menu);
    }
}