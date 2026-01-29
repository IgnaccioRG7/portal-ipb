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
        Schema::create('examenes', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_examen', 30)->unique();
            $table->foreignId('curso_materia_id')->constrained('curso_materias');
            $table->string('titulo', 200);
            $table->text('descripcion')->nullable();
            $table->enum('tipo', ['evaluativo', 'practico', 'simulacro', 'diagnostico'])->default('evaluativo');
            $table->json('contenido_json');
            $table->integer('duracion_minutos')->default(60);
            $table->integer('intentos_permitidos')->default(1);
            $table->dateTime('fecha_disponible')->nullable();
            $table->dateTime('fecha_limite')->nullable();
            $table->enum('mostrar_resultados', ['inmediato', 'despues_fecha', 'nunca'])->default('inmediato');
            $table->decimal('porcentaje_aprobacion', 5, 2)->default(60);
            $table->enum('estado', ['borrador', 'publicado', 'finalizado', 'archivado'])->default('borrador');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();

            $table->index(['fecha_disponible', 'fecha_limite']);
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examenes');
    }
};
