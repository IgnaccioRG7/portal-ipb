<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('curso_materia_temas', function (Blueprint $table) {
            $table->id();
            
            // Relación con la tabla intermedia padre
            $table->foreignId('curso_materia_id')
                  ->constrained('curso_materias')
                  ->onDelete('cascade'); 
            
            // Relación con el tema específico
            $table->foreignId('tema_id')
                  ->constrained('temas')
                  ->onDelete('cascade');

            $table->integer('orden')->default(1); // Para ordenar el temario
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            
            $table->timestamps();
            
            // Evitar duplicar el mismo tema en la misma asignación de curso
            $table->unique(['curso_materia_id', 'tema_id']); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curso_materia_temas');
    }
};
