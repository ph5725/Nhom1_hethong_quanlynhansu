import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

import Footer from './components/Footer.jsx';
import Login from './pages/Login.jsx';
import MainLayout from './pages/MainLayout.jsx';

import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import HrmDashboard from './pages/hrm/HrmDashboard.jsx';
import FmDashboard from './pages/fm/FmDashboard.jsx';
import MDashboard from './pages/m/MDashboard.jsx';
import PerDashboard from './pages/per/PerDashboard.jsx';

// 1.
import UserShow from './pages/admin/user_manager/UserShow.jsx';
import UserCreate from './pages/admin/user_manager/UserCreate.jsx';
import UserEdit from './pages/admin/user_manager/UserEdit.jsx';

// 2.
import AllowanceTypeShow from './pages/admin/allowance_type/AllowanceTypeShow.jsx';
import AllowanceTypeCreate from './pages/admin/allowance_type/AllowanceTypeCreate.jsx';
import AllowanceTypeEdit from './pages/admin/allowance_type/AllowanceTypeEdit.jsx';

// 3.
import AllowanceShow from './pages/fm/allowance/AllowanceShow.jsx';
import AllowanceCreate from './pages/fm/allowance/AllowanceCreate.jsx';
import AllowanceEdit from './pages/fm/allowance/AllowanceEdit.jsx';

// 4.
import AttendanceShow from './pages/per/attendence/AttendanceShow.jsx';
import AttendanceCreate from './pages/per/attendence/AttendanceCreate.jsx';
import AttendanceEdit from './pages/per/attendence/AttendanceEdit.jsx';

// 5.
import ContractTypeShow from './pages/admin/contract_type/ContractTypeShow.jsx';
import ContractTypeCreate from './pages/admin/contract_type/ContractTypeCreate.jsx';
import ContractTypeEdit from './pages/admin/contract_type/ContractTypeEdit.jsx';

// 6.
import ContractShow from './pages/hrm/contract/ContractShow.jsx';
import ContractCreate from './pages/hrm/contract/ContractCreate.jsx';
import ContractEdit from './pages/hrm/contract/ContractEdit.jsx';

// 7.
import DepartmentShow from './pages/hrm/department/DepartmentShow.jsx';
import DepartmentCreate from './pages/hrm/department/DepartmentCreate.jsx';
import DepartmentEdit from './pages/hrm/department/DepartmentEdit.jsx';

// 8.
import EducationLevelShow from './pages/hrm/education_level/EducationLevelShow';
import EducationLevelCreate from './pages/hrm/education_level/EducationLevelCreate.jsx';
import EducationLevelEdit from './pages/hrm/education_level/EducationLevelEdit.jsx';

// 9.
import EmployeeShow from './pages/hrm/employee/EmployeeShow.jsx';
import EmployeeCreate from './pages/hrm/employee/EmployeeCreate.jsx';
import EmployeeEdit from './pages/hrm/employee/EmployeeEdit.jsx';

// 10.
import InsuranceShow from './pages/fm/insurance/InsuranceShow.jsx';
import InsuranceCreate from './pages/fm/insurance/InsuranceCreate.jsx';
import InsuranceEdit from './pages/fm/insurance/InsuranceEdit.jsx';

// 11.
import InsuranceTypeShow from './pages/admin/insurance_type/InsuranceTypeShow.jsx';
import InsuranceTypeCreate from './pages/admin/insurance_type/InsuranceTypeCreate.jsx';
import InsuranceTypeEdit from './pages/admin/insurance_type/InsuranceTypeEdit.jsx';

// 12.
import LeaveListShow from './pages/m/leave_list/LeaveListShow.jsx';
import LeaveListCreate from './pages/m/leave_list/LeaveListCreate.jsx';
import LeaveListEdit from './pages/m/leave_list/LeaveListEdit.jsx';

// 13.
import LeaveTypeShow from './pages/admin/leave_type/LeaveTypeShow.jsx';
import LeaveTypeCreate from './pages/admin/leave_type/LeaveTypeCreate.jsx';
import LeaveTypeEdit from './pages/admin/leave_type/LeaveTypeEdit.jsx';

// 14.
import PositionShow from './pages/hrm/position/PositionShow.jsx';
import PositionCreate from './pages/hrm/position/PositionCreate.jsx';
import PositionEdit from './pages/hrm/position/PositionEdit.jsx';

// 15.
import RoleShow from './pages/admin/role/RoleShow.jsx';
import RoleCreate from './pages/admin/role/RoleCreate.jsx';
import RoleEdit from './pages/admin/role/RoleEdit.jsx';

// 16.
import SalaryShow from './pages/fm/salary/SalaryShow.jsx';
import SalaryCreate from './pages/fm/salary/SalaryCreate.jsx';
import SalaryEdit from './pages/fm/salary/SalaryEdit.jsx';

// 17.
// import TaskShow from './pages/m/task/TaskShow.jsx';
// import TaskCreate from './pages/m/task/TaskCreate.jsx';
// import TaskEdit from './pages/m/task/TaskEdit.jsx';

// 18.
import WorkDateStatusShow from './pages/admin/work_date_status/WorkDateStatusShow.jsx';
import WorkDateStatusCreate from './pages/admin/work_date_status/WorkDateStatusCreate.jsx';
import WorkDateStatusEdit from './pages/admin/work_date_status/WorkDateStatusEdit.jsx';

// 19.
import WorkScheduleShow from './pages/hrm/work_schedule/WorkScheduleShow.jsx';
import WorkScheduleCreate from './pages/hrm/work_schedule/WorkScheduleCreate.jsx';
import WorkScheduleEdit from './pages/hrm/work_schedule/WorkScheduleEdit.jsx';

// 20.
import WorkShiftShow from './pages/admin/work_shift/WorkShiftShow.jsx';
import WorkShiftCreate from './pages/admin/work_shift/WorkShiftCreate.jsx';
import WorkShiftEdit from './pages/admin/work_shift/WorkShiftEdit.jsx';

// 21.
import PayrollDetail from './pages/fm/payroll/PayrollDetail.jsx';
import PayrollOverview from './pages/fm/payroll/PayrollOverview.jsx';
import EmployeePayrollDetail from './pages/per/payroll/EmployeePayrollDetail.jsx';

// 22.
import PersonalInformatiom from './pages/per/PersonalInformation.jsx';
import Attendance from './pages/Attendance.jsx';
import MyWorkSchedule from './pages/per/MyWorkSchedule.jsx';

import { Outlet } from 'react-router-dom';
import React from 'react';

// Component layout chính để bao gồm Footer
const RootLayout = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

// Cấu hình router
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true, element: (
          <>
            <Login />
            <Footer />
          </>
        ),
      },
      {
        path: 'admin', element: <MainLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          // 1.
          { path: 'allowance-types', element: <AllowanceTypeShow /> },
          { path: 'allowance-types/create', element: <AllowanceTypeCreate /> },
          { path: 'allowance-types/edit/:id', element: <AllowanceTypeEdit /> },

          // 2.
          { path: 'contract-types', element: <ContractTypeShow /> },
          { path: 'contract-types/create', element: <ContractTypeCreate /> },
          { path: 'contract-types/edit/:id', element: <ContractTypeEdit /> },

          // 3.
          { path: 'insurance-types', element: <InsuranceTypeShow /> },
          { path: 'insurance-types/create', element: <InsuranceTypeCreate /> },
          { path: 'insurance-types/edit/:id', element: <InsuranceTypeEdit /> },

          // 4.
          { path: 'leave-types', element: <LeaveTypeShow /> },
          { path: 'leave-types/create', element: <LeaveTypeCreate /> },
          { path: 'leave-types/edit/:id', element: <LeaveTypeEdit /> },

          // 5.
          { path: 'roles', element: <RoleShow /> },
          { path: 'roles/create', element: <RoleCreate /> },
          { path: 'roles/edit/:id', element: <RoleEdit /> },

          // 6.
          { path: 'users', element: <UserShow /> },
          { path: 'users/create', element: <UserCreate /> },
          { path: 'users/edit/:id', element: <UserEdit /> },

          // 7.
          { path: 'work-date-statuses', element: <WorkDateStatusShow /> },
          { path: 'work-date-statuses/create', element: <WorkDateStatusCreate /> },
          { path: 'work-date-statuses/edit/:id', element: <WorkDateStatusEdit /> },

          // 8.
          { path: 'work-shifts', element: <WorkShiftShow /> },
          { path: 'work-shifts/create', element: <WorkShiftCreate /> },
          { path: 'work-shifts/edit/:id', element: <WorkShiftEdit /> },

          // 9.
          { path: 'contracts', element: <ContractShow /> },
          { path: 'contracts/create', element: <ContractCreate /> },
          { path: 'contracts/edit/:id', element: <ContractEdit /> },

          // 10.
          { path: 'departments', element: <DepartmentShow /> },
          { path: 'departments/create', element: <DepartmentCreate /> },
          { path: 'departments/edit/:id', element: <DepartmentEdit /> },

          // 11.
          { path: 'education-levels', element: <EducationLevelShow /> },
          { path: 'education-levels/create', element: <EducationLevelCreate /> },
          { path: 'education-levels/edit/:id', element: <EducationLevelEdit /> },

          // 12.
          { path: 'employees', element: <EmployeeShow /> },
          { path: 'employees/create', element: <EmployeeCreate /> },
          { path: 'employees/edit/:id', element: <EmployeeEdit /> },

          // 13.
          { path: 'positions', element: <PositionShow /> },
          { path: 'positions/create', element: <PositionCreate /> },
          { path: 'positions/edit/:id', element: <PositionEdit /> },

          // 14.
          { path: 'work-schedules', element: <WorkScheduleShow /> },
          { path: 'work-schedules/create', element: <WorkScheduleCreate /> },
          { path: 'work-schedules/edit/:id', element: <WorkScheduleEdit /> },

          // 15.
          { path: 'allowances', element: <AllowanceShow /> },
          { path: 'allowances/create', element: <AllowanceCreate /> },
          { path: 'allowances/edit/:id', element: <AllowanceEdit /> },

          // 16.
          { path: 'insurances', element: <InsuranceShow /> },
          { path: 'insurances/create', element: <InsuranceCreate /> },
          { path: 'insurances/edit/:id', element: <InsuranceEdit /> },

          // 17.
          { path: 'salaries', element: <SalaryShow /> },
          { path: 'salaries/create', element: <SalaryCreate /> },
          { path: 'salaries/edit/:id', element: <SalaryEdit /> },

          // 18.
          { path: 'leaves', element: <LeaveListShow /> },
          { path: 'leaves/create', element: <LeaveListCreate /> },
          { path: 'leaves/edit/:id', element: <LeaveListEdit /> },

          //19
          // { path: 'tasks', element: <TaskShow /> },
          // { path: 'tasks/create', element: <TaskCreate /> },
          // { path: 'tasks/edit/:id', element: <TaskEdit /> },

          //20
          { path: 'attendances', element: <AttendanceShow /> },
          { path: 'attendances/create', element: <AttendanceCreate /> },
          { path: 'attendances/edit/:id', element: <AttendanceEdit /> },

          //21
          { path: 'payrolls', element: <PayrollOverview /> },
          { path: 'payroll/detail/:employeeId', element: <PayrollDetail /> },
          { path: 'my-payroll', element: <EmployeePayrollDetail /> },

          //22
          { path: 'roles', element: <RoleShow /> },
          { path: 'roles/create', element: <RoleCreate /> },
          { path: 'roles/edit/:id', element: <RoleEdit /> },

          //23
          { path: 'personal-information', element: <PersonalInformatiom /> },

          { path: 'my-schedule', element: <MyWorkSchedule /> },
          
        ],
      },
      { path: 'hrm', element: <MainLayout />,
        children: [
          { index: true, element: <HrmDashboard /> },
          // 9.
          { path: 'contracts', element: <ContractShow /> },
          { path: 'contracts/create', element: <ContractCreate /> },
          { path: 'contracts/edit/:id', element: <ContractEdit /> },

          // 10.
          { path: 'departments', element: <DepartmentShow /> },
          { path: 'departments/create', element: <DepartmentCreate /> },
          { path: 'departments/edit/:id', element: <DepartmentEdit /> },

          // 11.
          { path: 'education-levels', element: <EducationLevelShow /> },
          { path: 'education-levels/create', element: <EducationLevelCreate /> },
          { path: 'education-levels/edit/:id', element: <EducationLevelEdit /> },

          // 12.
          { path: 'employees', element: <EmployeeShow /> },
          { path: 'employees/create', element: <EmployeeCreate /> },
          { path: 'employees/edit/:id', element: <EmployeeEdit /> },

          // 13.
          { path: 'positions', element: <PositionShow /> },
          { path: 'positions/create', element: <PositionCreate /> },
          { path: 'positions/edit/:id', element: <PositionEdit /> },

          // 14.
          { path: 'work-schedules', element: <WorkScheduleShow /> },
          { path: 'work-schedules/create', element: <WorkScheduleCreate /> },
          { path: 'work-schedules/edit/:id', element: <WorkScheduleEdit /> },

          
        ],
      },
      {
        path: 'fm',
        element: <MainLayout />,
        children: [
          { index: true, element: <FmDashboard /> },
          // 15.
          { path: 'allowances', element: <AllowanceShow /> },
          { path: 'allowances/create', element: <AllowanceCreate /> },
          { path: 'allowances/edit/:id', element: <AllowanceEdit /> },

          // 16.
          { path: 'insurances', element: <InsuranceShow /> },
          { path: 'insurances/create', element: <InsuranceCreate /> },
          { path: 'insurances/edit/:id', element: <InsuranceEdit /> },

          // 17.
          { path: 'salaries', element: <SalaryShow /> },
          { path: 'salaries/create', element: <SalaryCreate /> },
          { path: 'salaries/edit/:id', element: <SalaryEdit /> },

          //21
          { path: 'payrolls', element: <PayrollOverview /> },
          { path: 'payroll/detail/:employeeId', element: <PayrollDetail /> },
          { path: 'my-payroll', element: <EmployeePayrollDetail /> },
        ],
      },
      {
        path: 'm', element: <MainLayout />,
        children: [
          { index: true, element: <MDashboard /> },
          // 18.
          { path: 'leaves', element: <LeaveListShow /> },
          { path: 'leaves/create', element: <LeaveListCreate /> },
          { path: 'leaves/edit/:id', element: <LeaveListEdit /> },

          //19
          // { path: 'tasks', element: <TaskShow /> },
          // { path: 'tasks/create', element: <TaskCreate /> },
          // { path: 'tasks/edit/:id', element: <TaskEdit /> },
        ],
      },
      {
        path: 'per', element: <MainLayout />,
        children: [
          { index: true, element: <PerDashboard /> },
          //20
          { path: 'attendances', element: <AttendanceShow /> },
          { path: 'attendances/create', element: <AttendanceCreate /> },
          { path: 'attendances/edit/:id', element: <AttendanceEdit /> },

          //21
          { path: 'my-payroll', element: <EmployeePayrollDetail /> },

          //22
          { path: 'personal-information', element: <PersonalInformatiom /> },

          { path: 'my-schedule', element: <MyWorkSchedule /> },
        ],
      },
      {
        path: 'atd', element: <MainLayout />,
        children: [
          {path: 'attendance', element: <Attendance />}
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);