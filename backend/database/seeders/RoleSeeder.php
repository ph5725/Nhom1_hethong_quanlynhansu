<?php

// namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
// use Illuminate\Database\Seeder;
// use Illuminate\Support\Facades\DB;

// class RoleSeeder extends Seeder
// {
//     /**
//      * Run the database seeds.
//      */
//     public function run(): void
//     {
//         $roles = [
//             ['name' => 'admin', 'description' => 'Quản trị viên hệ thống', 'created_at' => now(), 'updated_at' => now()],
//             ['name' => 'hrm', 'description' => 'Quản lý nhân sự', 'created_at' => now(), 'updated_at' => now()],
//             ['name' => 'fm', 'description' => 'Quản lý tài chính', 'created_at' => now(), 'updated_at' => now()],
//             ['name' => 'm', 'description' => 'Quản lý', 'created_at' => now(), 'updated_at' => now()],
//             ['name' => 'per', 'description' => 'Nhân viên', 'created_at' => now(), 'updated_at' => now()],
//         ];

//         DB::table('roles')->insert($roles);
//     }
// }


namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role; // <-- Import Model Role của Spatie
use Illuminate\Support\Facades\DB; // Vẫn giữ nếu bạn cần dùng cho các bảng khác sau này, nhưng không dùng cho 'roles' nữa

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Xóa cache của Spatie để đảm bảo các vai trò mới được nhận diện
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $rolesToCreate = [
            ['name' => 'admin', 'description' => 'Quản trị viên hệ thống'],
            ['name' => 'hrm', 'description' => 'Quản lý nhân sự'],
            ['name' => 'fm', 'description' => 'Quản lý tài chính'],
            ['name' => 'm', 'description' => 'Quản lý'],
            ['name' => 'per', 'description' => 'Nhân viên'],
        ];

        // Lặp qua từng vai trò và tạo chúng với 'guard_name' là 'api'
        foreach ($rolesToCreate as $roleData) {
            Role::firstOrCreate(
                [
                    'name' => $roleData['name'],
                    'guard_name' => 'api' // <-- Đảm bảo guard_name là 'api'
                ],
                // Spatie's roles table doesn't have 'description' by default.
                // If you added it to your migration, it will be stored.
                // Otherwise, this 'description' will just be ignored by Spatie's Role model.
                ['description' => $roleData['description']]
            );
        }

        $this->command->info('API Roles seeded successfully into Spatie\'s roles table.');
    }
}