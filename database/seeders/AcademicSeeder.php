<?php

namespace Database\Seeders;

use App\Models\Curso;
use App\Models\CursoMateria;
use App\Models\CursoMateriaTema;
use App\Models\Materia;
use App\Models\Tema;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AcademicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener usuario admin
        $adminUser = User::where('email', 'admin@instituto.com')->first();
        $adminId = $adminUser ? $adminUser->id : 1; 

        // ---------------------------------------------------------
        // 1. CREAR CURSOS
        // ---------------------------------------------------------
        $cursoInstitutos = Curso::firstOrCreate(
            ['codigo_curso' => 'CUR-INST-01'],
            [
                'nombre' => 'Institutos',
                'descripcion' => 'Preparación para institutos técnicos',
                'nivel' => 'básico',
                'precio' => 150.00,
            ]
        );

        $cursoUniversidades = Curso::firstOrCreate(
            ['codigo_curso' => 'CUR-UNI-01'],
            [
                'nombre' => 'Universidades',
                'descripcion' => 'Preparación para examen de ingreso universitario',
                'nivel' => 'avanzado',
                'precio' => 250.00,
            ]
        );

        // ---------------------------------------------------------
        // 2. CREAR MATERIAS
        // ---------------------------------------------------------
        $matRazonamiento = Materia::firstOrCreate(
            ['codigo_materia' => 'MAT-RL'],
            ['nombre' => 'Razonamiento Lógico', 'area' => 'general']
        );

        $matConocimientos = Materia::firstOrCreate(
            ['codigo_materia' => 'MAT-CG'],
            ['nombre' => 'Conocimientos Generales', 'area' => 'general']
        );

        // ---------------------------------------------------------
        // 3. CREAR TEMAS
        // ---------------------------------------------------------
        $jsonMate = json_encode(["questions" => [["id" => "m1", "text" => "¿2+2?", "options" => ["3","4","5"], "correctAnswer" => 1]]]);
        $jsonLeng = json_encode(["questions" => [["id" => "l1", "text" => "¿Sinónimo de feliz?", "options" => ["Triste","Alegre"], "correctAnswer" => 1]]]);

        $temaRazLogico = Tema::firstOrCreate(
            ['codigo_tema' => 'TEMA-RL-01'],
            [
                'materia_id' => $matRazonamiento->id,
                'nombre' => 'Series y Lógica',
                'contenido_json' => $jsonMate,
                'estado' => 'activo',
                'created_by' => $adminId
            ]
        );

        $temaMatematica = Tema::firstOrCreate(
            ['codigo_tema' => 'TEMA-CG-MAT'],
            [
                'materia_id' => $matConocimientos->id,
                'nombre' => 'Matemática General',
                'contenido_json' => $jsonMate,
                'estado' => 'activo',
                'created_by' => $adminId
            ]
        );

        $temaLenguaje = Tema::firstOrCreate(
            ['codigo_tema' => 'TEMA-CG-LEN'],
            [
                'materia_id' => $matConocimientos->id,
                'nombre' => 'Lenguaje',
                'contenido_json' => $jsonLeng,
                'estado' => 'activo',
                'created_by' => $adminId
            ]
        );

        // ---------------------------------------------------------
        // 4. VINCULACIÓN (Usando firstOrCreate para asegurar el ID)
        // ---------------------------------------------------------

        // === CASO 1: Institutos -> Conocimientos Generales (Solo ve Matemática) ===
        $cmInstitutosCG = CursoMateria::firstOrCreate(
            [
                'curso_id' => $cursoInstitutos->id,
                'materia_id' => $matConocimientos->id
            ],
            [
                'horas_semanales' => 4,
                'estado' => 'activa'
            ]
        );

        CursoMateriaTema::firstOrCreate(
            [
                'curso_materia_id' => $cmInstitutosCG->id, // Ahora sí tendrá ID seguro
                'tema_id' => $temaMatematica->id
            ],
            [
                'orden' => 1,
                'estado' => 'activo'
            ]
        );

        // === CASO 2: Universidades -> Conocimientos Generales (Solo ve Lenguaje) ===
        $cmUniCG = CursoMateria::firstOrCreate(
            [
                'curso_id' => $cursoUniversidades->id,
                'materia_id' => $matConocimientos->id
            ],
            [
                'horas_semanales' => 4,
                'estado' => 'activa'
            ]
        );

        CursoMateriaTema::firstOrCreate(
            [
                'curso_materia_id' => $cmUniCG->id,
                'tema_id' => $temaLenguaje->id
            ],
            [
                'orden' => 1,
                'estado' => 'activo'
            ]
        );

        // === CASO 3: Ambos ven Razonamiento Lógico ===
        
        // Institutos
        $cmInstitutosRL = CursoMateria::firstOrCreate(
            [
                'curso_id' => $cursoInstitutos->id,
                'materia_id' => $matRazonamiento->id
            ],
            ['horas_semanales' => 3, 'estado' => 'activa']
        );

        CursoMateriaTema::firstOrCreate(
            ['curso_materia_id' => $cmInstitutosRL->id, 'tema_id' => $temaRazLogico->id],
            ['orden' => 1, 'estado' => 'activo']
        );

        // Universidades
        $cmUniRL = CursoMateria::firstOrCreate(
            [
                'curso_id' => $cursoUniversidades->id,
                'materia_id' => $matRazonamiento->id
            ],
            ['horas_semanales' => 3, 'estado' => 'activa']
        );

        CursoMateriaTema::firstOrCreate(
            ['curso_materia_id' => $cmUniRL->id, 'tema_id' => $temaRazLogico->id],
            ['orden' => 1, 'estado' => 'activo']
        );
    }
}
