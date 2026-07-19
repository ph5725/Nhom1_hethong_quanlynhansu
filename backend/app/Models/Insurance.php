<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Insurance extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'default_employee_pct',
        'default_company_pct',
        'default_total_pct',
        'note',
    ];

    public function insuranceType(): BelongsTo
    {
        return $this->belongsTo(InsuranceType::class, 'type');
    }

    public function employees(): BelongsToMany
    {
        return $this->belongsToMany(Employee::class, 'employee_insurance', 'insurance_id', 'employee_id')
            ->withPivot(['actual_employee_pct', 'actual_company_pct', 'actual_total_pct', 'note']);
    }
}