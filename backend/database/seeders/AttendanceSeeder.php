<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attendances = [
            ['employee_id' => 1, 'attendance_date' => '2025-05-18', 'check_in' => '08:00:00', 'check_out' => '17:00:00', 'status' => 'Present', 'created_at' => now(), 'updated_at' => now()],
            ['employee_id' => 2, 'attendance_date' => '2025-05-18', 'check_in' => '08:15:00', 'check_out' => null, 'status' => 'Late', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('attendances')->insert($attendances);
    }
}
