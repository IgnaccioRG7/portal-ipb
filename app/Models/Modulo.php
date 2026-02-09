<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Modulo extends Model
{
    protected $table = 'modulos';

    protected $fillable = [
        'curso_id', 'codigo_modulo', 'nombre', 'descripcion',
        'orden', 'fecha_inicio', 'fecha_fin', 'estado'
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'orden' => 'integer',
    ];

    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class);
    }

    public function moduloMaterias(): HasMany
    {
        return $this->hasMany(ModuloMateria::class, 'mod_id');
    }

    public function materias()
    {
        return $this->belongsToMany(Materia::class, 'modulos_materias', 'mod_id', 'mat_id')
            ->withPivot('id', 'prof_id', 'orden', 'estado')
            ->withTimestamps();
    }
}