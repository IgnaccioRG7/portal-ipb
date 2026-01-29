<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    protected $fillable = [
        'ci',
        'nombre',
        'apellido_paterno',
        'apellido_materno',
        'fecha_nacimiento',
        'genero',
        'celular',
        'direccion',
        'ciudad',
        'tutor_id',
        'parentesco_tutor'
    ];

    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];

    public function user()
    {
        return $this->hasOne(User::class);
    }

    public function tutor()
    {
        return $this->belongsTo(Persona::class, 'tutor_id');
    }

    public function getNombreCompletoAttribute()
    {
        return trim("{$this->nombre} {$this->apellido_paterno} {$this->apellido_materno}");
    }
}