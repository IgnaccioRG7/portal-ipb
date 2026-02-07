<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tema extends Model
{
    //
    protected $table = 'temas';

    protected $fillable = [
        'materia_id',
        'codigo_tema',
        'nombre',
        'descripcion',
        'orden',
        'contenido_json',
        'estado',
        'visibilidad',
        'tipo',
        'fecha_publicacion',
        'created_by'
    ];

    // protected $casts = [
    //     'contenido_json' => 'json',
    // ];
    
    public function materia() {
        return $this->belongsTo(Materia::class, 'materia_id');        
    }
}
