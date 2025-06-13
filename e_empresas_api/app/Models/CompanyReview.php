<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyReview extends Model
{
    protected $table = "company_reviews";
    protected $fillable = [
        'comment',
        'rating',
        'would_recommend',
        'id_student',
        'approved', 
    ];
    

    public function company() {
        return $this->belongsTo(Company::class, 'id_company');
    }

    public function student() {
        return $this->belongsTo(User::class, 'id_student');
    }
}
