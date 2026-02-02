<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
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
}
