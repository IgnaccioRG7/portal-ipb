<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ModuloMateria extends Model
{
    protected $table = 'modulos_materias';

    protected $fillable = [
        'mod_id', 'mat_id', 'prof_id', 'orden', 'estado'
    ];

    protected $casts = [
        'orden' => 'integer',
    ];

    public function modulo(): BelongsTo
    {
        return $this->belongsTo(Modulo::class, 'mod_id');
    }

    public function materia(): BelongsTo
    {
        return $this->belongsTo(Materia::class, 'mat_id');
    }

    public function profesor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prof_id');
    }

    public function temas(): HasMany
    {
        return $this->hasMany(Tema::class, 'modulo_materia_id');
    }

    public function accesos(): HasMany
    {
        return $this->hasMany(Acceso::class, 'modulo_materia_id');
    }
}