<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeInsurance extends Model
{
    use HasFactory;

    protected $table = 'employee_insurance';

    protected $fillable = [
        'employee_id',
        'insurance_id',
        'actual_employee_pct',
        'actual_company_pct',
        'actual_total_pct',
        'note',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function insurance(): BelongsTo
    {
        return $this->belongsTo(Insurance::class, 'insurance_id');
    }
}