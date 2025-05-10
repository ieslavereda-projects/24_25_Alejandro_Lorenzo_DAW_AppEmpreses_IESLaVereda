<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name', 'manager', 'phone', 'email', 'address',
        'website', 'industry', 'obsevations', 'allows_erasmus'
    ];

    public function comments() {
        return $this->hasMany(Comment::class, 'id_company');
    }

    public function reviews() {
        return $this->hasMany(CompanyReview::class, 'id_company');
    }
}
