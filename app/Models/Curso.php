<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Curso extends Model
{
    protected $table = 'cursos';

    protected $fillable = [
        'codigo_curso', 'nombre', 'descripcion', 'nivel', 
        'precio', 'estado', 'horas_semanales'
    ];
}
