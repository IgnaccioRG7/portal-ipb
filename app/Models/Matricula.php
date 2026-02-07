<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Matricula extends Model
{
    protected $table = 'matriculas';

    /**
     * Campos que se pueden asignar masivamente
     */
    protected $fillable = [
        'estudiante_id',
        'curso_id',
        'codigo_matricula',
        'estado',
        'fecha_finalizacion',
        'observaciones'
    ];

    /**
     * Campos ocultos en JSON y toArray()
     */
    protected $hidden = [];

    /**
     * Tipos de datos para casting
     */
    // protected $casts = [
    //     'fecha_finalizacion' => 'date',
    //     'estado' => 'string'
    // ];

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
