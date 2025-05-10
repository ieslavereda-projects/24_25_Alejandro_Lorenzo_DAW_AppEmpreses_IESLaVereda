<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $fillable = [
        'id_user_emitter', 'id_user_receiver', 'text', 'seen'
    ];

    public function emitter() {
        return $this->belongsTo(User::class, 'id_user_emitter');
    }

    public function receiver() {
        return $this->belongsTo(User::class, 'id_user_receiver');
    }
}
