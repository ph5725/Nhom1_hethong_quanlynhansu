<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AllowanceEmployee extends Model
{
    use HasFactory;

    protected $table = 'allowance_employee';

    protected $fillable = [
        'allowance_id',
        'employee_id',
        'total_allowance',
    ];

    public function allowance(): BelongsTo
    {
        return $this->belongsTo(Allowance::class, 'allowance_id');
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }
}