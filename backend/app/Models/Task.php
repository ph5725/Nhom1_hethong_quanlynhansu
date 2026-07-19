<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'assigned_by_id',
        'assigned_to_id',
        'assigned_date',
        'start_date',
        'end_date',
        'due_date',
        'status',
        'priority',
    ];

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'employee_task', 'task_id', 'employee_id')
            ->withPivot(['role']);
    }
}