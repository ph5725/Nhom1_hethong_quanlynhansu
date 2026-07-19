<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // Import Carbon for generating 'now()'

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $employees = [
            [
                'fullname' => 'Nguyễn Văn An',
                'date_of_birth' => '1985-01-01',
                'gender' => 'Male',
                'birthplace' => 'Hà Nội',
                'ethnicity' => 'Kinh',
                'address' => '123 Đường ABC',
                'email' => 'admin@company.com',
                'id_card' => '001185000001', // Thêm trường id_card
                'image_path' => 'images/employees/nguyen_van_an.png', // Thêm trường image_path
                'department_id' => 1,
                'education_id' => 6,
                'user_id' => 1,
                'position_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'fullname' => 'Trần Thị Bình',
                'date_of_birth' => '1988-02-02',
                'gender' => 'Female',
                'birthplace' => 'TP.HCM',
                'ethnicity' => 'Kinh',
                'address' => '456 Đường XYZ',
                'email' => 'hrm@company.com',
                'id_card' => '001188000002',
                'image_path' => 'images/employees/tran_thi_binh.png',
                'department_id' => 1,
                'education_id' => 7,
                'user_id' => 2,
                'position_id' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'fullname' => 'Lê Hoàng Nam',
                'date_of_birth' => '1987-03-03',
                'gender' => 'Male',
                'birthplace' => 'Đà Nẵng',
                'ethnicity' => 'Kinh',
                'address' => '789 Đường DEF',
                'email' => 'fm@company.com',
                'id_card' => '001187000003',
                'image_path' => 'images/employees/le_hoang_nam.png',
                'department_id' => 3,
                'education_id' => 8,
                'user_id' => 3,
                'position_id' => 3,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'fullname' => 'Phạm Thu Hà',
                'date_of_birth' => '1986-04-04',
                'gender' => 'Female',
                'birthplace' => 'Cần Thơ',
                'ethnicity' => 'Kinh',
                'address' => '101 Đường GHI',
                'email' => 'm@company.com',
                'id_card' => '001186000004',
                'image_path' => 'images/employees/pham_thu_ha.png',
                'department_id' => 2,
                'education_id' => 9,
                'user_id' => 4,
                'position_id' => 4,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'fullname' => 'Hoàng Minh Đức',
                'date_of_birth' => '1990-05-05',
                'gender' => 'Male',
                'birthplace' => 'Hải Phòng',
                'ethnicity' => 'Kinh',
                'address' => '202 Đường JKL',
                'email' => 'user1@company.com',
                'id_card' => '001190000005',
                'image_path' => 'images/employees/hoang_minh_duc.png',
                'department_id' => 2,
                'education_id' => 5,
                'user_id' => 5,
                'position_id' => 5,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'fullname' => 'Phan Thị Ngọc Ánh',
                'date_of_birth' => '1991-06-06',
                'gender' => 'Female',
                'birthplace' => 'Huế',
                'ethnicity' => 'Kinh',
                'address' => '303 Đường MNO',
                'email' => 'user2@company.com',
                'id_card' => '001191000006',
                'image_path' => 'images/employees/phan_ngoc_anh.png',
                'department_id' => 4,
                'education_id' => 4,
                'user_id' => 6,
                'position_id' => 4,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'fullname' => 'Vũ Đức Mạnh',
                'date_of_birth' => '1992-07-07',
                'gender' => 'Male',
                'birthplace' => 'Quảng Ninh',
                'ethnicity' => 'Kinh',
                'address' => '404 Đường PQR',
                'email' => 'user3@company.com',
                'id_card' => '001192000007',
                'image_path' => 'images/employees/vu_duc_manh.png',
                'department_id' => 5,
                'education_id' => 3,
                'user_id' => 7,
                'position_id' => 5,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'fullname' => 'Đặng Bảo Trâm',
                'date_of_birth' => '1993-08-08',
                'gender' => 'Female',
                'birthplace' => 'Bình Dương',
                'ethnicity' => 'Kinh',
                'address' => '505 Đường STU',
                'email' => 'user4@company.com',
                'id_card' => '001193000008',
                'image_path' => 'images/employees/dang_bao_tram.png',
                'department_id' => 3,
                'education_id' => 2,
                'user_id' => 8,
                'position_id' => 3,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'fullname' => 'Bùi Văn Kiên',
                'date_of_birth' => '1994-09-09',
                'gender' => 'Male',
                'birthplace' => 'Đồng Nai',
                'ethnicity' => 'Kinh',
                'address' => '606 Đường VWX',
                'email' => 'user5@company.com',
                'id_card' => '001194000009',
                'image_path' => 'images/employees/bui_van_kien.png',
                'department_id' => 4,
                'education_id' => 1,
                'user_id' => 9,
                'position_id' => 4,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'fullname' => 'Đỗ Thị Phương Thảo',
                'date_of_birth' => '1995-10-10',
                'gender' => 'Female',
                'birthplace' => 'Khánh Hòa',
                'ethnicity' => 'Kinh',
                'address' => '707 Đường YZ',
                'email' => 'user6@company.com',
                'id_card' => '001195000010',
                'image_path' => 'images/employees/do_phuong_thao.png',
                'department_id' => 5,
                'education_id' => 6,
                'user_id' => 10,
                'position_id' => 5,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ];

        DB::table('employees')->insert($employees);
    }
}