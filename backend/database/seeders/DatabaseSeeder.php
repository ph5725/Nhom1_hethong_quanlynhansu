<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            DepartmentSeeder::class,
            EducationLevelSeeder::class,
            SalarySeeder::class,
            ContractTypeSeeder::class,
            InsuranceTypeSeeder::class,
            LeaveTypeSeeder::class,
            WorkShiftSeeder::class,
            WorkDateStatusSeeder::class,
            AllowanceTypeSeeder::class,
            RoleUserSeeder::class,
            PositionSeeder::class,
            EmployeeSeeder::class,
            ContractSeeder::class,
            ContractEmployeePositionSeeder::class,
            InsuranceSeeder::class,
            EmployeeInsuranceSeeder::class,
            LeaveSeeder::class,
            TaskSeeder::class,
            EmployeeTaskSeeder::class,
            AllowanceSeeder::class,
            AllowanceEmployeeSeeder::class,
            AttendanceSeeder::class,
            WorkScheduleSeeder::class,
        ]);
    }
}
