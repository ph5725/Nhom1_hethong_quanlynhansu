<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Leave extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'approved_by',
        'approved_date',
        'leave_type_id',
        'request_date', // Thêm vào
        'start_date',   // Thêm vào
        'end_date',     // Thêm vào
        'reason',       // Thêm vào
        'note',
        'status',
    ];

    protected $appends = ['duration'];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'employee_id');
    }

    public function approved(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'approved_by');
    }

    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(LeaveType::class, 'leave_type_id');
    }

    public function getDurationAttribute()
    {
        if ($this->start_date && $this->end_date) {
            $start = Carbon::parse($this->start_date);
            $end = Carbon::parse($this->end_date);
            // Tính số ngày nghỉ, bao gồm cả ngày bắt đầu và kết thúc
            return $start->diffInDays($end) + 1;
        }
        return null;
    }
}