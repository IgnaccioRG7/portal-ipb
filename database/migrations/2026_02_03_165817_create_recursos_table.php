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
        Schema::create('recursos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo'); // Título del recurso
            $table->text('descripcion')->nullable(); // Descripción opcional
            $table->string('archivo'); // Ruta del archivo PDF
            $table->string('nombre_original'); // Nombre original del archivo
            $table->unsignedBigInteger('tamano'); // Tamaño en bytes
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Quién lo subió
            $table->boolean('visible')->default(true); // Si está visible públicamente
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recursos');
    }
};
