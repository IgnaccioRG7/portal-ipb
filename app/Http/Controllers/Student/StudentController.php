<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Acceso;
use App\Models\Curso;
use App\Models\CursoMateria;
use App\Models\CursoMateriaTema;
use App\Models\ExamenRealizado;
use App\Models\Materia;
use App\Models\Matricula;
use App\Models\Modulo;
use App\Models\ModuloMateria;
use App\Models\Tema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $student = auth()->guard()->user();

        $matriculas = $student->matriculas()
            ->where('estado', 'activo')
            ->with([
                'curso',
                'curso.modulos' => function ($query) use ($student) {
                    $query->where('estado', 'activo')
                        ->with([
                            'moduloMaterias' => function ($query) use ($student) {
                                $query->where('estado', 'activo')
                                    ->whereHas('accesos', function ($q) use ($student) {
                                        $q->whereHas('matricula', function ($mq) use ($student) {
                                            $mq->where('estudiante_id', $student->id)
                                                ->where('estado', 'activo');
                                        });
                                    })
                                    ->with([
                                        'materia',
                                        'temas' => function ($query) {
                                            $query->where('estado', 'activo');
                                        }
                                    ]);
                            }
                        ]);
                }
            ])
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->get()
            ->unique('curso_id')
            ->filter(function ($matricula) {
                return $matricula->curso && $matricula->curso->estado === 'activo';
            })
            ->values();

        Log::info('Matrículas cargadas:', [
            'count' => $matriculas->count(),
            'cursos' => $matriculas->pluck('curso.nombre')
        ]);
        Log::info($matriculas);

        $data = $matriculas->map(function ($matricula) {
            // Filtrar módulos que tienen moduloMaterias con acceso
            $modulosData = $matricula->curso->modulos->map(function ($modulo) use ($matricula) {
                // Filtrar moduloMaterias que tienen acceso para esta matrícula
                $moduloMateriasConAcceso = $modulo->moduloMaterias->filter(function ($moduloMateria) use ($matricula) {
                    return $moduloMateria->accesos->contains('mat_id', $matricula->id);
                });

                return [
                    'modulo_id' => $modulo->id,
                    'codigo_modulo' => $modulo->codigo_modulo,
                    'nombre' => $modulo->nombre,
                    'fecha_inicio' => $modulo->fecha_inicio,
                    'fecha_fin' => $modulo->fecha_fin,
                    'materias' => $moduloMateriasConAcceso->map(function ($moduloMateria) {
                        return [
                            'modulo_materia_id' => $moduloMateria->id,
                            'materia_id' => $moduloMateria->materia->id,
                            'materia_nombre' => $moduloMateria->materia->nombre,
                            'materia_descripcion' => $moduloMateria->materia->descripcion,
                        ];
                    })->values()
                ];
            })->filter(function ($moduloData) {
                // Filtrar módulos que tienen al menos una materia con acceso
                return $moduloData['materias']->isNotEmpty();
            })->values();

            return [
                'matricula_id' => $matricula->id,
                'codigo_matricula' => $matricula->codigo_matricula,
                'curso' => [
                    'id' => $matricula->curso->id,
                    'codigo_curso' => $matricula->curso->codigo_curso,
                    'nombre' => $matricula->curso->nombre,
                    'descripcion' => $matricula->curso->descripcion,
                ],
                'modulos' => $modulosData
            ];
        });

        return Inertia::render('dashboard', [
            'matriculas' => $data,
        ]);
    }

    public function subjects(Curso $course)
    {
        $studentId = auth()->guard()->id();

        // Buscar la matrícula activa del estudiante en este curso
        $matricula = Matricula::where('estudiante_id', $studentId)
            ->where('curso_id', $course->id)
            ->where('estado', 'activo')
            ->orderBy('created_at', 'desc')
            ->firstOrFail();

        // ✅ PASO 1: Obtener módulos con AL MENOS UNA MATERIA ACTIVA
        $modulos = Modulo::where('curso_id', $course->id)
            ->where('estado', 'activo')
            // ->with(['moduloMaterias' => function ($q) {
            //     $q->where('estado', 'activo');
            // }])
            ->orderBy('fecha_inicio')
            ->get();

        Log::info("Los modulos");
        Log::info($modulos);

        // Paso 2: Cargar relaciones para esos módulos
        if ($modulos->isNotEmpty()) {
            $modulos->load(['moduloMaterias' => function ($query) use ($matricula) {
                $query->where('estado', 'activo');
                $query->whereHas('accesos', function ($q) use ($matricula) {
                    $q->where('mat_id', $matricula->id)
                        ->where('estado', 'activo');
                })
                    ->with([
                        'materia',
                        'temas' => function ($q) {
                            $q->where('estado', 'activo')
                                ->orderBy('created_at');
                        }
                    ]);
            }]);
        }

        Log::info("Los modulos2222222222");
        Log::info($modulos);

        // Estructurar los datos para la vista
        $modulosData = $modulos->map(function ($modulo) {
            // Filtrar solo módulos-materias con temas
            $moduloMateriasConTemas = $modulo->moduloMaterias->filter(function ($moduloMateria) {
                return $moduloMateria->temas->count() > 0;
            });

            return [
                'id' => $modulo->id,
                'codigo_modulo' => $modulo->codigo_modulo,
                'nombre' => $modulo->nombre,
                'fecha_inicio' => $modulo->fecha_inicio,
                'fecha_fin' => $modulo->fecha_fin,
                'materias' => $moduloMateriasConTemas->map(function ($moduloMateria) {
                    return [
                        'modulo_materia_id' => $moduloMateria->id,
                        'materia' => [
                            'id' => $moduloMateria->materia->id,
                            'nombre' => $moduloMateria->materia->nombre,
                            'descripcion' => $moduloMateria->materia->descripcion,
                        ],
                        'temas' => $moduloMateria->temas->map(function ($tema) use ($moduloMateria) {
                            return [
                                'id' => $tema->id,
                                'nombre' => $tema->nombre,
                                'descripcion' => $tema->descripcion,
                                'codigo_tema' => $tema->codigo_tema,
                                'modulo_materia_id' => $moduloMateria->id,
                                'acceso_id' => $moduloMateria->accesos->first()?->id,
                            ];
                        }),
                        'total_temas' => $moduloMateria->temas->count(),
                    ];
                })->values(),
                'total_materias' => $moduloMateriasConTemas->count(),
                'total_temas' => $moduloMateriasConTemas->sum(function ($moduloMateria) {
                    return $moduloMateria->temas->count();
                }),
            ];
        })->filter(function ($modu) {
            // Filtrar módulos que tienen al menos una materia con acceso
            return $modu['total_materias'] > 0;
        })->values();

        // Calcular totales del curso
        $totalModulos = $modulosData->count();
        $totalMaterias = $modulosData->sum('total_materias');
        $totalTemas = $modulosData->sum('total_temas');

        return Inertia::render('Student/subjects', [
            'curso' => [
                'id' => $course->id,
                'nombre' => $course->nombre,
                'descripcion' => $course->descripcion,
                'total_modulos' => $totalModulos,
                'total_materias' => $totalMaterias,
                'total_temas' => $totalTemas,
            ],
            'modulos' => $modulosData,
        ]);
    }

    public function topics(Curso $curso, Modulo $modulo, Materia $materia, Request $request)
    {
        $studentId = auth()->guard()->id();

        // 1. Obtener la matrícula activa del estudiante en este curso
        $matricula = Matricula::where('estudiante_id', $studentId)
            ->where('curso_id', $curso->id)
            ->where('estado', 'activo')
            ->firstOrFail();

        // 2. Obtener el ModuloMateria específico para este módulo y materia
        // Debería haber solo uno (o ninguno) ya que es relación única módulo-materia
        $moduloMateria = ModuloMateria::whereHas('accesos', function ($query) use ($matricula) {
            $query->where('mat_id', $matricula->id)
                ->where('estado', 'activo');
        })
            ->where('mat_id', $materia->id)
            ->where('mod_id', $modulo->id)
            ->with(['temas' => function ($query) {
                $query->where('estado', 'activo')
                    ->orderBy('created_at');
            }, 'accesos' => function ($query) use ($matricula) {
                $query->where('mat_id', $matricula->id)
                    ->where('estado', 'activo');
            }])
            ->first(); // Cambiado a first() porque debería ser único

        // Si no hay acceso a esta materia en este módulo
        if (!$moduloMateria) {
            abort(403, 'No tienes acceso a esta materia en este módulo');
        }

        // 3. Obtener los temas accesibles directamente del ModuloMateria
        $temasAccesibles = $moduloMateria->temas->map(function ($tema) use ($moduloMateria, $modulo) {
            return [
                'id' => $tema->id,
                'nombre' => $tema->nombre,
                'descripcion' => $tema->descripcion,
                'orden' => $tema->orden ?? 0,
                'tipo' => $tema->tipo ?? 'quiz',
                'estado' => 'activo',
                'contenido_json' => $tema->contenido_json,
                'modulo_materia_id' => $moduloMateria->id,
                'modulo_id' => $modulo->id,
                'modulo_nombre' => $modulo->nombre,
                'acceso_id' => $moduloMateria->accesos->first()->id ?? null,
            ];
        })->sortBy('orden')->values();

        return Inertia::render('Student/topics', [
            'curso' => [
                'id' => $curso->id,
                'nombre' => $curso->nombre,
                'codigo' => $curso->codigo_curso,
            ],
            'materia' => [
                'id' => $materia->id,
                'nombre' => $materia->nombre,
                'descripcion' => $materia->descripcion ?? '',
            ],
            'temas' => $temasAccesibles,
            'matricula' => [
                'id' => $matricula->id,
            ],
            'modulo_actual' => [
                'id' => $modulo->id,
                'nombre' => $modulo->nombre,
            ],
        ]);
    }

    public function topic(Curso $curso, Modulo $modulo, Materia $materia, Tema $tema, Request $request)
    {
        $studentId = auth()->guard()->id();

        // Validar matrícula activa
        $matricula = Matricula::where('estudiante_id', $studentId)
            ->where('curso_id', $curso->id)
            ->where('estado', 'activo')
            ->firstOrFail();

        // Validar que el estudiante tiene acceso a este módulo-materia-tema
        $temaValidado = Tema::where('id', $tema->id)
            ->where('estado', 'activo')
            ->whereHas('moduloMateria', function ($query) use ($matricula, $modulo, $materia) {
                $query->where('mod_id', $modulo->id)
                    ->where('mat_id', $materia->id)
                    ->whereHas('accesos', function ($q) use ($matricula) {
                        $q->where('mat_id', $matricula->id)
                            ->where('estado', 'activo');
                    });
            })
            ->firstOrFail();

        Log::info('TEMA VALIDADO');
        Log::info($temaValidado);

        // Necesitamos el ModuloMateria para algunas cosas (como su ID)
        $moduloMateria = ModuloMateria::where('mod_id', $modulo->id)
            ->where('mat_id', $materia->id)
            ->first();

        return Inertia::render('Student/topic', [
            'curso' => [
                'id' => $curso->id,
                'nombre' => $curso->nombre,
                'codigo' => $curso->codigo_curso,
            ],
            'materia' => [
                'id' => $materia->id,
                'nombre' => $materia->nombre,
                'descripcion' => $materia->descripcion ?? '',
            ],
            'tema' => [
                'id' => $temaValidado->id,
                'nombre' => $temaValidado->nombre,
                'descripcion' => $temaValidado->descripcion,
                'tipo' => $temaValidado->tipo ?? 'quiz',
                'contenido_json' => $temaValidado->contenido_json,
                'modulo_materia_id' => $moduloMateria->id ?? null,
                'modulo_id' => $modulo->id,
                'modulo_nombre' => $modulo->nombre,
                'randomizar_preguntas' => $temaValidado->randomizar_preguntas ?? false,
                'randomizar_respuestas' => $temaValidado->randomizar_respuestas ?? false,
            ],
            'modulo' => [
                'id' => $modulo->id,
                'nombre' => $modulo->nombre,
            ],
        ]);
    }

    public function guardarExamen(Request $request, Curso $curso, Modulo $modulo, Materia $materia, Tema $tema)
    {
        $studentId = auth()->guard()->id();

        // Validar matrícula activa
        $matricula = Matricula::where('estudiante_id', $studentId)
            ->where('curso_id', $curso->id)
            ->where('estado', 'activo')
            ->firstOrFail();

        // Validar datos del examen
        $validated = $request->validate([
            'respuestas' => 'required|array',
            'tiempo_utilizado' => 'required|integer|min:1',
        ]);

        // ✅ OBTENER LAS PREGUNTAS ORIGINALES DEL TEMA
        $contenidoJson = json_decode($tema->contenido_json, true);
        $preguntasOriginales = $contenidoJson['questions'] ?? [];

        if (empty($preguntasOriginales)) {
            return back()->withErrors(['error' => 'No se encontraron preguntas en el tema.']);
        }

        // ✅ CALCULAR RESPUESTAS CORRECTAS EN EL BACKEND
        $respuestasUsuario = $validated['respuestas'];
        $totalPreguntas = count($preguntasOriginales);
        $respuestasCorrectas = 0;
        $respuestasDetalladas = [];

        Log::info('RESPUESTAS DEL USUARIO');
        Log::info($respuestasUsuario);

        // foreach ($preguntasOriginales as $pregunta) {
        //     $questionId = $pregunta['id'];
        //     $respuestaCorrecta = $pregunta['correctAnswer'];

        //     // Verificar si el usuario respondió esta pregunta
        //     if (isset($respuestasUsuario[$questionId])) {
        //         $respuestaUsuario = $respuestasUsuario[$questionId]['respuesta'];
        //         $esCorrecta = ($respuestaUsuario === $respuestaCorrecta);

        //         if ($esCorrecta) {
        //             $respuestasCorrectas++;
        //         }

        //         $respuestasDetalladas[$questionId] = [
        //             'respuesta' => $respuestaUsuario,
        //             'esCorrecta' => $esCorrecta,
        //             'respuestaCorrecta' => $respuestaCorrecta
        //         ];
        //     } else {
        //         // Pregunta no respondida
        //         $respuestasDetalladas[$questionId] = [
        //             'respuesta' => null,
        //             'esCorrecta' => false,
        //             'respuestaCorrecta' => $respuestaCorrecta
        //         ];
        //     }
        // }
        foreach ($preguntasOriginales as $pregunta) {
            $questionId = $pregunta['id'];

            // 1. Obtenemos el índice correcto original (ej: 0)
            $indiceCorrectoOriginal = $pregunta['correctAnswer'];

            // 2. IMPORTANTE: Obtenemos el TEXTO que corresponde a ese índice en el JSON original
            // Si correctAnswer es 0, $textoCorrecto será "a"
            $textoCorrecto = $pregunta['options'][$indiceCorrectoOriginal] ?? null;

            if (isset($respuestasUsuario[$questionId])) {
                $respuestaEnviadaPorAlumno = $respuestasUsuario[$questionId]['respuesta'];

                // 3. Comparamos TEXTO contra TEXTO
                $esCorrecta = ($respuestaEnviadaPorAlumno === $textoCorrecto);

                if ($esCorrecta) {
                    $respuestasCorrectas++;
                }

                $respuestasDetalladas[$questionId] = [
                    'respuesta' => $respuestaEnviadaPorAlumno,
                    'esCorrecta' => $esCorrecta,
                    'respuestaCorrecta' => $textoCorrecto // Guardamos el texto para el reporte
                ];
            } else {
                // Pregunta no respondida
                $respuestasDetalladas[$questionId] = [
                    'respuesta' => null,
                    'esCorrecta' => false,
                    'respuestaCorrecta' => $textoCorrecto
                ];
            }
        }

        $puntajeTotal = $respuestasCorrectas;
        $porcentaje = $totalPreguntas > 0 ? round(($respuestasCorrectas / $totalPreguntas) * 100, 2) : 0;

        // Obtener número de intento
        $intentoActual = ExamenRealizado::where('tema_id', $tema->id)
            ->where('matricula_id', $matricula->id)
            ->max('intento_numero') ?? 0;
        $intentoActual++;

        // Registrar el examen
        ExamenRealizado::create([
            'tema_id' => $tema->id,
            'matricula_id' => $matricula->id,
            'intento_numero' => $intentoActual,
            'fecha_inicio' => now()->subSeconds($validated['tiempo_utilizado']),
            'fecha_fin' => now(),
            'tiempo_utilizado' => $validated['tiempo_utilizado'],
            'respuestas_json' => $respuestasDetalladas,
            'puntaje_total' => $puntajeTotal,
            'porcentaje' => $porcentaje,
            'estado' => 'completado',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->route('estudiante.tema.resultados', [
            'curso' => $curso->id,
            'modulo' => $modulo->id,
            'materia' => $materia->id,
            'tema' => $tema->id,
        ]);
    }

    public function resultados(Curso $curso, Modulo $modulo, Materia $materia, Tema $tema)
    {
        $studentId = auth()->guard()->id();

        // Obtener matrícula
        $matricula = Matricula::where('estudiante_id', $studentId)
            ->where('curso_id', $curso->id)
            ->where('estado', 'activo')
            ->firstOrFail();

        // Obtener el último intento de este tema
        $ultimoExamen = ExamenRealizado::where('tema_id', $tema->id)
            ->where('matricula_id', $matricula->id)
            ->orderBy('intento_numero', 'desc')
            ->first();

        // Obtener historial de intentos
        $intentos = ExamenRealizado::where('tema_id', $tema->id)
            ->where('matricula_id', $matricula->id)
            ->orderBy('intento_numero', 'desc')
            ->get()
            ->map(fn($examen) => [
                'id' => $examen->id,
                'intento_numero' => $examen->intento_numero,
                'fecha' => $examen->fecha_fin,
                'tiempo' => $examen->tiempo_utilizado,
                'puntaje' => $examen->puntaje_total,
                'porcentaje' => $examen->porcentaje,
                'estado' => $examen->estado,
            ]);

        return Inertia::render('Student/resultados', [
            'curso' => [
                'id' => $curso->id,
                'nombre' => $curso->nombre,
            ],
            'modulo' => [
                'id' => $modulo->id,
                'nombre' => $modulo->nombre,
            ],
            'materia' => [
                'id' => $materia->id,
                'nombre' => $materia->nombre,
            ],
            'tema' => [
                'id' => $tema->id,
                'nombre' => $tema->nombre,
                'contenido_json' => $tema->contenido_json,
            ],
            'ultimo_intento' => $ultimoExamen ? [
                'respuestas' => $ultimoExamen->respuestas_json,
                'porcentaje' => $ultimoExamen->porcentaje,
                'tiempo' => $ultimoExamen->tiempo_utilizado,
                'fecha' => $ultimoExamen->fecha_fin,
            ] : null,
            'intentos' => $intentos,
        ]);
    }
}
