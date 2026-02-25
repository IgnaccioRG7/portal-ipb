<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecursoEstudio extends Model
{
    protected $table = 'recursos_estudio';
    
    protected $fillable = [
        'modulo_materia_id',
        'titulo',
        'descripcion',
        'tipo',
        'url',
        'visibilidad',
        'descargas',
        'estado',
    ];

    protected $casts = [
        'descargas' => 'integer',
    ];

    public function moduloMateria(): BelongsTo
    {
        return $this->belongsTo(ModuloMateria::class, 'modulo_materia_id');
    }
}
