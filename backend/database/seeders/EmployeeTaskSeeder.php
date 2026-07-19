<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeTaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employeeTasks = [
            ['task_id' => 1, 'employee_id' => 5, 'role' => 'Thực hiện', 'created_at' => now(), 'updated_at' => now()],
            ['task_id' => 2, 'employee_id' => 6, 'role' => 'Thực hiện', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('employee_task')->insert($employeeTasks);
    }
}
