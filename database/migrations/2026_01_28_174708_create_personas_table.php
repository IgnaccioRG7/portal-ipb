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
        Schema::create('personas', function (Blueprint $table) {
            $table->id();
            $table->string('ci', 20)->unique();
            $table->string('nombre', 100);
            $table->string('apellido_paterno', 100);
            $table->string('apellido_materno', 100)->nullable();
            $table->date('fecha_nacimiento')->nullable();
            $table->enum('genero', ['masculino', 'femenino', 'otro'])->default('masculino');
            $table->string('celular', 20)->nullable();
            $table->text('direccion')->nullable();
            $table->string('ciudad', 100)->default('La Paz');
            $table->foreignId('tutor_id')->nullable()->constrained('personas');
            $table->enum('parentesco_tutor', ['padre', 'madre', 'tio', 'tia', 'abuelo', 'abuela', 'otro'])->nullable();
            $table->timestamps();

            $table->index(['nombre', 'apellido_paterno', 'apellido_materno']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personas');
    }
};
