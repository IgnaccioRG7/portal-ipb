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
        Schema::create('modulos_materias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mod_id')->constrained('modulos');
            $table->foreignId('mat_id')->constrained('materias');
            $table->foreignId('prof_id')->nullable()->constrained('users');
            $table->integer('orden')->default(0);
            $table->enum('estado', ['activo', 'inactivo'])->default('activo');
            $table->timestamps();

            $table->unique(['mod_id', 'mat_id', 'prof_id'], 'mod_mat_prof_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curso_materia_temas');
    }
};
