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
        Schema::create('asignaciones_profesores', function (Blueprint $table) {
            $table->id();

            $table->foreignId('profesor_id')
                ->constrained('users');

            $table->foreignId('curso_materia_id')
                ->constrained('curso_materias');

            $table->date('fecha_asignacion')->nullable();
            $table->date('fecha_finalizacion')->nullable();

            $table->enum('estado', [
                'activo',
                'finalizado',
                'suspendido'
            ])->default('activo');

            $table->integer('horas_asignadas')->nullable();
            $table->text('observaciones')->nullable();

            $table->timestamps();

            $table->unique(['profesor_id', 'curso_materia_id']);
            $table->index('profesor_id');
            $table->index('curso_materia_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asignaciones_profesores');
    }
};
