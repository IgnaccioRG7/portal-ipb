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
        // TODO: arreglar esta foranea ya que si elimina el registro de la tabla modulo_materia entonces eliminara todos los temas asociados a esta. Entonces si un profesor creo temas en esta materia y por x motivo le volvemos a asignar entonces elimina esos temas eso es un ERROR
        Schema::create('temas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('modulo_materia_id')->constrained('modulos_materias')->onDelete('cascade');
            $table->string('codigo_tema', 30)->nullable();
            $table->string('nombre', 150);
            $table->text('descripcion')->nullable();
            $table->json('contenido_json');
            $table->enum('estado', ['activo', 'inactivo', 'borrador'])->default('borrador');
            $table->enum('visibilidad', ['publico', 'estudiantes', 'profesores'])->default('estudiantes');
            $table->date('fecha_publicacion')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();

            $table->index(['modulo_materia_id']);
            $table->index(['created_by']);
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
