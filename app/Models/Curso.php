<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Curso extends Model
{
    protected $table = 'cursos';

    protected $fillable = [
        'codigo_curso', 'nombre', 'descripcion', 'nivel',
        'duracion_semanas', 'horas_semanales', 'precio',
        'capacidad_maxima', 'estado', 'fecha_inicio',
        'fecha_fin', 'imagen_url', 'requisitos'
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'precio' => 'decimal:2',
    ];

    // RELACIONES ACTUALIZADAS
    public function modulos(): HasMany
    {
        return $this->hasMany(Modulo::class);
    }

    public function matriculas(): HasMany
    {
        return $this->hasMany(Matricula::class);
    }

    // Relación indirecta con materias a través de módulos
    public function materias()
    {
        return $this->hasManyThrough(
            Materia::class,
            ModuloMateria::class,
            'mod_id', // Foreign key on modulo_materias table
            'id', // Foreign key on materias table
            'id', // Local key on cursos table
            'mat_id' // Local key on modulo_materias table
        )->distinct();
    }
}