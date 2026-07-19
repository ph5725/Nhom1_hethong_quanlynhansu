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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100);
            $table->text('description')->nullable();
            $table->foreignId('assigned_by_id')->constrained('employees')->onDelete('cascade');
            $table->foreignId('assigned_to_id')->constrained('employees')->onDelete('cascade');
            $table->date('assigned_date');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('due_date');
            $table->enum('status', ['Pending', 'Doing', 'Done', 'Late']);
            $table->enum('priority', ['Low', 'Medium', 'High']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
