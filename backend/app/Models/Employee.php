<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'department_id',
        'education_id',
        'position_id',
        'fullname',
        'date_of_birth',
        'gender',
        'birthplace',
        'ethnicity',
        'address',
        'email',
        'id_card',
        'image_path',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function educationLevel(): BelongsTo
    {
        return $this->belongsTo(EducationLevel::class, 'education_id');
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'position_id');
    }

    public function contract(): HasOne
    {
        return $this->hasOne(Contract::class, 'employee_id');
    }

    public function insurances(): BelongsToMany
    {
        return $this->belongsToMany(Insurance::class, 'employee_insurance', 'employee_id', 'insurance_id')
            ->withPivot(['actual_employee_pct', 'actual_company_pct', 'actual_total_pct', 'note']);
    }

    public function leaves(): HasMany
    {
        return $this->hasMany(Leave::class, 'employee_id');
    }

    public function tasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'employee_task', 'employee_id', 'task_id')
            ->withPivot(['role']);
    }

    public function allowances(): BelongsToMany
    {
        return $this->belongsToMany(Allowance::class, 'allowance_employee', 'employee_id', 'allowance_id')
            ->withPivot(['total_allowance']);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class, 'employee_id');
    }

    public function workSchedules(): HasMany
    {
        return $this->hasMany(WorkSchedule::class, 'employee_id');
    }
}