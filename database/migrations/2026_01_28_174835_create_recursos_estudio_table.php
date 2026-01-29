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
        Schema::create('recursos_estudio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materia_id')->constrained('materias');
            $table->string('titulo', 200);
            $table->text('descripcion')->nullable();
            $table->enum('tipo', [
                'documento',
                'video',
                'enlace',
                'presentacion',
                'imagen',
                'audio'
            ]);
            $table->string('url', 500);
            $table->enum('visibilidad', ['publico', 'estudiantes', 'profesores'])->default('estudiantes');
            $table->integer('descargas')->default(0);
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();

            $table->index('materia_id');
            $table->index('tipo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recursos_estudio');
    }
};
