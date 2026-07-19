<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EducationLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'level',
        'major',
    ];

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class, 'education_id');
    }
}