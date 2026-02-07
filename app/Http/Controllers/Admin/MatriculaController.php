<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Curso;
use App\Models\Matricula;
use App\Models\CursoMateria;
use App\Models\Tema;
use App\Models\CursoMateriaTema;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class MatriculaController extends Controller
{
    /**
     * Vista para matricular a un estudiante
     */
    public function estudiante(User $user)
    {
        // Verificar que el usuario sea estudiante
        if ($user->rol->nombre !== 'Estudiante') {
            abort(403, 'Solo se pueden matricular estudiantes');
        }

        // Obtener cursos activos
        $cursos = Curso::where('estado', 'activo')
            ->select('id', 'nombre', 'codigo_curso', 'nivel')
            ->orderBy('nombre')
            ->get();

        // Obtener matrículas actuales del estudiante
        $matriculas = Matricula::where('estudiante_id', $user->id)
            ->with(['curso:id,nombre,codigo_curso'])
            ->select('id', 'curso_id', 'estado', 'fecha_finalizacion', 'created_at')
            ->get()
            ->map(function ($matricula) {
                return [
                    'id' => $matricula->id,
                    'curso' => $matricula->curso->nombre,
                    'codigo_curso' => $matricula->curso->codigo_curso,
                    'id_curso' => $matricula->curso->id,
                    'estado' => $matricula->estado,
                    'fecha_finalizacion' => $matricula->fecha_finalizacion,
                    'fecha_matricula' => $matricula->created_at->format('d/m/Y'),
                ];
            });

        return Inertia::render('Admin/Matriculas/estudiante', [
            'estudiante' => [
                'id' => $user->id,
                'nombre' => $user->nombre_completo,
                'email' => $user->email,
                'rol' => $user->rol->nombre,
            ],
            'cursos' => $cursos,
            'matriculas_actuales' => $matriculas,
        ]);
    }

    /**
     * Matricular a un estudiante en un curso
     */
    public function matricular(Request $request, User $user)
    {
        $request->validate([
            'curso_id' => 'required|exists:cursos,id',
            'fecha_finalizacion' => 'nullable|date|after:today',
            'observaciones' => 'nullable|string|max:500',
        ]);

        // Verificar que no esté ya matriculado en este curso con estado activo
        $matriculaExistente = Matricula::where('estudiante_id', $user->id)
            ->where('curso_id', $request->curso_id)
            ->whereIn('estado', ['activo', 'suspendido'])
            ->first();

        if ($matriculaExistente) {
            return redirect()
                ->back()
                ->with('error', 'El estudiante ya está matriculado en este curso.');
        }

        // Generar código de matrícula único
        $codigo = 'MAT-' . Str::upper(Str::random(8)) . '-' . date('Ymd');

        // Crear matrícula
        $matricula = Matricula::create([
            'estudiante_id' => $user->id,
            'curso_id' => $request->curso_id,
            'codigo_matricula' => $codigo,
            'estado' => 'activo',
            'fecha_finalizacion' => $request->fecha_finalizacion,
            'observaciones' => $request->observaciones,
        ]);

        return redirect()->route('admin.matriculas.materias', [
            'user' => $user->id,
            'curso' => $request->curso_id,
        ])->with('success', 'Estudiante matriculado exitosamente. Ahora selecciona las materias y temas.');
    }

    /**
     * Mostrar materias de un curso para seleccionar temas
     */
    public function materias(User $user, Curso $curso)
    {
        // Obtener matrícula activa
        $matricula = Matricula::where('estudiante_id', $user->id)
            ->where('curso_id', $curso->id)
            ->where('estado', 'activo')
            ->firstOrFail();

        // Obtener materias del curso
        $materias = CursoMateria::where('curso_id', $curso->id)
            ->where('estado', 'activo')
            ->with(['materia:id,nombre,codigo_materia', 'temas' => function ($query) {
                $query->select('id', 'nombre', 'codigo_tema', 'tipo', 'estado')
                    ->where('estado', 'activo')
                    ->orderBy('orden');
            }])
            ->get()
            ->map(function ($cursoMateria) use ($matricula) {
                // Obtener temas ya seleccionados para esta matrícula
                $temasSeleccionados = CursoMateriaTema::where('mat_id', $matricula->id)
                    ->where('curso_materia_id', $cursoMateria->id)
                    ->pluck('tema_id')
                    ->toArray();

                return [
                    'id' => $cursoMateria->id,
                    'materia_id' => $cursoMateria->materia_id,
                    'materia_nombre' => $cursoMateria->materia->nombre,
                    'materia_codigo' => $cursoMateria->materia->codigo_materia,
                    'horas_semanales' => $cursoMateria->horas_semanales,
                    'temas' => $cursoMateria->temas->map(function ($tema) use ($temasSeleccionados) {
                        return [
                            'id' => $tema->id,
                            'nombre' => $tema->nombre,
                            'codigo_tema' => $tema->codigo_tema,
                            'tipo' => $tema->tipo,
                            'seleccionado' => in_array($tema->id, $temasSeleccionados),
                        ];
                    }),
                ];
            });

        return Inertia::render('Admin/Matriculas/materias', [
            'estudiante' => [
                'id' => $user->id,
                'nombre' => $user->nombre_completo,
                'email' => $user->email,
            ],
            'curso' => [
                'id' => $curso->id,
                'nombre' => $curso->nombre,
                'codigo_curso' => $curso->codigo_curso,
            ],
            'matricula' => [
                'id' => $matricula->id,
                'codigo_matricula' => $matricula->codigo_matricula,
            ],
            'materias' => $materias,
        ]);
    }

    /**
     * Guardar temas seleccionados para la matrícula
     */
    public function guardarTemas(Request $request, User $user, Curso $curso)
    {
        $request->validate([
            'temas' => 'required|array',
            'temas.*.curso_materia_id' => 'required|exists:curso_materias,id',
            'temas.*.tema_id' => 'required|exists:temas,id',
        ]);

        // Obtener matrícula activa
        $matricula = Matricula::where('estudiante_id', $user->id)
            ->where('curso_id', $curso->id)
            ->where('estado', 'activo')
            ->firstOrFail();

        DB::transaction(function () use ($request, $matricula) {
            // Eliminar temas anteriores para esta matrícula
            CursoMateriaTema::where('mat_id', $matricula->id)->delete();

            // Insertar nuevos temas
            foreach ($request->temas as $index => $temaData) {
                CursoMateriaTema::create([
                    'curso_materia_id' => $temaData['curso_materia_id'],
                    'tema_id' => $temaData['tema_id'],
                    'mat_id' => $matricula->id,
                    'orden' => $index + 1,
                    'estado' => 'activo',
                ]);
            }
        });

        return redirect()
            ->route('admin.matriculas.estudiante', $user->id)
            ->with('success', 'Temas asignados exitosamente.');
    }

    /**
     * Editar una matrícula existente
     */
    public function edit(Matricula $matricula)
    {
        $matricula->load(['estudiante:id,nombre_completo,email', 'curso:id,nombre,codigo_curso']);

        return Inertia::render('Admin/Matriculas/edit', [
            'matricula' => [
                'id' => $matricula->id,
                'codigo_matricula' => $matricula->codigo_matricula,
                'estado' => $matricula->estado,
                'fecha_finalizacion' => $matricula->fecha_finalizacion,
                'observaciones' => $matricula->observaciones,
                'estudiante' => $matricula->estudiante,
                'curso' => $matricula->curso,
                'created_at' => $matricula->created_at->format('d/m/Y'),
            ],
            'estados' => ['activo', 'finalizado', 'retirado', 'suspendido'],
        ]);
    }

    /**
     * Actualizar una matrícula
     */
    public function update(Request $request, Matricula $matricula)
    {
        $request->validate([
            'estado' => 'required|in:activo,finalizado,retirado,suspendido',
            'fecha_finalizacion' => 'nullable|date',
            'observaciones' => 'nullable|string|max:500',
        ]);

        $matricula->update([
            'estado' => $request->estado,
            'fecha_finalizacion' => $request->fecha_finalizacion,
            'observaciones' => $request->observaciones,
        ]);

        return redirect()
            ->route('admin.matriculas.estudiante', $matricula->estudiante_id)
            ->with('success', 'Matrícula actualizada exitosamente.');
    }
}