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
        Schema::create('accesos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mat_id')->constrained('matriculas');
            $table->foreignId('modulo_materia_id')->constrained('modulos_materias');
            $table->integer('orden')->default(0);
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->timestamps();

            $table->unique(['mat_id', 'modulo_materia_id']);
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
