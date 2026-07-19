<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tasks = [
            ['title' => 'Hoàn thành báo cáo tháng', 'description' => null, 'assigned_by_id' => 1, 'assigned_to_id' => 5, 'assigned_date' => '2025-05-18', 'start_date' => '2025-05-19', 'end_date' => null, 'due_date' => '2025-05-25', 'status' => 'Pending', 'priority' => 'High', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'Kiểm tra hệ thống', 'description' => null, 'assigned_by_id' => 1, 'assigned_to_id' => 6, 'assigned_date' => '2025-05-18', 'start_date' => '2025-05-20', 'end_date' => null, 'due_date' => '2025-05-26', 'status' => 'Pending', 'priority' => 'Medium', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('tasks')->insert($tasks);
    }
}
