<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'User1', 'email' => 'admin@company.com', 'password' => Hash::make('password123'), 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'User2', 'email' => 'hrm@company.com', 'password' => Hash::make('password123'), 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'User3', 'email' => 'fm@company.com', 'password' => Hash::make('password123'), 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'User4', 'email' => 'm@company.com', 'password' => Hash::make('password123'), 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'User5', 'email' => 'user5@company.com', 'password' => Hash::make('password123'), 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'User6', 'email' => 'user6@company.com', 'password' => Hash::make('password123'), 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'User7', 'email' => 'user7@company.com', 'password' => Hash::make('password123'), 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'User8', 'email' => 'user8@company.com', 'password' => Hash::make('password123'), 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'User9', 'email' => 'user9@company.com', 'password' => Hash::make('password123'), 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'User10', 'email' => 'user10@company.com', 'password' => Hash::make('password123'), 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('users')->insert($users);
    }
}