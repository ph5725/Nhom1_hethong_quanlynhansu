<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'type',
        'salary_id',
        'contract_code',
        'start_date',
        'end_date',
        'sign_date',
        'contract_file',
        'status',
        'note',
        'year_of_service',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function contractType(): BelongsTo
    {
        return $this->belongsTo(ContractType::class, 'type');
    }

    public function salary(): BelongsTo
    {
        return $this->belongsTo(Salary::class, 'salary_id');
    }

    public function positions(): BelongsToMany
    {
        return $this->belongsToMany(Position::class, 'contract_employee_position', 'contract_id', 'position_id')
            ->withPivot(['is_main', 'start_date', 'end_date', 'base_salary', 'ratio']);
    }

    public function getYearOfServiceAttribute()
    {
        $start = Carbon::parse($this->start_date);
        // Nếu end_date không tồn tại (null), nghĩa là hợp đồng vẫn còn hiệu lực
        if ($this->end_date) {
            $end = Carbon::parse($this->end_date);
            return $start->diffInYears($end);
        } else {
            return $start->diffInYears(Carbon::now()); // Tính đến năm hiện tại
        }
    }
}
