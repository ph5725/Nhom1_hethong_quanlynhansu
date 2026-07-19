<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LeaveTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leaveTypes = [
            ['name' => 'Nghỉ bệnh', 'description' => 'Nghỉ do ốm đau', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Nghỉ lễ', 'description' => 'Nghỉ lễ theo quy định', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Nghỉ phép hằng năm', 'description' => 'Nghỉ phép có lương', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Nghỉ phép thường', 'description' => 'Nghỉ phép không lương', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('leave_types')->insert($leaveTypes);
    }
}
