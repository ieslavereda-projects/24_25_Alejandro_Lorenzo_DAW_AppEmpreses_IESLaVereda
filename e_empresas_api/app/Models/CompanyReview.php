<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyReview extends Model
{
    protected $table = "company_reviews";
    protected $fillable = [
        'id_company', 'id_student', 'title', 'comment',
        'rating', 'work_environment', 'mentoring',
        'learning_value', 'would_recommend'
    ];

    public function company() {
        return $this->belongsTo(Company::class, 'id_company');
    }

    public function student() {
        return $this->belongsTo(User::class, 'id_student');
    }
}
