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
        Schema::create('notificaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('users');
            $table->enum('tipo', [
                'calificacion',
                'examen',
                'mensaje',
                'sistema',
                'recordatorio',
                'anuncio'
            ]);
            $table->string('titulo', 150);
            $table->text('contenido')->nullable();
            $table->string('enlace')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('leido_at')->nullable();
            $table->timestamp('expira_at')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('tipo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notificaciones');
    }
};
