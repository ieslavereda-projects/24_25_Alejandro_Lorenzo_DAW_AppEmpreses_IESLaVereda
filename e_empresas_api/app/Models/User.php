<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'is_admin', 'is_student', 'is_tutor',
        'study_cycle', 'nia', 'nif', 'gender', 'photo'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'is_admin' => 'boolean',
        'is_student' => 'boolean',
        'is_tutor' => 'boolean',
    ];

    public function comments() {
        return $this->hasMany(Comment::class, 'id_student');
    }

    public function reviews() {
        return $this->hasMany(CompanyReview::class, 'id_student');
    }

    public function noticesSent() {
        return $this->hasMany(Notice::class, 'id_user_emitter');
    }

    public function noticesReceived() {
        return $this->hasMany(Notice::class, 'id_user_receiver');
    }
}
