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
        Schema::create('curso_materias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curso_id')->constrained('cursos');
            $table->foreignId('materia_id')->constrained('materias');
            // $table->json('temas_seleccionados')->nullable();
            $table->integer('horas_semanales')->default(3);
            $table->enum('estado', ['activa', 'inactiva'])->default('activa');
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->timestamps();

            $table->unique(['curso_id', 'materia_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curso_materias');
    }
};
