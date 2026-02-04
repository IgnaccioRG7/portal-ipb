<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recurso extends Model
{
    use HasFactory;

    protected $fillable = [
        'titulo',
        'descripcion',
        'archivo',
        'nombre_original',
        'tamano',
        'user_id',
        'visible',
        'categoria',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'tamano' => 'integer',
    ];

    /**
     * Relación con el usuario que subió el recurso
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtener el tamaño formateado
     */
    public function getTamanoFormateadoAttribute(): string
    {
        $bytes = $this->tamano;
        
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            return number_format($bytes / 1024, 2) . ' KB';
        }
        
        return $bytes . ' bytes';
    }

    /**
     * Obtener la URL pública del archivo
     */
    public function getUrlAttribute(): string
    {
        return asset('storage/' . $this->archivo);
    }
}
