<?php

namespace Database\Seeders;

use App\Models\Persona;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Obtener Roles (Buscando por el modelo)
        $rolAdmin = Rol::where('nombre', 'Admin')->firstOrFail();
        $rolProfesor = Rol::where('nombre', 'Profesor')->firstOrFail();
        $rolEstudiante = Rol::where('nombre', 'Estudiante')->firstOrFail();
        $rolTutor = Rol::where('nombre', 'Tutor')->firstOrFail();

        // 2. Crear ADMIN
        $personaAdmin = Persona::firstOrCreate(
            ['ci' => '1000001'],
            [
                'nombre' => 'Carlos',
                'apellido_paterno' => 'Lopez',
                'genero' => 'masculino',
                'ciudad' => 'La Paz',
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@instituto.com'],
            [
                'persona_id' => $personaAdmin->id,
                'rol_id' => $rolAdmin->id,
                'name' => 'admin',
                'password' => Hash::make('password'),
                'estado' => 'activo',
            ]
        );

        // 3. Crear ESTUDIANTE (Con tutor)
        $personaEst = Persona::firstOrCreate(
            ['ci' => '4000004'],
            [
                'nombre' => 'Juanito',
                'apellido_paterno' => 'Gomez',
                'genero' => 'masculino',
                'ciudad' => 'El Alto',
            ]
            // 'parentesco_tutor' => 'hijo',
            // 'tutor_id' => $personaTutor->id, // Relación Eloquent
        );

        User::firstOrCreate(
            ['email' => 'estudiante@instituto.com'],
            [
                'persona_id' => $personaEst->id,
                'rol_id' => $rolEstudiante->id,
                'name' => 'juanito.gomez',
                'password' => Hash::make('password'),
                'estado' => 'activo',
            ]
        );

        // 4. Crear TUTOR (Padre) - Lo creamos para vincularlo al hijo
        $personaTutor = Persona::firstOrCreate(
            ['ci' => '3000003'],
            [
                'nombre' => 'Maria',
                'apellido_paterno' => 'Gomez',
                'genero' => 'femenino',
                'ciudad' => 'El Alto',
                'tutor_id' => $personaEst->id, // Relación Eloquent
                'parentesco_tutor' => 'madre',
            ]
        );

        User::firstOrCreate(
            ['email' => 'madre@instituto.com'],
            [
                'persona_id' => $personaTutor->id,
                'rol_id' => $rolTutor->id,
                'name' => 'maria.gomez',
                'password' => Hash::make('password'),
                'estado' => 'activo',
            ]
        );

        // 5. Crear PROFESOR
        $personaProf = Persona::firstOrCreate(
            ['ci' => '2000002'],
            [
                'nombre' => 'Roberto',
                'apellido_paterno' => 'Perez',
                'genero' => 'masculino',
                'ciudad' => 'La Paz',
            ]
        );

        User::firstOrCreate(
            ['email' => 'profe@instituto.com'],
            [
                'persona_id' => $personaProf->id,
                'rol_id' => $rolProfesor->id,
                'name' => 'roberto.perez',
                'password' => Hash::make('password'),
                'estado' => 'activo',
            ]
        );
    }
}
