<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Matricula extends Model
{
    protected $table = 'matriculas';

    protected $fillable = [
        'estudiante_id',
        'curso_id',
        'codigo_matricula',
        'fecha_finalizacion',
        'estado',
        'observaciones',
        'created_by'
    ];

    protected $casts = [
        'fecha_finalizacion' => 'date',
    ];

    // RELACIONES ACTUALIZADAS
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    public function curso(): BelongsTo
    {
        return $this->belongsTo(Curso::class);
    }

    public function accesos(): HasMany
    {
        return $this->hasMany(Acceso::class, 'mat_id');
    }

    public function examenesRealizados(): HasMany
    {
        return $this->hasMany(ExamenRealizado::class);
    }

    // Acceso a módulos a través de accesos
    public function modulos()
    {
        return $this->hasManyThrough(
            Modulo::class,
            Acceso::class,
            'mat_id', // Foreign key on accesos table
            'id', // Foreign key on modulos table
            'id', // Local key on matriculas table
            'modulo_materia_id' // Local key on accesos table
        )->distinct();
    }
}
