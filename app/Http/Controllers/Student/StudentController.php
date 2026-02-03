<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\CursoMateriaTema;
use App\Models\Matricula;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $student = auth()->guard()->user();

        $matriculas = $student->matriculas()
            ->with([
                'curso',
                // 'cursoMateriaTemas.tema',
                'cursoMateriaTemas.cursoMateria.materia',
            ])
            ->get();

        Log::info($matriculas);

        $data = $matriculas->map(function ($matricula) {
            return [
                'curso' => [
                    'id' => $matricula->curso->id,
                    'nombre' => $matricula->curso->nombre,
                ],
                'materias' => $matricula->cursoMateriaTemas
                    ->groupBy(fn($cmt) => $cmt->cursoMateria->materia->id)
                    ->map(function ($items) {
                        $materia = $items->first()->cursoMateria->materia;

                        return [
                            'id' => $materia->id,
                            'nombre' => $materia->nombre,
                            'temas' => $items->map(fn($i) => [
                                'id' => $i->tema->id,
                                'nombre' => $i->tema->nombre,
                            ])->values(),
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
        Log::info($course);
        $matricula = Matricula::where('estudiante_id', auth()->guard()->id())
            ->where('curso_id', $course->id)
            ->firstOrFail();

        $accesos = CursoMateriaTema::where('mat_id', $matricula->id)
            ->where('estado', 'activo')
            ->with([
                'tema',
                'cursoMateria.materia'
            ])
            ->orderBy('orden')
            ->get();

        $materias = $accesos
            ->groupBy(fn($item) => $item->cursoMateria->materia->id)
            ->map(function ($items) {
                return [
                    'materia' => $items->first()->cursoMateria->materia,
                    'temas'   => $items->pluck('tema')->values(),
                ];
            })
            ->values();

        return Inertia::render('Student/subjects', [
            'curso'    => $course,
            'materias' => $materias,
        ]);
    }
}
