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

        $matRazonamientoLogico = Materia::firstOrCreate(
            ['codigo_materia' => 'RAZO-LOGI'],
            ['nombre' => 'Razonamiento Logico', 'area' => 'general']
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
                    "reading" => "La región andina de Bolivia ha experimentado una transformación profunda...",
                    "questions" => [
                        [
                            "id" => "cl1_1",
                            "type" => "select",
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
                            "type" => "select",
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
                            "type" => "select",
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
                    "reading" => "La región andina de Bolivia ha experimentado una transformación profunda...",
                    "questions" => [
                        [
                            "id" => "cl1_1",
                            "type" => "select",
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
                            "type" => "select",
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
                            "type" => "select",
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
                'tipo' => 'opcional',
                'contenido_json' => json_encode([
                    "questions" => [
                        [
                            "id" => "mat_1",
                            "type" => "select",
                            "text" => "Si 3x - 7 = 11",
                            "options" => ["4", "6", "5", "3"],
                            "correctAnswer" => 0
                        ],
                        [
                            "id" => "mat_2",
                            "type" => "select",
                            "text" => "¿2^5?",
                            "options" => ["10", "16", "32", "64"],
                            "correctAnswer" => 2
                        ],
                        [
                            "id" => "mat_3",
                            "type" => "select",
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
                'tipo' => 'opcional',
                'contenido_json' => json_encode([
                    "questions" => [
                        [
                            "id" => "fis_1",
                            "type" => "select",
                            "text" => "Unidad de fuerza",
                            "options" => ["Watt", "Newton", "Joule", "Pascal"],
                            "correctAnswer" => 1
                        ],
                        [
                            "id" => "fis_2",
                            "type" => "select",
                            "text" => "Velocidad constante",
                            "options" => ["Positiva", "Negativa", "Cero", "Infinita"],
                            "correctAnswer" => 2
                        ],
                        [
                            "id" => "fis_3",
                            "type" => "select",
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
                // 'nombre' => 'Le estamos dejando sin nombre porque no tiene es parte de la misma socioemocionales',
                'tipo' => 'opcional',
                'contenido_json' => json_encode([
                    "questions" => [
                        [
                            "id" => "se_m1",
                            "type" => "select",
                            "text" => "Un estudiante se equivoca en la pizarra y se bloquea. ¿Qué respuesta docente ayuda más?",
                            "options" => ["Si no sabes, siéntate", "No vuelvas a pasar", "Tranquilo, revisemos el procedimiento paso a paso", "Te falta cerebro para esto"],
                            "correctAnswer" => 2
                        ],
                        [
                            "id" => "se_m2",
                            "type" => "select",
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

        // --- Razonamiento Logico / sin nombre
        // $temaRazonamientoLogico = Tema::firstOrCreate(
        //     ['codigo_tema' => 'RAZOLO-01'],
        //     [
        //         'materia_id' => $matRazonamientoLogico->id,
        //         // 'nombre' => 'Le estamos dejando sin nombre porque no tiene es parte de la misma razonamiento logico',
        //         'tipo' => 'configurable',
        //         'contenido_json' => json_encode([
        //             "questions" => [
        //                 [
        //                     "id" => "rl_1",
        //                     "type" => "select",
        //                     "text" => "Si 5 cuadernos cuestan 25 bolivianos, ¿cuánto cuestan 8 cuadernos al mismo precio unitario?",
        //                     "options" => ["35", "40", "45", "50"],
        //                     "correctAnswer" => 1
        //                 ],
        //                 [
        //                     "id" => "rl_2",
        //                     "type" => "select",
        //                     "text" => "Completa la serie: 3, 6, 12, 24, __",
        //                     "options" => ["30", "36", "48", "60"],
        //                     "correctAnswer" => 2
        //                 ],
        //                 [
        //                     "id" => "rl_3",
        //                     "type" => "select",
        //                     "text" => "Si hoy es miércoles, ¿qué día será dentro de 10 días?",
        //                     "options" => ["Sábado", "Domingo", "Lunes", "Martes"],
        //                     "correctAnswer" => 2
        //                 ],
        //                 [
        //                     "id" => "rl_4",
        //                     "type" => "select",
        //                     "text" => "En una clase hay 30 estudiantes. Si 2/3 son mujeres, ¿cuántos varones hay?",
        //                     "options" => ["10", "15", "20", "25"],
        //                     "correctAnswer" => 0
        //                 ],
        //                 [
        //                     "id" => "rl_5",
        //                     "type" => "select",
        //                     "text" => "Si un tren recorre 120 km en 2 horas, ¿cuál es su velocidad promedio?",
        //                     "options" => ["40 km/h", "50 km/h", "60 km/h", "80 km/h"],
        //                     "correctAnswer" => 2
        //                 ],
        //                 [
        //                     "id" => "rl_6",
        //                     "type" => "select",
        //                     "text" => "Un libro tiene 200 páginas. Si ya leíste el 35%, ¿cuántas páginas leíste?",
        //                     "options" => ["60", "70", "80", "90"],
        //                     "correctAnswer" => 1
        //                 ],
        //                 [
        //                     "id" => "rl_7",
        //                     "type" => "select",
        //                     "text" => "Si A = 3 y B = 5, ¿cuál es el valor de 2A + B?",
        //                     "options" => ["8", "10", "11", "12"],
        //                     "correctAnswer" => 2
        //                 ],
        //                 [
        //                     "id" => "rl_8",
        //                     "type" => "select",
        //                     "text" => "Un rectángulo mide 8 cm de largo y 5 cm de ancho. ¿Cuál es su área?",
        //                     "options" => ["13", "20", "35", "40"],
        //                     "correctAnswer" => 3
        //                 ]
        //             ]
        //         ]),
        //         'estado' => 'activo',
        //         'created_by' => $admin->id
        //     ]
        // );

        $temaRazonamientoLogicoSeries = Tema::firstOrCreate(
            ['codigo_tema' => 'RAZOLO-01'],
            [
                'materia_id' => $matRazonamientoLogico->id,
                'nombre' => 'Series',
                'tipo' => 'configurable',
                'contenido_json' => json_encode([
                    "questions" => [
                        [
                            "id" => "rl_1",
                            "type" => "select",
                            "text" => "Si 5 cuadernos cuestan 25 bolivianos, ¿cuánto cuestan 8 cuadernos al mismo precio unitario?",
                            "options" => ["35", "40", "45", "50"],
                            "correctAnswer" => 1
                        ],
                        [
                            "id" => "rl_2",
                            "type" => "select",
                            "text" => "Completa la serie: 3, 6, 12, 24, __",
                            "options" => ["30", "36", "48", "60"],
                            "correctAnswer" => 2
                        ],
                    ]
                ]),
                'estado' => 'activo',
                'created_by' => $admin->id
            ]
        );

        $temaRazonamientoLogicoAritmetica = Tema::firstOrCreate(
            ['codigo_tema' => 'RAZOLO-02'],
            [
                'materia_id' => $matRazonamientoLogico->id,
                'nombre' => 'Aritmetica',
                'tipo' => 'configurable',
                'contenido_json' => json_encode([
                    "questions" => [
                        [
                            "id" => "rl_1",
                            "type" => "select",
                            "text" => "Si hoy es miércoles, ¿qué día será dentro de 10 días?",
                            "options" => ["Sábado", "Domingo", "Lunes", "Martes"],
                            "correctAnswer" => 2
                        ],
                        [
                            "id" => "rl_2",
                            "type" => "select",
                            "text" => "En una clase hay 30 estudiantes. Si 2/3 son mujeres, ¿cuántos varones hay?",
                            "options" => ["10", "15", "20", "25"],
                            "correctAnswer" => 0
                        ],
                        [
                            "id" => "rl_3",
                            "type" => "select",
                            "text" => "Si un tren recorre 120 km en 2 horas, ¿cuál es su velocidad promedio?",
                            "options" => ["40 km/h", "50 km/h", "60 km/h", "80 km/h"],
                            "correctAnswer" => 2
                        ],
                        [
                            "id" => "rl_4",
                            "type" => "select",
                            "text" => "Un libro tiene 200 páginas. Si ya leíste el 35%, ¿cuántas páginas leíste?",
                            "options" => ["60", "70", "80", "90"],
                            "correctAnswer" => 1
                        ],
                        [
                            "id" => "rl_5",
                            "type" => "select",
                            "text" => "Si A = 3 y B = 5, ¿cuál es el valor de 2A + B?",
                            "options" => ["8", "10", "11", "12"],
                            "correctAnswer" => 2
                        ],
                        [
                            "id" => "rl_6",
                            "type" => "select",
                            "text" => "Un rectángulo mide 8 cm de largo y 5 cm de ancho. ¿Cuál es su área?",
                            "options" => ["13", "20", "35", "40"],
                            "correctAnswer" => 3
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
        // Comprencion lectora - ESFM
        $cmCL = CursoMateria::firstOrCreate(
            ['curso_id' => $cursoESFM->id, 'materia_id' => $matComprension->id],
            ['horas_semanales' => 4, 'estado' => 'activa']
        );

        // Socio Emocionales - ESFM
        $cmSE = CursoMateria::firstOrCreate(
            ['curso_id' => $cursoESFM->id, 'materia_id' => $matSocioEmocionales->id],
            ['horas_semanales' => 2, 'estado' => 'activa']
        );

        // Razonamiento Logico - ESFM
        $cmRL = CursoMateria::firstOrCreate(
            ['curso_id' => $cursoESFM->id, 'materia_id' => $matRazonamientoLogico->id],
            ['horas_semanales' => 1, 'estado' => 'activa']
        );

        // Conocimientos generales - UNI
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

        // Dandole acceso a la lectura2 de comprension lectora 
        CursoMateriaTema::firstOrCreate(
            [
                'curso_materia_id' => $cmCL->id,
                'tema_id' => $temaLectura2->id,
                'mat_id' => $matricula2->id
            ],
            ['orden' => 2, 'estado' => 'activo']
        );

        // Dandole acceso a socio emocionales de Socio Emocionales
        CursoMateriaTema::firstOrCreate(
            [
                'curso_materia_id' => $cmSE->id,
                'tema_id' => $temaSocioEmocional->id,
                'mat_id' => $matricula2->id
            ],
            ['orden' => 2, 'estado' => 'activo']
        );

        // Dandole acceso a razonamiento logico de Razonamiento Logico sin nombre
        // CursoMateriaTema::firstOrCreate(
        //     [
        //         'curso_materia_id' => $cmRL->id,
        //         'tema_id' => $temaRazonamientoLogico->id,
        //         'mat_id' => $matricula2->id
        //     ],
        //     ['orden' => 2, 'estado' => 'activo']
        // );

        CursoMateriaTema::firstOrCreate(
            [
                'curso_materia_id' => $cmRL->id,
                'tema_id' => $temaRazonamientoLogicoAritmetica->id,
                'mat_id' => $matricula2->id
            ],
            ['orden' => 2, 'estado' => 'activo']
        );
        
        CursoMateriaTema::firstOrCreate(
            [
                'curso_materia_id' => $cmRL->id,
                'tema_id' => $temaRazonamientoLogicoSeries->id,
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
        // CursoMateriaTema::firstOrCreate(
        //     [
        //         'curso_materia_id' => $cmCG->id,
        //         'tema_id' => $temaFisica->id,
        //         'mat_id' => $matricula->id
        //     ],
        //     ['orden' => 2, 'estado' => 'activo']
        // );
    }
}
