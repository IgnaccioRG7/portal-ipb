<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Acceso extends Model
{
    protected $table = 'accesos';

    protected $fillable = [
        'mat_id', 'modulo_materia_id', 'orden', 'estado'
    ];

    protected $casts = [
        'orden' => 'integer',
    ];

    public function matricula(): BelongsTo
    {
        return $this->belongsTo(Matricula::class, 'mat_id');
    }

    public function moduloMateria(): BelongsTo
    {
        return $this->belongsTo(ModuloMateria::class, 'modulo_materia_id');
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