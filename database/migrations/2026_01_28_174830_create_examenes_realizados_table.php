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
        Schema::create('examenes_realizados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tema_id')->constrained('temas');
            $table->foreignId('matricula_id')->constrained('matriculas');
            $table->integer('intento_numero')->default(1);
            $table->datetime('fecha_inicio')->useCurrent();
            $table->datetime('fecha_fin')->nullable();
            $table->integer('tiempo_utilizado')->nullable(); // en segundos
            $table->json('respuestas_json')->nullable();
            $table->decimal('puntaje_total', 5, 2)->nullable();
            $table->decimal('porcentaje', 5, 2)->nullable();
            $table->enum('estado', ['en_progreso', 'completado', 'abandonado', 'expirado'])->default('en_progreso');
            $table->foreignId('revisado_por')->nullable()->constrained('users');
            $table->datetime('fecha_revision')->nullable();
            $table->text('comentario_revisor')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
            
            $table->index(['tema_id', 'matricula_id']);
            $table->unique(['tema_id', 'matricula_id', 'intento_numero']);
            $table->index(['fecha_inicio']);
            $table->index(['estado']);
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('examenes_realizados');
    }
};
