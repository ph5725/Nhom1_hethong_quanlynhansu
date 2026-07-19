<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $positions = [
            ['name' => 'Giám đốc', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Trưởng phòng nhân sự', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Trưởng phòng IT', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Nhân viên kinh doanh', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Nhân viên hành chính', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('positions')->insert($positions);
    }
}
