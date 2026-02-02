<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matricula extends Model
{
    protected $hidden = [];

    //
    public function curso()
    {
        return $this->belongsTo(Curso::class);
    }

    public function cursoMateriaTemas()
    {
        return $this->hasMany(CursoMateriaTema::class, 'mat_id');
    }
}
