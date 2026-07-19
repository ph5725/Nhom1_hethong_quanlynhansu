<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContractEmployeePositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contractEmployeePositions = [
            ['employee_id' => 1, 'contract_id' => 1, 'position_id' => 1, 'is_main' => true, 'start_date' => '2024-01-01', 'end_date' => null, 'base_salary' => 8000000.00, 'ratio' => 1.0, 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 2, 'contract_id' => 2, 'position_id' => 2, 'is_main' => true, 'start_date' => '2024-02-01', 'end_date' => '2024-08-01', 'base_salary' => 10000000.00, 'ratio' => 1.5, 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 3, 'contract_id' => 3, 'position_id' => 3, 'is_main' => true, 'start_date' => '2024-03-01', 'end_date' => '2025-03-01', 'base_salary' => 12000000.00, 'ratio' => 2.0, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('contract_employee_position')->insert($contractEmployeePositions);
    }
}
