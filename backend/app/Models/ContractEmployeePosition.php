<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractEmployeePosition extends Model
{
    use HasFactory;

    protected $table = 'contract_employee_position';

    protected $fillable = [
        'employee_id',
        'contract_id',
        'position_id',
        'is_main',
        'start_date',
        'end_date',
        'base_salary',
        'ratio',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class, 'contract_id');
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class, 'position_id');
    }
}