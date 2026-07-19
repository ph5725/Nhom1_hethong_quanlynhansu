<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $workSchedules = [
            // ['employee_id' => 1, 'status_id' => 2, 'shift_id' => 3, 'work_date' => '2025-05-18', 'is_day_off' => false, 'created_at' => now(), 'updated_at' => now()],
            // ['employee_id' => 2, 'status_id' => 2, 'shift_id' => 3, 'work_date' => '2025-05-18', 'is_day_off' => false, 'created_at' => now(), 'updated_at' => now()],

            ['employee_id' => 1, 'status_id' => 2, 'shift_id' => 1, 'work_date' => '2025-05-18', 'is_day_off' => false, 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 2, 'status_id' => 2, 'shift_id' => 2, 'work_date' => '2025-05-18', 'is_day_off' => false, 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 3, 'status_id' => 2, 'shift_id' => 3, 'work_date' => '2025-05-18', 'is_day_off' => false, 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 4, 'status_id' => 2, 'shift_id' => 1, 'work_date' => '2025-05-18', 'is_day_off' => false, 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 5, 'status_id' => 2, 'shift_id' => 2, 'work_date' => '2025-05-18', 'is_day_off' => false, 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 6, 'status_id' => 2, 'shift_id' => 3, 'work_date' => '2025-05-18', 'is_day_off' => false, 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 7, 'status_id' => 2, 'shift_id' => 1, 'work_date' => '2025-05-18', 'is_day_off' => false, 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 8, 'status_id' => 2, 'shift_id' => 2, 'work_date' => '2025-05-18', 'is_day_off' => false, 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 9, 'status_id' => 2, 'shift_id' => 3, 'work_date' => '2025-05-18', 'is_day_off' => false, 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 10, 'status_id' => 2, 'shift_id' => 1, 'work_date' => '2025-05-18', 'is_day_off' => false, 'created_at' => now(), 'updated_at' => now()],

        ];

        DB::table('work_schedules')->insert($workSchedules);
    }
}
