<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roleUsers = [
            ['user_id' => 1, 'role_id' => 1, 'created_at' => now(), 'updated_at' => now()], // user1: admin
            ['user_id' => 1, 'role_id' => 5, 'created_at' => now(), 'updated_at' => now()], // user1: per
            ['user_id' => 2, 'role_id' => 2, 'created_at' => now(), 'updated_at' => now()], // user2: hrm
            ['user_id' => 2, 'role_id' => 5, 'created_at' => now(), 'updated_at' => now()], // user2: per
            ['user_id' => 3, 'role_id' => 3, 'created_at' => now(), 'updated_at' => now()], // user3: fm
            ['user_id' => 3, 'role_id' => 5, 'created_at' => now(), 'updated_at' => now()], // user3: per
            ['user_id' => 4, 'role_id' => 4, 'created_at' => now(), 'updated_at' => now()], // user4: m
            ['user_id' => 4, 'role_id' => 5, 'created_at' => now(), 'updated_at' => now()], // user4: per
            ['user_id' => 5, 'role_id' => 5, 'created_at' => now(), 'updated_at' => now()], // user5: per
            ['user_id' => 6, 'role_id' => 5, 'created_at' => now(), 'updated_at' => now()], // user6: per
            ['user_id' => 7, 'role_id' => 5, 'created_at' => now(), 'updated_at' => now()], // user7: per
            ['user_id' => 8, 'role_id' => 5, 'created_at' => now(), 'updated_at' => now()], // user8: per
            ['user_id' => 9, 'role_id' => 5, 'created_at' => now(), 'updated_at' => now()], // user9: per
            ['user_id' => 10, 'role_id' => 5, 'created_at' => now(), 'updated_at' => now()], // user10: per
        ];

        DB::table('role_user')->insert($roleUsers);
    }
}
