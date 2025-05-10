<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyDeregisterRequest extends Model
{
    protected $fillable = ['id_company', 'id_requestor', 'reason'];

    public function company() {
        return $this->belongsTo(Company::class, 'id_company');
    }

    public function requestor() {
        return $this->belongsTo(User::class, 'id_requestor');
    }
}
