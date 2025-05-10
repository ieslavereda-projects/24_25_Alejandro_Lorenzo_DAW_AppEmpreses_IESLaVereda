<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'id_company', 'id_student', 'student_name',
        'comment', 'rating'
    ];

    public function company() {
        return $this->belongsTo(Company::class, 'id_company');
    }

    public function student() {
        return $this->belongsTo(User::class, 'id_student');
    }
}
