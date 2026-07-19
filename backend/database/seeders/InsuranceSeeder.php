<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InsuranceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $insurances = [
            ['type' => 1, 'default_employee_pct' => 1.5, 'default_company_pct' => 3.0, 'default_total_pct' => 4.5, 'note' => null, 'created_at' => now(), 'updated_at' => now()],
            ['type' => 2, 'default_employee_pct' => 0.5, 'default_company_pct' => 1.0, 'default_total_pct' => 1.5, 'note' => null, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('insurances')->insert($insurances);
    }
}
