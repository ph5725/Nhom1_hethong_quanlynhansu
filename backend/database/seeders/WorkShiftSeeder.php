<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $workShifts = [
            ['shift_name' => 'Ca sáng', 'start_time' => '08:00:00', 'end_time' => '12:00:00', 'break_time' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['shift_name' => 'Ca chiều', 'start_time' => '13:00:00', 'end_time' => '17:00:00', 'break_time' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['shift_name' => 'Cả ngày', 'start_time' => '08:00:00', 'end_time' => '17:00:00', 'break_time' => 60, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('work_shifts')->insert($workShifts);
    }
}
