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
        Schema::create('materias', function (Blueprint $table) {
            $table->id();
            $table->string('codigo_materia', 20)->unique();
            $table->string('nombre', 150);
            $table->enum('area', ['ciencias', 'lenguaje', 'general', 'especifica'])->default('general');
            $table->string('color', 7)->default('#1e88e5');
            $table->text('objetivos_generales')->nullable();
            $table->timestamps();

            $table->index('nombre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materias');
    }
};
