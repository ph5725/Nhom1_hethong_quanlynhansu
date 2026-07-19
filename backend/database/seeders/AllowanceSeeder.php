<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AllowanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $allowances = [
            ['allowance_type_id' => 1, 'amount' => 1000000.00, 'is_seniority_base' => false, 'created_at' => now(), 'updated_at' => now()],
            ['allowance_type_id' => 2, 'amount' => 2000000.00, 'is_seniority_base' => false, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('allowances')->insert($allowances);
    }
}
