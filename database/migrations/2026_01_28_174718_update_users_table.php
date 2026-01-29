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
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('persona_id')->after('id')->constrained('personas');
            $table->foreignId('rol_id')->after('persona_id')->constrained('roles');

            $table->enum('estado', ['activo', 'inactivo', 'bloqueado', 'pendiente'])
                ->default('pendiente');

            $table->timestamp('ultimo_acceso')->nullable();
            $table->integer('intentos_fallidos')->nullable();
            $table->timestamp('fecha_bloqueo')->nullable();

            $table->string('avatar_url')->default('/avatars/default.png');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
