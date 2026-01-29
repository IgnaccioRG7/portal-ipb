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
        Schema::create('temas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('materia_id')->constrained('materias');
            $table->string('codigo_tema', 30)->nullable();
            $table->string('nombre', 150);
            $table->text('descripcion')->nullable();
            $table->integer('orden')->nullable();
            $table->json('contenido_json');
            $table->enum('estado', ['activo', 'inactivo', 'borrador'])->default('borrador');
            $table->enum('visibilidad', ['publico', 'estudiantes', 'profesores'])->default('estudiantes');
            $table->date('fecha_publicacion')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();

            $table->index('materia_id');
            $table->index('created_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('temas');
    }
};
