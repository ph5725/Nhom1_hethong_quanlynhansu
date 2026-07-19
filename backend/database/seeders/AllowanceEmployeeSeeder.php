<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AllowanceEmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $allowanceEmployees = [
            ['allowance_id' => 1, 'employee_id' => 1, 'total_allowance' => 1000000.00, 'created_at' => now(), 'updated_at' => now()],
            ['allowance_id' => 2, 'employee_id' => 2, 'total_allowance' => 2000000.00, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('allowance_employee')->insert($allowanceEmployees);
    }
}
