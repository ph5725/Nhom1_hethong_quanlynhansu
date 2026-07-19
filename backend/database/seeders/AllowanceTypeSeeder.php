<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AllowanceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $allowanceTypes = [
            ['name' => 'Trợ cấp ốm đau', 'description' => 'Trợ cấp khi ốm đau', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Trợ cấp thai sản', 'description' => 'Trợ cấp cho phụ nữ mang thai', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Trợ cấp tai nạn lao động', 'description' => 'Trợ cấp khi tai nạn lao động', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Trợ cấp hưu trí', 'description' => 'Trợ cấp khi nghỉ hưu', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Trợ cấp tử tuất', 'description' => 'Trợ cấp khi mất', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Trợ cấp thôi việc', 'description' => 'Trợ cấp khi nghỉ việc', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Trợ cấp mất việc làm', 'description' => 'Trợ cấp khi mất việc', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('allowance_types')->insert($allowanceTypes);
    }
}
