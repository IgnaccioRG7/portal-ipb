<?php

namespace Database\Seeders;

use App\Models\Rol;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['nombre' => 'Admin', 'descripcion' => 'Administrador del sistema'],
            ['nombre' => 'Profesor', 'descripcion' => 'Docente encargado de materias'],
            ['nombre' => 'Estudiante', 'descripcion' => 'Alumno del instituto'],
            ['nombre' => 'Tutor', 'descripcion' => 'Padre o apoderado del estudiante'],
        ];

        foreach ($roles as $rolData) {
            // Usamos updateOrCreate para evitar duplicados si corres el seeder dos veces
            Rol::updateOrCreate(
                ['nombre' => $rolData['nombre']], // Busca por nombre
                ['descripcion' => $rolData['descripcion']] // Actualiza descripción
            );
        }
    }
}
