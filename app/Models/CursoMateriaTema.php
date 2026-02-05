<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CursoMateriaTema extends Model
{
    protected $table = 'curso_materia_temas';
    protected $fillable = ['curso_materia_id', 'curso_materia_id', 'tema_id', 'mat_id', 'orden', 'estado'];

    public function tema()
    {
        return $this->belongsTo(Tema::class);
    }

    public function cursoMateria()
    {
        return $this->belongsTo(CursoMateria::class);
    }

    public function matricula()
    {
        return $this->belongsTo(Matricula::class, 'mat_id');
    }
}
