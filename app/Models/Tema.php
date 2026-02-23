<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tema extends Model
{
    protected $table = 'temas';

    protected $fillable = [
        'modulo_materia_id',
        'codigo_tema',
        'nombre',
        'descripcion',
        'contenido_json',
        'estado',
        'tipo',
        'visibilidad',
        'randomizar_preguntas',
        'randomizar_respuestas', 
        'max_intentos',
        'fecha_publicacion',
        'created_by'
    ];

    protected $casts = [
        'contenido_json' => 'array',
        'fecha_publicacion' => 'date',
        'randomizar_preguntas' => 'boolean',
        'randomizar_respuestas' => 'boolean', 
    ];

    // RELACIONES ACTUALIZADAS
    public function moduloMateria(): BelongsTo
    {
        return $this->belongsTo(ModuloMateria::class, 'modulo_materia_id');
    }

    public function creador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function examenesRealizados(): HasMany
    {
        return $this->hasMany(ExamenRealizado::class);
    }

    // Acceso indirecto al módulo
    public function modulo()
    {
        return $this->moduloMateria->modulo();
    }

    // Acceso indirecto a la materia
    public function materia()
    {
        return $this->moduloMateria->materia();
    }
}
