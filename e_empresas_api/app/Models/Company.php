<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $table = 'companies';

    protected $fillable = [
        'name',
        'manager',
        'phone',
        'email',
        'address',
        'website',
        'industry',
        'observations',
        'allows_erasmus',
        'is_private',
    ];

    protected $casts = [
        'allows_erasmus' => 'boolean'
    ];

    public function reviews()
    {
        return $this->hasMany(CompanyReview::class, 'id_company');
    }
    public function tutorComments()
    {
        return $this->hasMany(Comment::class, 'id_company');
    }
}
