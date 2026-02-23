<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Acceso;
use App\Models\User;
use App\Models\Curso;
use App\Models\Matricula;
use App\Models\CursoMateria;
use App\Models\Tema;
use App\Models\CursoMateriaTema;
use App\Models\Modulo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
                'nombre' => $user->persona->nombre_completo,
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
            Log::info("Matricula existente");
            Log::info($matriculaExistente);
            return back()->withErrors([
                'curso_id' => 'El estudiante ya está matriculado en este curso.',
            ]);
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

        return redirect()->route('admin.matriculas.modulos', [
            'user' => $user->id,
            'curso' => $request->curso_id,
        ])->with('success', 'Estudiante matriculado exitosamente. Ahora selecciona las materias y temas.');
    }

    /**
     * Mostrar módulos de un curso para seleccionar
     */
    public function modulos(User $user, Curso $curso)
    {
        // Obtener matrícula activa
        $matricula = Matricula::where('estudiante_id', $user->id)
            ->where('curso_id', $curso->id)
            ->where('estado', 'activo')
            ->firstOrFail();

        // Obtener módulos del curso con sus materias
        // ->with(['moduloMaterias.materia'])
        $modulos = Modulo::where('curso_id', $curso->id)
            ->where('estado', 'activo')
            ->with(['moduloMaterias' => function($q){
                $q->where('estado', 'activo')
                    ->with('materia');
            }])
            ->orderBy('fecha_inicio')
            ->get()
            ->map(function ($modulo) use ($matricula) {
                // Obtener módulos-materias ya seleccionados para esta matrícula
                $modulosMateriasSeleccionados = Acceso::where('mat_id', $matricula->id)
                    ->whereHas('moduloMateria', function ($query) use ($modulo) {
                        $query->where('mod_id', $modulo->id);
                    })
                    ->pluck('modulo_materia_id')
                    ->toArray();

                return [
                    'id' => $modulo->id,
                    'nombre' => $modulo->nombre,
                    'codigo_modulo' => $modulo->codigo_modulo,
                    'fecha_inicio' => $modulo->fecha_inicio,
                    'fecha_fin' => $modulo->fecha_fin,
                    'materias' => $modulo->moduloMaterias->map(function ($moduloMateria) use ($modulosMateriasSeleccionados) {
                        return [
                            'modulo_materia_id' => $moduloMateria->id,
                            'materia_id' => $moduloMateria->materia->id,
                            'materia_nombre' => $moduloMateria->materia->nombre,
                            'materia_codigo' => $moduloMateria->materia->codigo_materia,
                            'seleccionada' => in_array($moduloMateria->id, $modulosMateriasSeleccionados),
                        ];
                    }),
                ];
            });

        return Inertia::render('Admin/Matriculas/modulos', [
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
            'modulos' => $modulos,
        ]);
    }

    /**
     * Guardar módulos y materias seleccionados para la matrícula
     */
    public function guardarModulos(Request $request, User $user, Curso $curso)
    {
        $request->validate([
            'modulos_materias' => 'array',
            'modulos_materias.*.modulo_materia_id' => 'required|exists:modulos_materias,id',
        ]);

        // Obtener matrícula activa
        $matricula = Matricula::where('estudiante_id', $user->id)
            ->where('curso_id', $curso->id)
            ->where('estado', 'activo')
            ->firstOrFail();

        DB::transaction(function () use ($request, $matricula) {
            // Eliminar accesos anteriores para esta matrícula
            Acceso::where('mat_id', $matricula->id)->delete();

            // Insertar nuevos accesos
            foreach ($request->modulos_materias as $index => $moduloMateriaData) {
                Acceso::create([
                    'mat_id' => $matricula->id,
                    'modulo_materia_id' => $moduloMateriaData['modulo_materia_id'],
                    'orden' => $index + 1,
                    'estado' => 'activo',
                    'fecha_asignacion' => now(),
                ]);
            }
        });

        return redirect()
            ->route('admin.matriculas.estudiante', $user->id)
            ->with('success', 'Módulos y materias asignados exitosamente.');
    }

    /**
     * Eliminar una matrícula (desmatricular completamente)
     */
    public function destroy(Matricula $matricula)
    {
        // Verificar que la matrícula exista
        if (!$matricula) {
            return redirect()
                ->route('admin.matriculas.estudiante', $matricula->estudiante_id)
                ->with('error', 'La matrícula no existe.');
        }

        // Guardar ID del estudiante para redirección
        $estudianteId = $matricula->estudiante_id;

        DB::transaction(function () use ($matricula) {
            // 1. Primero eliminar todos los accesos asociados
            Acceso::where('mat_id', $matricula->id)->delete();

            // 2. Eliminar la matrícula
            $matricula->delete();
        });

        return redirect()
            ->route('admin.matriculas.estudiante', $estudianteId)
            ->with('success', 'Matrícula eliminada exitosamente.');
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
