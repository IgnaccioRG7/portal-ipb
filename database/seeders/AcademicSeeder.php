<?php

namespace Database\Seeders;

use App\Models\Curso;
use App\Models\CursoMateria;
use App\Models\CursoMateriaTema;
use App\Models\Materia;
use App\Models\Matricula;
use App\Models\Tema;
use App\Models\User;
use Illuminate\Database\Seeder;

class AcademicSeeder extends Seeder
{
    public function run(): void
    {
        // =====================================================
        // ADMIN
        // =====================================================
        $admin = User::where('email', 'admin@instituto.com')->firstOrFail();

        // =====================================================
        // CURSOS
        // =====================================================
        $cursoESFM = Curso::firstOrCreate(
            ['codigo_curso' => 'ESFM-UAS'],
            [
                'nombre' => 'ESFM - UAS',
                'descripcion' => 'Curso de formación superior para profesores y maestros',
                'nivel' => 'intermedio',
                'precio' => 200,
            ]
        );

        $cursoUni = Curso::firstOrCreate(
            ['codigo_curso' => 'UNI-GRAL'],
            [
                'nombre' => 'Universidades',
                'descripcion' => 'Ingreso a universidades publicas y privadas',
                'nivel' => 'avanzado',
                'precio' => 300,
            ]
        );

        // =====================================================
        // MATERIAS
        // =====================================================
        $matComprension = Materia::firstOrCreate(
            ['codigo_materia' => 'COMP-LECT'],
            ['nombre' => 'Comprensión Lectora', 'area' => 'lenguaje']
        );

        $matConocimientos = Materia::firstOrCreate(
            ['codigo_materia' => 'CONOC-GEN'],
            ['nombre' => 'Conocimientos Generales', 'area' => 'general']
        );

        $matSocioEmocionales = Materia::firstOrCreate(
            ['codigo_materia' => 'SOCIO-EMO'],
            ['nombre' => 'Socio Emocionales', 'area' => 'general']
        );

        // =====================================================
        // TEMAS (JSON REAL)
        // =====================================================

        // --- Comprensión lectora - LECTURA 1 
        $temaLectura = Tema::firstOrCreate(
            ['codigo_tema' => 'CL-DEF-01'],
            [
                'materia_id' => $matComprension->id,
                'nombre' => 'Deforestación y cambio climático',
                'descripcion' => 'Lectura analítica',
                'tipo' => 'lectura',
                'contenido_json' => json_encode([
                    "text" => "La región andina de Bolivia ha experimentado una transformación profunda...",
                    "questions" => [
                        [
                            "id" => "cl1_1",
                            "text" => "¿Cuál fue la reducción porcentual?",
                            "options" => [
                                "85 %",
                                "15 %",
                                "20 %",
                                "2 %"
                            ],
                            "correctAnswer" => 1
                        ],
                        [
                            "id" => "cl1_2",
                            "text" => "Consecuencias de la deforestación",
                            "options" => [
                                "Disminución de temperatura",
                                "Aumento de 60 °C",
                                "Aumento de 16 °C",
                                "Aumento de 0,6 °C"
                            ],
                            "correctAnswer" => 3
                        ],
                        [
                            "id" => "cl1_3",
                            "text" => "Primer factor técnico",
                            "options" => [
                                "Reducción del albedo",
                                "Aumento del albedo",
                                "Disminución térmica",
                                "Evaporación"
                            ],
                            "correctAnswer" => 1
                        ]
                    ]
                ]),
                'estado' => 'activo',
                'created_by' => $admin->id
            ]
        );

        // --- Comprensión lectora - LECTURA 2 
        $temaLectura2 = Tema::firstOrCreate(
            ['codigo_tema' => 'CL-DEF-02'],
            [
                'materia_id' => $matComprension->id,
                'nombre' => 'Deforestación y cambio climático 2',
                'descripcion' => 'Lectura analítica 2',
                'tipo' => 'lectura',
                'contenido_json' => json_encode([
                    "text" => "La región andina de Bolivia ha experimentado una transformación profunda...",
                    "questions" => [
                        [
                            "id" => "cl1_1",
                            "text" => "¿Cuál fue la reducción porcentual?",
                            "options" => [
                                "85 %",
                                "15 %",
                                "20 %",
                                "2 %"
                            ],
                            "correctAnswer" => 1
                        ],
                        [
                            "id" => "cl1_2",
                            "text" => "Consecuencias de la deforestación",
                            "options" => [
                                "Disminución de temperatura",
                                "Aumento de 60 °C",
                                "Aumento de 16 °C",
                                "Aumento de 0,6 °C"
                            ],
                            "correctAnswer" => 3
                        ],
                        [
                            "id" => "cl1_3",
                            "text" => "Primer factor técnico",
                            "options" => [
                                "Reducción del albedo",
                                "Aumento del albedo",
                                "Disminución térmica",
                                "Evaporación"
                            ],
                            "correctAnswer" => 1
                        ]
                    ]
                ]),
                'estado' => 'activo',
                'created_by' => $admin->id
            ]
        );

        // --- Matemática
        $temaMatematica = Tema::firstOrCreate(
            ['codigo_tema' => 'MAT-01'],
            [
                'materia_id' => $matConocimientos->id,
                'nombre' => 'Matemática',
                'tipo' => 'normal',
                'contenido_json' => json_encode([
                    "questions" => [
                        [
                            "id" => "mat_1",
                            "text" => "Si 3x - 7 = 11",
                            "options" => ["4", "6", "5", "3"],
                            "correctAnswer" => 0
                        ],
                        [
                            "id" => "mat_2",
                            "text" => "¿2^5?",
                            "options" => ["10", "16", "32", "64"],
                            "correctAnswer" => 2
                        ],
                        [
                            "id" => "mat_3",
                            "text" => "Divisible entre 9",
                            "options" => [
                                "Termina en 0",
                                "Suma múltiplo de 9",
                                "Solo múltiplo de 3",
                                "Debe ser par"
                            ],
                            "correctAnswer" => 1
                        ]
                    ]
                ]),
                'estado' => 'activo',
                'created_by' => $admin->id
            ]
        );

        // --- Física
        $temaFisica = Tema::firstOrCreate(
            ['codigo_tema' => 'FIS-01'],
            [
                'materia_id' => $matConocimientos->id,
                'nombre' => 'Física',
                'tipo' => 'normal',
                'contenido_json' => json_encode([
                    "questions" => [
                        [
                            "id" => "fis_1",
                            "text" => "Unidad de fuerza",
                            "options" => ["Watt", "Newton", "Joule", "Pascal"],
                            "correctAnswer" => 1
                        ],
                        [
                            "id" => "fis_2",
                            "text" => "Velocidad constante",
                            "options" => ["Positiva", "Negativa", "Cero", "Infinita"],
                            "correctAnswer" => 2
                        ],
                        [
                            "id" => "fis_3",
                            "text" => "Velocidad promedio",
                            "options" => ["v=d/t", "v=m/a", "v=F·d", "v=t/d"],
                            "correctAnswer" => 0
                        ]
                    ]
                ]),
                'estado' => 'activo',
                'created_by' => $admin->id
            ]
        );

        // --- Socio Emocionales
        $temaSocioEmocional = Tema::firstOrCreate(
            ['codigo_tema' => 'SOCIO-01'],
            [
                'materia_id' => $matSocioEmocionales->id,
                'tipo' => 'directo',
                'contenido_json' => json_encode([
                    "questions" => [
                        [
                            "id" => "se_m1",
                            "text" => "Un estudiante se equivoca en la pizarra y se bloquea. ¿Qué respuesta docente ayuda más?",
                            "options" => ["Si no sabes, siéntate", "No vuelvas a pasar", "Tranquilo, revisemos el procedimiento paso a paso", "Te falta cerebro para esto"],
                            "correctAnswer" => 2
                        ],
                        [
                            "id" => "se_m2",
                            "text" => "Un estudiante dice: \"Odio matemáticas\". ¿Qué intervención es más adecuada?",
                            "options" => ["Entonces no estudies", "Eso no importa", "Veamos qué parte te cuesta y lo resolvemos juntos", "Te voy a poner mala nota"],
                            "correctAnswer" => 2
                        ]
                    ]
                ]),
                'estado' => 'activo',
                'created_by' => $admin->id
            ]
        );

        // =====================================================
        // CURSO → MATERIAS
        // =====================================================
        // Comprencion lectora
        $cmCL = CursoMateria::firstOrCreate(
            ['curso_id' => $cursoESFM->id, 'materia_id' => $matComprension->id],
            ['horas_semanales' => 4, 'estado' => 'activa']
        );

        // Socio Emocionales
        $cmSE = CursoMateria::firstOrCreate(
            ['curso_id' => $cursoESFM->id, 'materia_id' => $matSocioEmocionales->id],
            ['horas_semanales' => 2, 'estado' => 'activa']
        );

        // Conocimientos generales
        $cmCG = CursoMateria::firstOrCreate(
            ['curso_id' => $cursoUni->id, 'materia_id' => $matConocimientos->id],
            ['horas_semanales' => 4, 'estado' => 'activa']
        );

        // =====================================================
        // MATRÍCULA DEL ESTUDIANTE
        // =====================================================
        $estudiante = User::where('email', 'estudiante@instituto.com')->firstOrFail();

        // Matriculado al curso de UNIVERSIDADES
        $matricula = Matricula::firstOrCreate(
            ['estudiante_id' => $estudiante->id, 'curso_id' => $cursoUni->id],
            ['codigo_matricula' => 'MAT-001']
            );
        
        // Matriculado al curso de ESFM
        $matricula2 = Matricula::firstOrCreate(
            ['estudiante_id' => $estudiante->id, 'curso_id' => $cursoESFM->id],
            ['codigo_matricula' => 'MAT-002']
            );

        // =====================================================
        // ACCESO A TEMAS (curso_materia_temas)
        // =====================================================
        // Dandole acceso a la lectura1 de comprension lectora 
        // -----------PARA ESTO DEBERIA MATRICULARSE EN EL CURSO DE ESFM
        CursoMateriaTema::firstOrCreate(
            [
                'curso_materia_id' => $cmCL->id,
                'tema_id' => $temaLectura->id,
                'mat_id' => $matricula2->id
            ],
            ['orden' => 2, 'estado' => 'activo']
        );

        CursoMateriaTema::firstOrCreate(
            [
                'curso_materia_id' => $cmCL->id,
                'tema_id' => $temaLectura2->id,
                'mat_id' => $matricula2->id
            ],
            ['orden' => 2, 'estado' => 'activo']
        );

        // Dandole acceso a la lectura2 de comprension lectora 
        
        // Dandole acceso a socio emocionales de Socio Emocionales
        CursoMateriaTema::firstOrCreate(
            [
                'curso_materia_id' => $cmSE->id,
                'tema_id' => $temaSocioEmocional->id,
                'mat_id' => $matricula2->id
            ],
            ['orden' => 2, 'estado' => 'activo']
        );

        // -----------PARA ESTO DEBERIA MATRICULARSE EN EL CURSO DE UNIVERSIDADES
        // Dandole acceso al tema matematica
        CursoMateriaTema::firstOrCreate(
            [
                'curso_materia_id' => $cmCG->id,
                'tema_id' => $temaMatematica->id,
                'mat_id' => $matricula->id
            ],
            ['orden' => 1, 'estado' => 'activo']
        );

        // Dandole acceso al tema fisica
        CursoMateriaTema::firstOrCreate(
            [
                'curso_materia_id' => $cmCG->id,
                'tema_id' => $temaFisica->id,
                'mat_id' => $matricula->id
            ],
            ['orden' => 2, 'estado' => 'activo']
        );
    }
}
