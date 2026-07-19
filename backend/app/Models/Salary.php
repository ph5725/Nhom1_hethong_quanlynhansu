<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Salary extends Model
{
    use HasFactory;

    protected $fillable = [
        'salary_level',
        'basic_salary',
        'base_coefficient',
    ];

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class, 'salary_id');
    }
}