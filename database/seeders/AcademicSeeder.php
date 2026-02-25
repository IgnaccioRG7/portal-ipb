<?php

namespace Database\Seeders;

use App\Models\Curso;
use App\Models\Materia;
use App\Models\Modulo;
use App\Models\ModuloMateria;
use App\Models\Tema;
use App\Models\User;
use App\Models\Matricula;
use App\Models\Acceso;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**************************************
 * ESTRUCTURA JERARQUICA DEL SEEDER CREADO
ESFM (Curso 1)
├── Módulo 1 (m1) - Ene-Jun 2026
│   └── CONOCIMIENTOS GENERALES (Materia)
│       ├── TEMA: MATEMATICA (Quiz con 3 preguntas)
│       └── TEMA: QUIMICA (Quiz con 2 preguntas)
│   └── LECTURAS DE COMPRENSION (Materia)
│       ├── TEMA: LECTURA 1 (Quiz sobre deforestación)
│
└── Módulo 2 (m2) - Jul-Dic 2026
    └── LECTURAS DE COMPRENSION (Materia)
        └── TEMA: LECTURA 2 (Quiz sobre cambio climático)

PREUNIVERSITARIOS (Curso 2)
├── Módulo 1 (m3) - Ene-Abr 2026
│   └── MATEMATICA (Materia)
│       └── TEMA: ECUACIONES (Quiz con 2 preguntas)
│
└── Módulo 2 (m4) - May-Ago 2026
    └── FISICA (Materia)
        ├── TEMA: MRU (Movimiento Rectilíneo Uniforme)
        └── TEMA: MRUV (Movimiento Rectilíneo Uniformemente Variado)
 * 
 * 
 * 
 MATRICULAS
 * ID | ESTUDIANTE_ID | CURSO_ID | CÓDIGO        | ESTADO
1  | 2 (estudiante)| 1 (ESFM) | MAT-ESFM-001  | activo
2  | 2 (estudiante)| 2 (PRE)  | MAT-PRE-001   | activo
 * 
 * 
 ACCESOS
 * ID | MAT_ID | MODULO_MATERIA_ID | ORDEN | ESTADO
1  | 1      | 1 (m1+ma1)        | 1     | activo
2  | 1      | 2 (m2+ma2)        | 2     | activo
3  | 2      | 3 (m3+ma3)        | 1     | activo
4  | 2      | 4 (m4+ma4)        | 2     | activo
 */

class AcademicSeeder extends Seeder
{
    public function run(): void
    {
        // =====================================================
        // LIMPIAR TABLAS - FORMA COMPATIBLE CON SQLITE Y MYSQL
        // =====================================================

        // 1. Deshabilitar claves foráneas según el motor de BD
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        } else {
            DB::statement('PRAGMA foreign_keys = OFF;');
        }

        // 2. Eliminar datos en orden inverso (primero los dependientes)
        // Usar delete() en lugar de truncate() para compatibilidad

        // Tablas con dependencias (eliminar primero)
        DB::table('examenes_realizados')->delete();
        DB::table('temas')->delete();
        DB::table('accesos')->delete();
        DB::table('modulos_materias')->delete();

        // Tablas principales (eliminar después)
        DB::table('matriculas')->delete();
        DB::table('modulos')->delete();
        DB::table('cursos')->delete();
        DB::table('materias')->delete();

        // 3. Resetear autoincrementos (si es necesario)
        if (DB::getDriverName() !== 'sqlite') {
            // Para MySQL
            DB::statement('ALTER TABLE examenes_realizados AUTO_INCREMENT = 1');
            DB::statement('ALTER TABLE temas AUTO_INCREMENT = 1');
            DB::statement('ALTER TABLE accesos AUTO_INCREMENT = 1');
            DB::statement('ALTER TABLE modulos_materias AUTO_INCREMENT = 1');
            DB::statement('ALTER TABLE matriculas AUTO_INCREMENT = 1');
            DB::statement('ALTER TABLE modulos AUTO_INCREMENT = 1');
            DB::statement('ALTER TABLE cursos AUTO_INCREMENT = 1');
            DB::statement('ALTER TABLE materias AUTO_INCREMENT = 1');
        } else {
            // Para SQLite
            DB::statement('DELETE FROM sqlite_sequence WHERE name IN (
                "examenes_realizados", "temas", "accesos", "modulos_materias",
                "matriculas", "modulos", "cursos", "materias"
            )');
        }

        // 4. Habilitar claves foráneas de nuevo
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        } else {
            DB::statement('PRAGMA foreign_keys = ON;');
        }

        // =====================================================
        // ADMIN
        // =====================================================
        $admin = User::where('email', 'admin@instituto.com')->firstOrFail();
        $prof = User::where('email', 'profe@instituto.com')->firstOrFail();

        // =====================================================
        // CURSOS
        // =====================================================
        $cursoESFM = Curso::create([
            'codigo_curso' => 'c1',
            'nombre' => 'ESFM',
            'descripcion' => 'Escuela Superior de Formación de Maestros',
            'nivel' => 'avanzado',
            'precio' => 200,
            'estado' => 'activo',
            'capacidad_maxima' => 30,
        ]);

        $cursoPreuniversitario = Curso::create([
            'codigo_curso' => 'c2',
            'nombre' => 'PREUNIVERSITARIOS',
            'descripcion' => 'Preparación para ingreso a universidades',
            'nivel' => 'avanzado',
            'precio' => 300,
            'estado' => 'activo',
            'capacidad_maxima' => 40,
        ]);

        // =====================================================
        // MÓDULOS
        // =====================================================
        $moduloESFM1 = Modulo::create([
            'curso_id' => $cursoESFM->id,
            'codigo_modulo' => 'm1',
            'nombre' => 'Módulo 1',
            'fecha_inicio' => '2026-01-01',
            'fecha_fin' => '2026-06-30',
        ]);

        $moduloESFM2 = Modulo::create([
            'curso_id' => $cursoESFM->id,
            'codigo_modulo' => 'm2',
            'nombre' => 'Módulo 2',
            'fecha_inicio' => '2026-07-01',
            'fecha_fin' => '2026-12-31',
        ]);

        $moduloPreuni1 = Modulo::create([
            'curso_id' => $cursoPreuniversitario->id,
            'codigo_modulo' => 'm1',
            'nombre' => 'Módulo 1',
            'fecha_inicio' => '2026-01-01',
            'fecha_fin' => '2026-04-30',
        ]);

        $moduloPreuni2 = Modulo::create([
            'curso_id' => $cursoPreuniversitario->id,
            'codigo_modulo' => 'm2',
            'nombre' => 'Módulo 2',
            'fecha_inicio' => '2026-05-01',
            'fecha_fin' => '2026-08-31',
        ]);

        // =====================================================
        // MATERIAS
        // =====================================================
        $materiaConocimientos = Materia::create([
            'codigo_materia' => 'ma1',
            'nombre' => 'CONOCIMIENTOS GENERALES',
            'descripcion' => 'Evaluación de conocimientos generales',
            'color' => '#4CAF50',
        ]);

        $materiaLectura = Materia::create([
            'codigo_materia' => 'ma2',
            'nombre' => 'LECTURAS DE COMPRENSION',
            'descripcion' => 'Comprensión lectora y análisis de textos',
            'color' => '#2196F3',
        ]);

        $materiaMatematica = Materia::create([
            'codigo_materia' => 'ma3',
            'nombre' => 'MATEMATICA',
            'descripcion' => 'Matemática básica y avanzada',
            'color' => '#FF9800',
        ]);

        $materiaFisica = Materia::create([
            'codigo_materia' => 'ma4',
            'nombre' => 'FISICA',
            'descripcion' => 'Física general y aplicada',
            'color' => '#9C27B0',
        ]);

        $materiaQuimica = Materia::create([
            'codigo_materia' => 'ma5',
            'nombre' => 'QUIMICA',
            'descripcion' => 'Química general y orgánica',
            'color' => '#F44336',
        ]);

        // =====================================================
        // MÓDULOS_MATERIAS
        // =====================================================
        $modMat1 = ModuloMateria::create([
            'mod_id' => $moduloESFM1->id,
            'mat_id' => $materiaConocimientos->id,
            'prof_id' => $prof->id,
            'orden' => 1,
            'estado' => 'activo',
        ]);

        $modMat2 = ModuloMateria::create([
            'mod_id' => $moduloESFM1->id,
            'mat_id' => $materiaLectura->id,
            'prof_id' => $prof->id,
            'orden' => 2,
            'estado' => 'activo',
        ]);

        $modMat3 = ModuloMateria::create([
            'mod_id' => $moduloESFM2->id,
            'mat_id' => $materiaLectura->id,
            'prof_id' => $prof->id,
            'orden' => 1,
            'estado' => 'activo',
        ]);

        $modMat4 = ModuloMateria::create([
            'mod_id' => $moduloPreuni1->id,
            'mat_id' => $materiaMatematica->id,
            'prof_id' => $prof->id,
            'orden' => 1,
            'estado' => 'activo',
        ]);

        $modMat5 = ModuloMateria::create([
            'mod_id' => $moduloPreuni2->id,
            'mat_id' => $materiaFisica->id,
            'prof_id' => $prof->id,
            'orden' => 1,
            'estado' => 'activo',
        ]);

        // =====================================================
        // TEMAS
        // =====================================================

        // Tema 1: MATEMATICA para CONOCIMIENTOS GENERALES (modMat1)
        $tema1 = Tema::create([
            'modulo_materia_id' => $modMat1->id,
            'codigo_tema' => 't1',
            'nombre' => 'MATEMATICA',
            'tipo' => 'opcional',
            'descripcion' => 'Fundamentos de matemática',
            'contenido_json' => json_encode([
                "questions" => [
                    [
                        "id" => "mat_1",
                        "type" => "select",
                        "text" => "Si 3x - 7 = 11, ¿cuál es el valor de x?",
                        "image" => null,
                        "options" => [
                            ["text" => "4", "image" => null],
                            ["text" => "6", "image" => null],
                            ["text" => "5", "image" => null],
                            ["text" => "3", "image" => null]
                        ],
                        "correctAnswer" => 0
                    ],
                    [
                        "id" => "mat_2",
                        "type" => "select",
                        "text" => "¿Cuál es el valor de 2^5?",
                        "image" => null,
                        "options" => [
                            ["text" => "10", "image" => null],
                            ["text" => "16", "image" => null],
                            ["text" => "32", "image" => null],
                            ["text" => "64", "image" => null]
                        ],
                        "correctAnswer" => 2
                    ],
                    [
                        "id" => "mat_3",
                        "type" => "select",
                        "text" => "¿Cuándo un número es divisible entre 9?",
                        "image" => null,
                        "options" => [
                            ["text" => "Cuando termina en 0", "image" => null],
                            ["text" => "Cuando la suma de sus dígitos es múltiplo de 9", "image" => null],
                            ["text" => "Cuando es múltiplo de 3", "image" => null],
                            ["text" => "Cuando es par", "image" => null]
                        ],
                        "correctAnswer" => 1
                    ]
                ]
            ]),
            'estado' => 'activo',
            'visibilidad' => 'estudiantes',
            'fecha_publicacion' => '2026-01-01',
            'created_by' => $admin->id,
        ]);

        // Tema 2: QUIMICA para CONOCIMIENTOS GENERALES (modMat1)
        $tema2 = Tema::create([
            'modulo_materia_id' => $modMat1->id,
            'codigo_tema' => 't2',
            'nombre' => 'QUIMICA',
            'tipo' => 'opcional',
            'descripcion' => 'Conceptos básicos de química',
            'contenido_json' => json_encode([
                "questions" => [
                    [
                        "id" => "quim_1",
                        "type" => "select",
                        "text" => "¿Cuál es el símbolo del oxígeno?",
                        "image" => "/private/preguntas/oxigeno.jfif",
                        "options" => [
                            ["text" => "Ox", "image" => null],
                            ["text" => "O", "image" => "/private/respuestas/o.png"],
                            ["text" => "Oxg", "image" => null],
                            ["text" => "Oz", "image" => null]
                        ],
                        "correctAnswer" => 1
                    ],
                    [
                        "id" => "quim_2",
                        "type" => "select",
                        "text" => "¿Qué elemento tiene número atómico 1?",
                        "image" => "/private/preguntas/hidrogeno.jpg",
                        "options" => [
                            ["text" => "Oxígeno", "image" => null],
                            ["text" => "Hidrógeno", "image" => "/private/respuestas/h.jpg"],
                            ["text" => "Helio", "image" => null],
                            ["text" => "Carbono", "image" => null]
                        ],
                        "correctAnswer" => 1
                    ]
                ]
            ]),
            'estado' => 'activo',
            'visibilidad' => 'estudiantes',
            'fecha_publicacion' => '2026-01-01',
            'created_by' => $admin->id,
        ]);

        // Tema 3: LECTURA 1 para LECTURAS DE COMPRENSION (modMat2)
        $tema3 = Tema::create([
            'modulo_materia_id' => $modMat2->id,
            'codigo_tema' => 't3',
            'nombre' => 'LECTURA 1',
            'tipo' => 'lectura',
            'descripcion' => 'Análisis de texto sobre deforestación',
            'contenido_json' => json_encode([
                "reading" => "La región andina de Bolivia ha experimentado una transformación profunda en las últimas décadas. Estudios científicos indican que la cobertura glaciar se ha reducido en un 85% desde 1975, afectando los recursos hídricos de millones de personas...",
                "questions" => [
                    [
                        "id" => "cl1_1",
                        "type" => "select",
                        "text" => "¿Cuál fue la reducción porcentual de la cobertura glaciar desde 1975?",
                        "image" => "/private/preguntas/glaciar.jpg",
                        "options" => [
                            ["text" => "85 %", "image" => null],
                            ["text" => "15 %", "image" => null],
                            ["text" => "20 %", "image" => null],
                            ["text" => "2 %", "image" => null]
                        ],
                        "correctAnswer" => 0
                    ],
                    [
                        "id" => "cl1_2",
                        "type" => "select",
                        "text" => "¿Cuál es una consecuencia de la deforestación mencionada en el texto?",
                        "image" => null,
                        "options" => [
                            ["text" => "Disminución de temperatura", "image" => null],
                            ["text" => "Aumento de 60 °C", "image" => null],
                            ["text" => "Aumento de 16 °C", "image" => null],
                            ["text" => "Aumento de 0,6 °C", "image" => null]
                        ],
                        "correctAnswer" => 3
                    ]
                ]
            ]),
            'estado' => 'activo',
            'visibilidad' => 'estudiantes',
            'fecha_publicacion' => '2026-07-01',
            'created_by' => $admin->id,
        ]);

        // Tema 4: LECTURA 2 para LECTURAS DE COMPRENSION (modMat3)
        $tema4 = Tema::create([
            'modulo_materia_id' => $modMat3->id,
            'codigo_tema' => 't4',
            'nombre' => 'LECTURA 2',
            'tipo' => 'lectura',
            'descripcion' => 'Análisis de texto ambiental',
            'contenido_json' => json_encode([
                "reading" => "El cambio climático representa uno de los mayores desafíos para la humanidad. Según el IPCC, las emisiones de gases de efecto invernadero deben reducirse en un 45% para 2030 para limitar el calentamiento global a 1.5°C...",
                "questions" => [
                    [
                        "id" => "cl2_1",
                        "type" => "select",
                        "text" => "¿Qué porcentaje de reducción de emisiones se necesita para 2030?",
                        "image" => null,
                        "options" => [
                            ["text" => "25 %", "image" => null],
                            ["text" => "45 %", "image" => null],
                            ["text" => "60 %", "image" => null],
                            ["text" => "75 %", "image" => null],
                        ],
                        "correctAnswer" => 1
                    ],
                    [
                        "id" => "cl2_2",
                        "type" => "select",
                        "text" => "¿Qué organización emite el informe mencionado?",
                        "options" => [
                            ["text" => "ONU", "image" => null],
                            ["text" => "IPCC", "image" => null],
                            ["text" => "OMS", "image" => null],
                            ["text" => "UNESCO", "image" => null],
                        ],
                        "correctAnswer" => 1
                    ]
                ]
            ]),
            'estado' => 'activo',
            'visibilidad' => 'estudiantes',
            'fecha_publicacion' => '2026-07-15',
            'created_by' => $admin->id,
        ]);

        // Tema 5: ECUACIONES para MATEMATICA (modMat4)
        $tema5 = Tema::create([
            'modulo_materia_id' => $modMat4->id,
            'codigo_tema' => 't5',
            'nombre' => 'ECUACIONES',
            'tipo' => 'opcional',
            'descripcion' => 'Resolución de ecuaciones lineales y cuadráticas',
            'contenido_json' => json_encode([
                "questions" => [
                    [
                        "id" => "ecu_1",
                        "type" => "select",
                        "text" => "Resuelve: 2x + 5 = 15",
                        "image" => null,
                        "options" => [
                            ["text" => "x = 5", "image" => "/private/respuestas/ecuacion1_5.jfif"],
                            ["text" => "x = 10", "image" => null],
                            ["text" => "x = 7.5", "image" => null],
                            ["text" => "x = 2", "image" => null]
                        ],
                        "correctAnswer" => 0
                    ],
                    [
                        "id" => "ecu_2",
                        "type" => "select",
                        "text" => "¿Cuál es la solución de x² - 4 = 0?",
                        "image" => "/private/preguntas/ecuacion2.png",
                        "options" => [
                            ["text" => "x = 2", "image" => null],
                            ["text" => "x = -2", "image" => null],
                            ["text" => "x = ±2", "image" => null],
                            ["text" => "x = 4", "image" => null]
                        ],
                        "correctAnswer" => 2
                    ]
                ]
            ]),
            'estado' => 'activo',
            'visibilidad' => 'estudiantes',
            'fecha_publicacion' => '2026-01-01',
            'created_by' => $admin->id,
        ]);


        // Tema 6: MRU para FISICA (modMat5)
        $tema6 = Tema::create([
            'modulo_materia_id' => $modMat5->id,
            'codigo_tema' => 't6',
            'nombre' => 'MRU',
            'tipo' => 'opcional',
            'descripcion' => 'Movimiento Rectilíneo Uniforme',
            'contenido_json' => json_encode([
                "questions" => [
                    [
                        "id" => "mru_1",
                        "type" => "select",
                        "text" => "¿Qué es el MRU?",
                        "image" => null,
                        "options" => [
                            ["text" => "Movimiento con aceleración constante", "image" => null],
                            ["text" => "Movimiento con velocidad constante", "image" => null],
                            ["text" => "Movimiento circular", "image" => null],
                            ["text" => "Movimiento acelerado", "image" => null]
                        ],
                        "correctAnswer" => 1
                    ],
                    [
                        "id" => "mru_2",
                        "type" => "select",
                        "text" => "Fórmula del MRU",
                        "image" => null,
                        "options" => [
                            ["text" => "v = d/t", "image" => null],
                            ["text" => "a = Δv/Δt", "image" => null],
                            ["text" => "F = m·a", "image" => null],
                            ["text" => "E = m·c²", "image" => null]
                        ],
                        "correctAnswer" => 0
                    ]
                ]
            ]),
            'estado' => 'activo',
            'visibilidad' => 'estudiantes',
            'fecha_publicacion' => '2026-05-01',
            'created_by' => $admin->id,
        ]);

        // Tema 7: MRUV para FISICA (modMat5)
        $tema7 = Tema::create([
            'modulo_materia_id' => $modMat5->id,
            'codigo_tema' => 't7',
            'nombre' => 'MRUV',
            'tipo' => 'opcional',
            'descripcion' => 'Movimiento Rectilíneo Uniformemente Variado',
            'contenido_json' => json_encode([
                "questions" => [
                    [
                        "id" => "mruv_1",
                        "type" => "select",
                        "text" => "Observa el gráfico de velocidad vs tiempo. ¿Qué tipo de movimiento representa?",
                        "image" => "/private/preguntas/grafico_mruv.jpg",
                        "options" => [
                            ["text" => "MRU", "image" => "/private/respuestas/grafico_mru_r.jpg"],
                            ["text" => "MRUV", "image" => "/private/respuestas/grafico_mruv_r.jpg"],
                            ["text" => "MCU", "image" => null],
                            ["text" => "Caída libre", "image" => null]
                        ],
                        "correctAnswer" => 1
                    ],
                    [
                        "id" => "mruv_2",
                        "type" => "select",
                        "text" => "Fórmula de posición en MRUV",
                        "image" => null,
                        "options" => [
                            ["text" => "x = x₀ + v·t", "image" => null],
                            ["text" => "x = x₀ + v₀·t + ½·a·t²", "image" => "/private/respuestas/formula_posicion.png"],
                            ["text" => "v = v₀ + a·t", "image" => null],
                            ["text" => "v² = v₀² + 2·a·Δx", "image" => null]
                        ],
                        "correctAnswer" => 1
                    ]
                ]
            ]),
            'estado' => 'activo',
            'visibilidad' => 'estudiantes',
            'fecha_publicacion' => '2026-05-15',
            'created_by' => $admin->id,
        ]);
        
        // =====================================================
        // MATRÍCULAS
        // =====================================================
        $estudiante = User::where('email', 'estudiante@instituto.com')->firstOrFail();

        // Matrícula en ESFM
        $matriculaESFM = Matricula::create([
            'estudiante_id' => $estudiante->id,
            'curso_id' => $cursoESFM->id,
            'codigo_matricula' => 'MAT-ESFM-001',
            'estado' => 'activo',
        ]);

        // Matrícula en PREUNIVERSITARIOS
        $matriculaPreuni = Matricula::create([
            'estudiante_id' => $estudiante->id,
            'curso_id' => $cursoPreuniversitario->id,
            'codigo_matricula' => 'MAT-PRE-001',
            'estado' => 'activo',
        ]);

        // =====================================================
        // ACCESOS A MODULOS_MATERIAS
        // =====================================================
        // Accesos para el estudiante en ESFM (módulo 1 y 2)
        Acceso::create([
            'mat_id' => $matriculaESFM->id,
            'modulo_materia_id' => $modMat1->id,
            'orden' => 1,
            'estado' => 'activo',
        ]);

        Acceso::create([
            'mat_id' => $matriculaESFM->id,
            'modulo_materia_id' => $modMat2->id,
            'orden' => 2,
            'estado' => 'activo',
        ]);

        Acceso::create([
            'mat_id' => $matriculaESFM->id,
            'modulo_materia_id' => $modMat3->id,
            'orden' => 3,
            'estado' => 'activo',
        ]);

        // Accesos para el estudiante en PREUNIVERSITARIOS (módulo 3 y 4)
        Acceso::create([
            'mat_id' => $matriculaPreuni->id,
            'modulo_materia_id' => $modMat4->id,
            'orden' => 1,
            'estado' => 'activo',
        ]);

        Acceso::create([
            'mat_id' => $matriculaPreuni->id,
            'modulo_materia_id' => $modMat5->id,
            'orden' => 2,
            'estado' => 'activo',
        ]);

        // =====================================================
        // INFORMACIÓN FINAL
        // =====================================================
        $this->command->info('Seeder ejecutado exitosamente!');
        $this->command->info('Estructura creada:');
        $this->command->info('- 2 Cursos (ESFM, PREUNIVERSITARIOS)');
        $this->command->info('- 4 Módulos (m1, m2, m3, m4)');
        $this->command->info('- 5 Materias');
        $this->command->info('- 5 Relaciones Módulo-Materia');
        $this->command->info('- 8 Temas con contenido JSON real');
        $this->command->info('- 2 Matrículas para el estudiante');
        $this->command->info('- 4 Accesos a módulos-materias');
    }
}
