<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'id_company', 'id_tutor', 'comment'
    ];

    public function tutor()
    {
        return $this->belongsTo(User::class, 'id_tutor');
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'id_company');
    }
}
