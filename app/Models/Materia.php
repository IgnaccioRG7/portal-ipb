<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Materia extends Model
{
    protected $table = 'materias';

    protected $fillable = [
        'codigo_materia', 'nombre', 'descripcion', 'color'
    ];

    // RELACIONES ACTUALIZADAS
    public function moduloMaterias(): HasMany
    {
        return $this->hasMany(ModuloMateria::class, 'mat_id');
    }

    // Relación indirecta con cursos a través de módulos
    public function cursos()
    {
        return $this->belongsToMany(Curso::class, 'modulos_materias', 'mat_id', 'mod_id')
            ->using(ModuloMateria::class)
            ->withPivot('id', 'prof_id', 'orden', 'estado')
            ->withTimestamps();
    }

    // Relación indirecta con módulos
    public function modulos()
    {
        return $this->belongsToMany(Modulo::class, 'modulos_materias', 'mat_id', 'mod_id')
            ->withPivot('id', 'prof_id', 'orden', 'estado')
            ->withTimestamps();
    }
}