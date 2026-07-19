<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EducationLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $educationLevels = [
            ['level' => 'Trung học phổ thông', 'major' => 'Không chuyên ngành', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 'Trung cấp', 'major' => 'Công nghệ thông tin', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 'Trung cấp', 'major' => 'Kế toán', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 'Cao đẳng', 'major' => 'Quản trị kinh doanh', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 'Cao đẳng', 'major' => 'Điện tử', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 'Đại học', 'major' => 'Công nghệ thông tin', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 'Đại học', 'major' => 'Kinh tế', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 'Đại học', 'major' => 'Luật', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 'Đại học', 'major' => 'Y học', 'created_at' => now(), 'updated_at' => now()],
            ['level' => 'Đại học', 'major' => 'Xây dựng', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('education_levels')->insert($educationLevels);
    }
}
