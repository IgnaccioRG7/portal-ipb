<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tema extends Model
{
    //
    protected $table = 'temas';
    
    public function materias() {
        return $this->belongsTo(Materia::class, 'materia_id');        
    }
}
