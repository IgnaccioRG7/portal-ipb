<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tema extends Model
{
    //
    protected $table = 'temas';

    // protected $casts = [
    //     'contenido_json' => 'json',
    // ];
    
    public function materias() {
        return $this->belongsTo(Materia::class, 'materia_id');        
    }
}
