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

            $table->foreignId('modulo_materia_id')
                ->constrained('modulos_materias')
                ->onDelete('cascade');

            $table->string('titulo', 255);
            $table->string('descripcion', 255);
            $table->string('tipo', 255);
            $table->string('url', 255);
            $table->string('visibilidad', 255);
            $table->integer('descargas')->default(0);

            $table->enum('estado', ['activo', 'inactivo'])->default('activo');

            $table->timestamps();
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
