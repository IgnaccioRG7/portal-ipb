<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CursoMateria extends Model
{
    protected $table = 'curso_materias';
    protected $fillable = ['curso_id', 'materia_id', 'horas_semanales', 'estado', 'fecha_inicio', 'fecha_fin'];

    // Relación necesaria para el Seeder
    // public function temas()
    // {
    //     return $this->belongsToMany(Tema::class, 'curso_materia_temas');
    // }

    public function cursos() {
        return $this->belongsTo(Curso::class);
    }

    public function materia()
    {
        return $this->belongsTo(Materia::class);
    }

    public function temasMateria() {
        return $this->hasMany(CursoMateriaTema::class, 'curso_materia_id');
    }
}
