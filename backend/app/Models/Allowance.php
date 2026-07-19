<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Allowance extends Model
{
    use HasFactory;

    protected $fillable = [
        'allowance_type_id',
        'amount',
        'is_seniority_base',
    ];

    public function allowanceType(): BelongsTo
    {
        return $this->belongsTo(AllowanceType::class, 'allowance_type_id');
    }

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'allowance_employee', 'allowance_id', 'employee_id')
            ->withPivot(['total_allowance']);
    }
}