<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role; // <-- Import Model Role của Spatie
use Illuminate\Support\Facades\DB; // Vẫn giữ nếu bạn cần dùng cho các bảng khác sau này, nhưng không dùng cho 'roles' nữa

class MigrateOldRolesToSpatieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Xóa cache của Spatie để đảm bảo các vai trò mới được nhận diện
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $roles = [
            ['name' => 'admin', 'description' => 'Quản trị viên hệ thống'],
            ['name' => 'hrm', 'description' => 'Quản lý nhân sự'],
            ['name' => 'fm', 'description' => 'Quản lý tài chính'],
            ['name' => 'm', 'description' => 'Quản lý'],
            ['name' => 'per', 'description' => 'Nhân viên'],
        ];

        foreach ($roles as $roleData) {
            // Sử dụng Model Role của Spatie để tạo vai trò
            // 'guard_name' mặc định là 'web' cho ứng dụng web
            Role::firstOrCreate(
                ['name' => $roleData['name'], 'guard_name' => 'web'],
                ['description' => $roleData['description']] // Thêm description nếu bạn muốn lưu vào bảng roles của Spatie
            );
        }

        $this->command->info('Roles seeded successfully into Spatie\'s roles table.');
    }
}
