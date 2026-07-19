<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InsuranceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $insuranceTypes = [
            ['name' => 'Bảo hiểm y tế', 'description' => 'Bảo hiểm y tế cơ bản', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bảo hiểm tai nạn', 'description' => 'Bảo hiểm tai nạn lao động', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bảo hiểm lao động', 'description' => 'Bảo hiểm lao động bắt buộc', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bảo hiểm thất nghiệp', 'description' => 'Bảo hiểm thất nghiệp', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Bảo hiểm xã hội', 'description' => 'Bảo hiểm xã hội cơ bản', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('insurance_types')->insert($insuranceTypes);
    }
}
