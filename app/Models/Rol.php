<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    protected $table = 'roles';
    protected $fillable = ['nombre', 'descripcion', 'permisos'];

    protected $casts = [
        'permisos' => 'array',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
