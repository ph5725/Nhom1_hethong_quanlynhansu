<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeInsuranceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employeeInsurances = [
            ['employee_id' => 1, 'insurance_id' => 1, 'actual_employee_pct' => 1.5, 'actual_company_pct' => 3.0, 'actual_total_pct' => 4.5, 'note' => null, 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 2, 'insurance_id' => 2, 'actual_employee_pct' => 0.5, 'actual_company_pct' => 1.0, 'actual_total_pct' => 1.5, 'note' => null, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('employee_insurance')->insert($employeeInsurances);
    }
}
