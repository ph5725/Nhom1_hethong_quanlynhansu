<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContractSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contracts = [
            ['contract_code' => 'HD001', 'employee_id' => 1, 'salary_id' => 1, 'type' => 1, 'start_date' => '2024-01-01', 'end_date' => null, 'sign_date' => '2024-01-01', 'contract_file' => null, 'status' => 'Active', 'note' => null, 'year_of_service' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['contract_code' => 'HD002', 'employee_id' => 2, 'salary_id' => 2, 'type' => 2, 'start_date' => '2024-02-01', 'end_date' => '2024-08-01', 'sign_date' => '2024-02-01', 'contract_file' => null, 'status' => 'Active', 'note' => null, 'year_of_service' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['contract_code' => 'HD003', 'employee_id' => 3, 'salary_id' => 3, 'type' => 3, 'start_date' => '2024-03-01', 'end_date' => '2025-03-01', 'sign_date' => '2024-03-01', 'contract_file' => null, 'status' => 'Active', 'note' => null, 'year_of_service' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['contract_code' => 'HD004', 'employee_id' => 4, 'salary_id' => 4, 'type' => 4, 'start_date' => '2024-04-01', 'end_date' => '2026-04-01', 'sign_date' => '2024-04-01', 'contract_file' => null, 'status' => 'Active', 'note' => null, 'year_of_service' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['contract_code' => 'HD005', 'employee_id' => 5, 'salary_id' => 5, 'type' => 5, 'start_date' => '2024-05-01', 'end_date' => '2027-05-01', 'sign_date' => '2024-05-01', 'contract_file' => null, 'status' => 'Active', 'note' => null, 'year_of_service' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['contract_code' => 'HD006', 'employee_id' => 6, 'salary_id' => 1, 'type' => 1, 'start_date' => '2024-06-01', 'end_date' => null, 'sign_date' => '2024-06-01', 'contract_file' => null, 'status' => 'Active', 'note' => null, 'year_of_service' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['contract_code' => 'HD007', 'employee_id' => 7, 'salary_id' => 2, 'type' => 2, 'start_date' => '2024-07-01', 'end_date' => '2024-12-31', 'sign_date' => '2024-07-01', 'contract_file' => null, 'status' => 'Active', 'note' => null, 'year_of_service' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['contract_code' => 'HD008', 'employee_id' => 8, 'salary_id' => 3, 'type' => 3, 'start_date' => '2024-08-01', 'end_date' => '2025-08-01', 'sign_date' => '2024-08-01', 'contract_file' => null, 'status' => 'Active', 'note' => null, 'year_of_service' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['contract_code' => 'HD009', 'employee_id' => 9, 'salary_id' => 4, 'type' => 4, 'start_date' => '2024-09-01', 'end_date' => '2026-09-01', 'sign_date' => '2024-09-01', 'contract_file' => null, 'status' => 'Active', 'note' => null, 'year_of_service' => 0, 'created_at' => now(), 'updated_at' => now()],
            ['contract_code' => 'HD010', 'employee_id' => 10, 'salary_id' => 5, 'type' => 5, 'start_date' => '2024-10-01', 'end_date' => '2027-10-01', 'sign_date' => '2024-10-01', 'contract_file' => null, 'status' => 'Active', 'note' => null, 'year_of_service' => 0, 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('contracts')->insert($contracts);
    }
}
