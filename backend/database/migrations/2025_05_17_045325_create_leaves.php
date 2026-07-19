<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('leaves', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('approved_by')->nullable()->constrained('employees')->onDelete('set null'); // Đặt nullable và onDelete('set null')
            $table->date('approved_date')->nullable();
            $table->foreignId('leave_type_id')->constrained('leave_types')->onDelete('cascade');

            // Các cột mới được bổ sung
            $table->date('request_date')->comment('Ngày gửi đơn nghỉ phép'); // Ngày gửi đơn
            $table->date('start_date')->comment('Ngày bắt đầu nghỉ');
            $table->date('end_date')->comment('Ngày kết thúc nghỉ');
            $table->text('reason')->comment('Lý do nghỉ phép'); // Lý do nghỉ

            // Cột 'leave_date' cũ có thể bị loại bỏ hoặc giữ lại tùy mục đích
            // Nếu muốn giữ lại nhưng không dùng nữa, có thể làm nullable
            // $table->date('leave_date')->nullable(); // Có thể xóa dòng này nếu không cần nữa

            $table->text('note')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaves');
    }
};