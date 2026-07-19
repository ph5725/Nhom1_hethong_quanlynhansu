<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            ['name' => 'Phòng Nhân sự', 'address' => 'Tầng 1, Tòa nhà ABC', 'phone' => '0123456789', 'manager' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Phòng IT', 'address' => 'Tầng 2, Tòa nhà ABC', 'phone' => '0987654321', 'manager' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Phòng Tài chính', 'address' => 'Tầng 3, Tòa nhà ABC', 'phone' => '0912345678', 'manager' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Phòng Kinh doanh', 'address' => 'Tầng 4, Tòa nhà ABC', 'phone' => '0901234567', 'manager' => null, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Phòng Hành chính', 'address' => 'Tầng 5, Tòa nhà ABC', 'phone' => '0934567890', 'manager' => null, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('departments')->insert($departments);
    }
}
