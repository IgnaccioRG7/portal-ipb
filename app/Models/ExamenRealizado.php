<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExamenRealizado extends Model
{
    protected $table = 'examenes_realizados';

    protected $fillable = [
        'tema_id', 'matricula_id', 'intento_numero', 'fecha_inicio',
        'fecha_fin', 'tiempo_utilizado', 'respuestas_json', 'puntaje_total',
        'porcentaje', 'estado', 'revisado_por', 'fecha_revision',
        'comentario_revisor', 'ip_address', 'user_agent'
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
        'fecha_revision' => 'datetime',
        'respuestas_json' => 'array',
        'puntaje_total' => 'decimal:2',
        'porcentaje' => 'decimal:2',
        'tiempo_utilizado' => 'integer',
        'intento_numero' => 'integer',
    ];

    public function tema(): BelongsTo
    {
        return $this->belongsTo(Tema::class);
    }

    public function matricula(): BelongsTo
    {
        return $this->belongsTo(Matricula::class);
    }

    public function revisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'revisado_por');
    }

    // Calcular si está aprobado (por ejemplo, > 70%)
    public function getAprobadoAttribute()
    {
        return $this->porcentaje >= 70;
    }
}