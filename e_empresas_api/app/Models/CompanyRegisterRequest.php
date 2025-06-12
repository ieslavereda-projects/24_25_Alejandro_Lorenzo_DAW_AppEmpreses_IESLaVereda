<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyRegisterRequest extends Model
{
    protected $fillable = [
        'id_requestor',
        'reason',
        'name',
        'manager',
        'phone',
        'email',
        'address',
        'website',
        'is_private',
        'allows_erasmus',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'id_company');
    }

    public function requestor()
    {
        return $this->belongsTo(User::class, 'id_requestor');
    }
}
