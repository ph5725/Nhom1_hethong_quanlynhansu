<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon; // Import Carbon để sử dụng now() và tạo ngày tháng

class LeaveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leaves = [
            [
                'employee_id' => 1,
                'approved_by' => 1,
                'approved_date' => '2025-05-18',
                'leave_type_id' => 1,
                'request_date' => '2025-05-17', // Ngày gửi đơn
                'start_date' => '2025-05-20', // Ngày bắt đầu nghỉ
                'end_date' => '2025-05-20',   // Ngày kết thúc nghỉ
                'reason' => 'Nghỉ ốm nhẹ', // Lý do nghỉ
                'note' => null,
                'status' => 'approved',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'employee_id' => 2,
                'approved_by' => null, // Chưa duyệt
                'approved_date' => null,
                'leave_type_id' => 2,
                'request_date' => '2025-05-19',
                'start_date' => '2025-05-21',
                'end_date' => '2025-05-23',
                'reason' => 'Nghỉ phép đi du lịch',
                'note' => 'Đã đặt vé máy bay',
                'status' => 'pending',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'employee_id' => 3,
                'approved_by' => null, // Chưa duyệt
                'approved_date' => null,
                'leave_type_id' => 3, // Giả sử có leave_type_id = 3
                'request_date' => '2025-05-25',
                'start_date' => '2025-06-01',
                'end_date' => '2025-06-01',
                'reason' => 'Việc cá nhân',
                'note' => null,
                'status' => 'pending',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'employee_id' => 4,
                'approved_by' => 1, // Người duyệt
                'approved_date' => '2025-05-28',
                'leave_type_id' => 1,
                'request_date' => '2025-05-27',
                'start_date' => '2025-06-05',
                'end_date' => '2025-06-07',
                'reason' => 'Nghỉ phép năm',
                'note' => 'Đã hoàn thành công việc trước hạn',
                'status' => 'approved',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ];

        DB::table('leaves')->insert($leaves);
    }
}