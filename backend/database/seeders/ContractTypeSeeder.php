<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContractTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contractTypes = [
            ['name' => 'Không xác định thời hạn', 'description' => 'Hợp đồng chính thức', 'created_at' => now(), 'updated_at' => now()],
            ['name' => '6 tháng', 'description' => 'Hợp đồng thử việc', 'created_at' => now(), 'updated_at' => now()],
            ['name' => '1 năm', 'description' => 'Hợp đồng 1 năm', 'created_at' => now(), 'updated_at' => now()],
            ['name' => '2 năm', 'description' => 'Hợp đồng 2 năm', 'created_at' => now(), 'updated_at' => now()],
            ['name' => '3 năm', 'description' => 'Hợp đồng 3 năm', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('contract_types')->insert($contractTypes);
    }
}
