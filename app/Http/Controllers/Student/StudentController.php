<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\CursoMateria;
use App\Models\CursoMateriaTema;
use App\Models\Materia;
use App\Models\Matricula;
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
            ->where('estado', 'activo') // Solo matrículas activas
            ->with([
                'curso',
                'cursoMateriaTemas.cursoMateria.materia',
            ])
            ->orderBy('created_at', 'desc') // La más reciente primero por fecha
            ->orderBy('id', 'desc')
            ->get()
            ->unique('curso_id') // Tomar solo una matrícula por curso (la más reciente)
            ->values();

        Log::info($matriculas);

        $data = $matriculas->map(function ($matricula) {
            return [
                'matricula_id' => $matricula->id,
                'curso' => [
                    'id' => $matricula->curso->id,
                    'nombre' => $matricula->curso->nombre,
                ],
                'materias' => $matricula->cursoMateriaTemas
                    ->where('estado', 'activo')
                    ->groupBy(fn($cmt) => $cmt->cursoMateria->materia->id)
                    ->map(function ($items) {
                        $materia = $items->first()->cursoMateria->materia;

                        return [
                            'id' => $materia->id,
                            'nombre' => $materia->nombre,
                            'temas' => $items->count(),
                        ];
                    })->values(),
            ];
        });

        return Inertia::render('dashboard', [
            'matriculas' => $data,
        ]);
    }

    public function subjects(Curso $course)
    {
        $studentId = auth()->guard()->id();

        // Buscar la matrícula activa más reciente
        $matricula = Matricula::where('estudiante_id', $studentId)
            ->where('curso_id', $course->id)
            ->where('estado', 'activo')
            ->orderBy('created_at', 'desc')
            ->firstOrFail();

        // Obtener accesos ordenados
        $accesos = CursoMateriaTema::where('mat_id', $matricula->id)
            ->where('estado', 'activo')
            ->with(['tema', 'cursoMateria.materia'])
            ->orderBy('orden')
            ->get();

        // Agrupar por materia
        $materias = $accesos
            ->groupBy(fn($item) => $item->cursoMateria->materia->id)
            ->map(function ($items) {
                $materia = $items->first()->cursoMateria->materia;

                return [
                    'materia' => [
                        'id' => $materia->id,
                        'nombre' => $materia->nombre,
                    ],
                    'temas' => $items->map(function ($acceso) {
                        return [
                            'id' => $acceso->tema->id,
                            'nombre' => $acceso->tema->nombre,
                            'orden' => $acceso->orden,
                            'tipo' => $acceso->tema->tipo,
                            'curso_materia_tema_id' => $acceso->id,
                        ];
                    })->values(),
                ];
            })
            ->values();

        return Inertia::render('Student/subjects', [
            'curso' => $course,
            'materias' => $materias,
        ]);
    }

    public function topics(Curso $curso, Materia $materia)
    {
        $studentId = auth()->guard()->id();

        // 1. Obtener la matrícula del estudiante en este curso
        $matricula = Matricula::where('estudiante_id', $studentId)
            ->where('curso_id', $curso->id)
            ->firstOrFail();

        // 2. Obtener el id de la tabla curso_materias del curso y la materia
        $cursoMateria = CursoMateria::where('curso_id', $curso->id)
            ->where('materia_id', $materia->id)
            ->firstOrFail();

        // 3. Buscar los temas con la matricula y el id de curso_materias obtenido
        $temasAccesibles = CursoMateriaTema::where('mat_id', $matricula->id)
            ->where('curso_materia_id', $cursoMateria->id)
            ->where('estado', 'activo')
            ->with([
                'tema',
            ])
            ->orderBy('orden')
            ->get()
            ->map(function ($cursoMateriaTema) {
                $tema = $cursoMateriaTema->tema;

                Log::info(gettype($tema->contenido_json));

                return [
                    'id' => $tema->id,
                    'nombre' => $tema->nombre,
                    'descripcion' => $tema->descripcion,
                    'orden' => $cursoMateriaTema->orden,
                    'tipo' => $tema->tipo,
                    'estado' => $cursoMateriaTema->estado,
                    'contenido_json' => $tema->contenido_json,
                    'curso_materia_tema_id' => $cursoMateriaTema->id, // ID de la relación de acceso
                    'curso_materia_id' => $cursoMateriaTema->curso_materia_id, // Para referencia
                ];
            });

        Log::info('Temas accesibles:', $temasAccesibles->toArray());

        return Inertia::render('Student/topics', [
            'curso' => [
                'id' => $curso->id,
                'nombre' => $curso->nombre,
                'codigo' => $curso->codigo_curso,
            ],
            'materia' => [
                'id' => $materia->id,
                'nombre' => $materia->nombre,
                'area' => $materia->area,
            ],
            'temas' => $temasAccesibles,
            'matricula' => [
                'id' => $matricula->id,
            ]
        ]);
    }

    public function topic(Curso $curso, Materia $materia, Tema $tema)
    {
        $studentId = auth()->guard()->id();

        // Validar matrícula
        $matricula = Matricula::where('estudiante_id', $studentId)
            ->where('curso_id', $curso->id)
            ->firstOrFail();

        // Validar relación curso - materia
        $cursoMateria = CursoMateria::where('curso_id', $curso->id)
            ->where('materia_id', $materia->id)
            ->firstOrFail();

        // Validar acceso al tema
        $cursoMateriaTema = CursoMateriaTema::where('mat_id', $matricula->id)
            ->where('curso_materia_id', $cursoMateria->id)
            ->where('tema_id', $tema->id)
            ->where('estado', 'activo')
            ->with('tema')
            ->firstOrFail();

        // Tema validado y accesible
        $temaAccesible = $cursoMateriaTema->tema;

        return Inertia::render('Student/topic', [
            'curso' => [
                'id' => $curso->id,
                'nombre' => $curso->nombre,
            ],
            'materia' => [
                'id' => $materia->id,
                'nombre' => $materia->nombre,
            ],
            'tema' => [
                'id' => $temaAccesible->id,
                'nombre' => $temaAccesible->nombre,
                'descripcion' => $temaAccesible->descripcion,
                'tipo' => $temaAccesible->tipo,
                'contenido_json' => $temaAccesible->contenido_json,
            ],
            // 'curso_materia_tema_id' => $cursoMateriaTema->id,
        ]);
    }
}
