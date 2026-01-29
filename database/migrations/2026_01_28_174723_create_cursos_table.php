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
        Schema::create('cursos', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_curso', 20)->unique();
            $table->string('nombre', 200);
            $table->text('descripcion')->nullable();
            $table->enum('nivel', ['básico', 'intermedio', 'avanzado', 'especializado'])->default('básico');
            $table->integer('duracion_semanas')->nullable();
            $table->integer('horas_semanales')->default(5);
            $table->decimal('precio', 10, 2)->default(0);
            $table->integer('capacidad_maxima')->default(30);
            $table->enum('estado', ['activo', 'inactivo', 'completo', 'cancelado'])->default('activo');
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->string('imagen_url')->nullable();
            $table->string('requisitos')->nullable();
            // $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cursos');
    }
};
