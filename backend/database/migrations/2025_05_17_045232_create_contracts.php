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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_code', 100)->unique();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('salary_id')->constrained('salaries')->onDelete('cascade');
            $table->foreignId('type')->constrained('contract_types')->onDelete('cascade');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->date('sign_date');
            $table->string('contract_file', 255)->nullable();
            $table->string('status', 50);
            $table->text('note')->nullable();
            $table->integer('year_of_service')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
