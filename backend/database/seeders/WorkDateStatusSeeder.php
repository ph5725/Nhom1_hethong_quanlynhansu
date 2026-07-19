<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkDateStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $workDateStatuses = [
            ['name' => 'Ngày lễ', 'description' => 'Ngày lễ theo quy định', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Ngày thường', 'description' => 'Ngày làm việc bình thường', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Ngày nghỉ', 'description' => 'Ngày nghỉ theo lịch', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('work_date_statuses')->insert($workDateStatuses);
    }
}
