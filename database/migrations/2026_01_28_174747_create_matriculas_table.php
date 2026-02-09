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
        Schema::create('matriculas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estudiante_id')->constrained('users');
            $table->foreignId('curso_id')->constrained('cursos');
            $table->string('codigo_matricula', 30)->nullable()->unique();
            $table->date('fecha_finalizacion')->nullable();
            $table->enum('estado', ['activo', 'finalizado', 'retirado', 'suspendido'])->default('activo');
            $table->text('observaciones')->nullable();
            $table->timestamps();

            // $table->unique(['estudiante_id', 'curso_id']);
            $table->index('estudiante_id');
            $table->index('curso_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matriculas');
    }
};
