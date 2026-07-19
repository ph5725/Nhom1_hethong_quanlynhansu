<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SalarySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $salaries = [
            ['salary_level' => 'Cấp 1', 'basic_salary' => 8000000.00, 'base_coefficient' => 1.0, 'created_at' => now(), 'updated_at' => now()],
            ['salary_level' => 'Cấp 2', 'basic_salary' => 10000000.00, 'base_coefficient' => 1.5, 'created_at' => now(), 'updated_at' => now()],
            ['salary_level' => 'Cấp 3', 'basic_salary' => 12000000.00, 'base_coefficient' => 2.0, 'created_at' => now(), 'updated_at' => now()],
            ['salary_level' => 'Cấp 4', 'basic_salary' => 15000000.00, 'base_coefficient' => 2.5, 'created_at' => now(), 'updated_at' => now()],
            ['salary_level' => 'Cấp 5', 'basic_salary' => 20000000.00, 'base_coefficient' => 3.0, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('salaries')->insert($salaries);
    }
}
