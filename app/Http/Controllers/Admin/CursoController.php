<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\CursoMateria;
use App\Models\Materia;
use App\Models\Modulo;
use App\Models\ModuloMateria;
use App\Models\Tema;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CursoController extends Controller
{
    /*
     *****************************************************************
                    RUTAS PARA EL ADMINISTRADOR
    *****************************************************************
    */

    /**
     * Lista todos los cursos (para admin)
     */
    public function adminIndex()
    {
        $cursos = Curso::select('id', 'codigo_curso', 'nombre', 'nivel', 'estado', 'precio')
            ->withCount('materias')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Admin/Cursos/index', [
            'cursos' => $cursos
        ]);
    }

    /**
     * Formulario para crear curso
     */
    public function create()
    {
        return Inertia::render('Admin/Cursos/create');
    }

    /**
     * Guardar nuevo curso
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo_curso' => 'required|string|max:20|unique:cursos,codigo_curso',
            'nombre' => 'required|string|max:200',
            'descripcion' => 'nullable|string',
            'nivel' => 'required|in:básico,intermedio,avanzado,especializado',
            'duracion_semanas' => 'nullable|integer|min:1',
            'horas_semanales' => 'required|integer|min:1|max:40',
            'precio' => 'required|numeric|min:0',
            'capacidad_maxima' => 'required|integer|min:1',
            'estado' => 'required|in:activo,inactivo,completo,cancelado',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'requisitos' => 'nullable|string',
        ], [
            'codigo_curso.unique' => 'Este código ya está en uso',
            'nombre.required' => 'El nombre del curso es obligatorio',
            'fecha_fin.after_or_equal' => 'La fecha de fin debe ser posterior a la fecha de inicio',
        ]);

        $curso = Curso::create($validated);

        return redirect()
            ->route('admin.cursos.asignar-materias', $curso)
            ->with('success', 'Curso creado. Ahora asigna las materias.');
    }

    /**
     * Formulario para editar curso
     */
    public function edit(Curso $curso)
    {
        return Inertia::render('Admin/Cursos/edit', [
            'curso' => $curso->only([
                'id',
                'codigo_curso',
                'nombre',
                'descripcion',
                'nivel',
                'duracion_semanas',
                'horas_semanales',
                'precio',
                'capacidad_maxima',
                'estado',
                'fecha_inicio',
                'fecha_fin',
                'requisitos'
            ])
        ]);
    }

    /**
     * Actualizar curso
     */
    public function update(Request $request, Curso $curso)
    {
        $validated = $request->validate([
            'codigo_curso' => 'required|string|max:20|unique:cursos,codigo_curso,' . $curso->id,
            'nombre' => 'required|string|max:200',
            'descripcion' => 'nullable|string',
            'nivel' => 'required|in:básico,intermedio,avanzado,especializado',
            'duracion_semanas' => 'nullable|integer|min:1',
            'horas_semanales' => 'required|integer|min:1|max:40',
            'precio' => 'required|numeric|min:0',
            'capacidad_maxima' => 'required|integer|min:1',
            'estado' => 'required|in:activo,inactivo,completo,cancelado',
            'fecha_inicio' => 'nullable|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'requisitos' => 'nullable|string',
        ], [
            'codigo_curso.unique' => 'Este código ya está en uso',
            'nombre.required' => 'El nombre del curso es obligatorio',
            'fecha_fin.after_or_equal' => 'La fecha de fin debe ser posterior a la fecha de inicio',
        ]);

        $curso->update($validated);

        return redirect()
            ->route('admin.cursos.index')
            ->with('success', 'Curso actualizado correctamente');
    }

    /**
     * Cambiar estado del curso (activo/inactivo)
     */
    public function toggleEstado(Curso $curso)
    {
        $nuevoEstado = $curso->estado === 'activo' ? 'inactivo' : 'activo';

        $curso->update(['estado' => $nuevoEstado]);

        return back()->with('success', "Curso {$nuevoEstado} correctamente");
    }

    /**
     * Eliminar curso
     */
    public function destroy(Curso $curso)
    {
        // Verificar si tiene estudiantes matriculados
        if ($curso->matriculas()->count() > 0) {
            return back()->with('error', 'No se puede eliminar un curso con estudiantes matriculados');
        }

        $curso->delete();

        return redirect()
            ->route('admin.cursos.index')
            ->with('success', 'Curso eliminado correctamente');
    }

    /**
     * Formulario para asignar materias a un curso (a través de módulos)
     */
    public function asignarMaterias(Curso $curso)
    {
        // Obtener todas las materias disponibles
        $todasLasMaterias = Materia::select('id', 'codigo_materia', 'nombre', 'area', 'color')
            ->orderBy('nombre')
            ->get();

        // ✅ Obtener profesores (usuarios con rol Profesor)
        $profesores = User::whereHas('rol', function ($query) {
            $query->where('nombre', 'Profesor');
        })
            ->with('persona')
            ->orderBy('nombre')
            ->get()
            ->map(function ($profesor) {
                return [
                    'id' => $profesor->id,
                    'nombre_completo' => $profesor->persona?->nombre_completo,
                    'email' => $profesor->email,
                ];
            });

        // Obtener los módulos del curso con sus materias y profesores
        $modulos = Modulo::where('curso_id', $curso->id)
            // ->where('estado', 'activo')
            ->orderBy('fecha_inicio')
            ->with(['moduloMaterias' => function ($query) {
                $query->where('estado', 'activo')
                    ->with(['materia', 'profesor'])
                    ->withCount(['temas', 'accesos']);
            }])
            ->get()
            ->map(function ($modulo) {
                return [
                    'id' => $modulo->id,
                    'codigo_modulo' => $modulo->codigo_modulo,
                    'nombre' => $modulo->nombre,
                    'fecha_inicio' => $modulo->fecha_inicio,
                    'fecha_fin' => $modulo->fecha_fin,
                    'estado' => $modulo->estado,
                    'tiene_dependencias' => $modulo->moduloMaterias->sum('temas_count') > 0
                        || $modulo->moduloMaterias->sum('accesos_count') > 0,
                    'materias' => $modulo->moduloMaterias->map(function ($mm) {
                        return [
                            'modulo_materia_id' => $mm->id,
                            'materia_id' => $mm->materia->id,
                            'materia_nombre' => $mm->materia->nombre,
                            'materia_codigo' => $mm->materia->codigo_materia,
                            'prof_id' => $mm->prof_id,
                            'prof_nombre' => $mm->profesor?->nombre_completo,
                            'orden' => $mm->orden,
                            'estado' => $mm->estado,
                            'tiene_dependencias' => $mm->temas_count > 0 || $mm->accesos_count > 0,
                        ];
                    })->values()
                ];
            });

        Log::info("Verificando");
        Log::info($curso->id);
        Log::info($modulos);


        // Obtener temas por materia (esto sigue igual)
        $temasPorMateria = Tema::whereIn('materia_id', $todasLasMaterias->pluck('id'))
            ->select('id', 'materia_id', 'codigo_tema', 'nombre', 'tipo', 'estado')
            ->orderBy('orden')
            ->get()
            ->groupBy('materia_id')
            ->map(fn($temas) => $temas->map(fn($tema) => [
                'id' => $tema->id,
                'codigo_tema' => $tema->codigo_tema,
                'nombre' => $tema->nombre ?? 'Sin nombre',
                'tipo' => $tema->tipo,
                'estado' => $tema->estado,
            ]));

        return Inertia::render('Admin/Cursos/asignar-materias', [
            'curso' => $curso->only('id', 'nombre', 'codigo_curso'),
            'todasLasMaterias' => $todasLasMaterias,
            'profesores' => $profesores,
            'modulos' => $modulos,
            'temasPorMateria' => $temasPorMateria,
        ]);
    }

    /**
     * Guardar los módulos y materias asignadas al curso
     */
    public function guardarMaterias(Request $request, Curso $curso)
    {
        $validated = $request->validate([
            'modulos' => 'required|array',
            'modulos.*.codigo_modulo' => 'required|string|max:20',
            'modulos.*.nombre' => 'required|string|max:200',
            'modulos.*.fecha_inicio' => 'required|date',
            'modulos.*.fecha_fin' => 'required|date|after_or_equal:modulos.*.fecha_inicio',
            'modulos.*.estado' => 'required|in:activo,inactivo',
            'modulos.*.materias' => 'array',
            'modulos.*.materias.*.materia_id' => 'required|exists:materias,id',
            'modulos.*.materias.*.prof_id' => 'nullable|exists:users,id',
            'modulos.*.materias.*.orden' => 'integer|min:1',
            'modulos.*.materias.*.estado' => 'required|in:activo,inactivo',
        ]);

        DB::transaction(function () use ($curso, $validated) {
            // 1️⃣ Obtener TODOS los módulos actuales (con dependencias)
            $modulosActuales = Modulo::where('curso_id', $curso->id)
                ->with(['moduloMaterias' => function ($q) {
                    $q->withCount(['temas', 'accesos']);
                }])
                ->get()
                ->keyBy('codigo_modulo');

            // 2️⃣ Obtener los códigos que vienen del formulario
            $codigosFormulario = collect($validated['modulos'])->pluck('codigo_modulo')->toArray();

            // 3️⃣ ELIMINAR módulos que NO están en el formulario Y NO tienen dependencias
            foreach ($modulosActuales as $codigo => $modulo) {
                if (!in_array($codigo, $codigosFormulario)) {
                    $tieneDependencias = $modulo->moduloMaterias->sum('temas_count') > 0
                        || $modulo->moduloMaterias->sum('accesos_count') > 0;

                    if ($tieneDependencias) {
                        // 🔒 Con dependencias → Solo INACTIVAR
                        if ($modulo->estado !== 'inactivo') {
                            $modulo->update(['estado' => 'inactivo']);
                            $modulo->moduloMaterias()->update(['estado' => 'inactivo']);
                        }
                    } else {
                        // ✅ Sin dependencias → ELIMINAR completamente
                        $modulo->moduloMaterias()->delete();
                        $modulo->delete();
                    }
                }
            }

            // 4️⃣ PROCESAR módulos del formulario (ACTUALIZAR/CREAR)
            foreach ($validated['modulos'] as $index => $moduloData) {
                // 🔥 RENUMERAR: Forzar código secuencial basado en posición
                $nuevoCodigo = 'm' . ($index + 1);

                // Buscar módulo por ID (si existe) o por código anterior
                $modulo = Modulo::where('curso_id', $curso->id)
                    ->where('codigo_modulo', $moduloData['codigo_modulo'])
                    ->first();

                if ($modulo) {
                    // ACTUALIZAR - Incluyendo posible cambio de código
                    $modulo->update([
                        'codigo_modulo' => $nuevoCodigo, // 🔄 RENUMERAR
                        'nombre' => $moduloData['nombre'],
                        'fecha_inicio' => $moduloData['fecha_inicio'],
                        'fecha_fin' => $moduloData['fecha_fin'],
                        'estado' => $moduloData['estado'],
                    ]);
                } else {
                    // CREAR nuevo con código secuencial
                    $modulo = Modulo::create([
                        'curso_id' => $curso->id,
                        'codigo_modulo' => $nuevoCodigo,
                        'nombre' => $moduloData['nombre'],
                        'fecha_inicio' => $moduloData['fecha_inicio'],
                        'fecha_fin' => $moduloData['fecha_fin'],
                        'estado' => $moduloData['estado'],
                    ]);
                }

                // 5️⃣ Sincronizar materias (siempre con el módulo actualizado)
                $this->sincronizarMateriasModulo($modulo, $moduloData['materias'] ?? []);
            }
        });

        return redirect()
            ->route('admin.cursos.index')
            ->with('success', 'Módulos, materias y profesores asignados correctamente');
    }

    private function sincronizarMateriasModulo($modulo, array $materiasData)
    {
        // Obtener materias existentes con dependencias
        $materiasExistentes = $modulo->moduloMaterias()
            ->withCount(['temas', 'accesos'])
            ->get()
            ->keyBy('mat_id');

        $materiasIdsFormulario = collect($materiasData)->pluck('materia_id')->toArray();

        // 1️⃣ ELIMINAR materias que NO están en formulario Y NO tienen dependencias
        foreach ($materiasExistentes as $materiaId => $moduloMateria) {
            if (!in_array($materiaId, $materiasIdsFormulario)) {
                if ($moduloMateria->temas_count > 0 || $moduloMateria->accesos_count > 0) {
                    // 🔒 Con dependencias → INACTIVAR
                    if ($moduloMateria->estado !== 'inactivo') {
                        $moduloMateria->update(['estado' => 'inactivo']);
                    }
                } else {
                    // ✅ Sin dependencias → ELIMINAR
                    $moduloMateria->delete();
                }
            }
        }

        // 2️⃣ PROCESAR materias del formulario
        foreach ($materiasData as $materiaData) {
            $materiaId = $materiaData['materia_id'];
            $moduloMateria = $materiasExistentes->get($materiaId);

            if ($moduloMateria) {
                // ACTUALIZAR existente
                $moduloMateria->update([
                    'prof_id' => $materiaData['prof_id'] ?? null,
                    'orden' => $materiaData['orden'] ?? 1,
                    'estado' => $materiaData['estado'],
                ]);
            } else {
                // CREAR nueva
                ModuloMateria::create([
                    'mod_id' => $modulo->id,
                    'mat_id' => $materiaId,
                    'prof_id' => $materiaData['prof_id'] ?? null,
                    'orden' => $materiaData['orden'] ?? 1,
                    'estado' => $materiaData['estado'],
                ]);
            }
        }
    }
    /*
     *****************************************************************
                    RUTAS PARA EL ADMINISTRADOR
    *****************************************************************
    */

    /*
     *****************************************************************
                    RUTAS PARA EL PROFESOR
    *****************************************************************
    */

    public function index()
    {
        $profesorId = auth()->guard()->id();
        Log::info('UserID');
        Log::info($profesorId);

        // Obtener cursos donde el profesor tiene materias asignadas en algún módulo
        // TODOhoy: revisar esta relacion porque no esta contabilizando el moduloMaterias
        $cursos = Curso::where('estado', 'activo')
            ->whereHas('modulos.moduloMaterias', function ($query) use ($profesorId) {
                $query->where('prof_id', $profesorId)
                    ->where('estado', 'activo');
            })
            ->withCount(['modulos as total_modulos' => function ($query) use ($profesorId) {
                $query->whereHas('moduloMaterias', function ($q) use ($profesorId) {
                    $q->where('prof_id', $profesorId);
                });
            }])
            ->select('id', 'codigo_curso', 'nombre', 'nivel', 'estado')
            ->orderBy('nombre')
            ->get()
            ->map(function ($curso) {
                return [
                    'id' => $curso->id,
                    'codigo_curso' => $curso->codigo_curso,
                    'nombre' => $curso->nombre,
                    'nivel' => $curso->nivel,
                    'estado' => $curso->estado,
                    'total_modulos' => $curso->total_modulos,
                ];
            });

        return Inertia::render('Professor/Cursos/index', [
            'cursos' => $cursos
        ]);
    }

    /**
     * Muestra los módulos del curso donde el profesor tiene materias
     */
    public function modulosProfesor(Curso $curso)
    {
        $profesorId = auth()->guard()->id();

        // Obtener módulos del curso donde el profesor tiene materias
        $modulos = Modulo::where('curso_id', $curso->id)
            ->where('estado', 'activo')
            ->whereHas('moduloMaterias', function ($query) use ($profesorId) {
                $query->where('prof_id', $profesorId)
                    ->where('estado', 'activo');
            })
            ->withCount(['moduloMaterias as total_materias' => function ($query) use ($profesorId) {
                $query->where('prof_id', $profesorId);
            }])
            ->orderBy('fecha_inicio')
            ->get()
            ->map(function ($modulo) {
                return [
                    'id' => $modulo->id,
                    'codigo_modulo' => $modulo->codigo_modulo,
                    'nombre' => $modulo->nombre,
                    'fecha_inicio' => $modulo->fecha_inicio,
                    'fecha_fin' => $modulo->fecha_fin,
                    'total_materias' => $modulo->total_materias,
                ];
            });

        return Inertia::render('Professor/Cursos/modulos', [
            'curso' => $curso->only('id', 'nombre', 'codigo_curso'),
            'modulos' => $modulos
        ]);
    }

    /**
     * Muestra las materias del profesor en un módulo específico
     */
    public function materiasProfesor(Curso $curso, Modulo $modulo)
    {
        $profesorId = auth()->guard()->id();

        // Verificar que el módulo pertenezca al curso
        if ($modulo->curso_id !== $curso->id) {
            abort(404);
        }

        // Obtener materias del profesor en este módulo
        $materias = ModuloMateria::where('mod_id', $modulo->id)
            ->where('prof_id', $profesorId)
            ->where('estado', 'activo')
            ->with('materia:id,nombre,codigo_materia,area,color')
            ->withCount('temas as total_temas')
            ->get()
            ->map(function ($mm) {
                return [
                    'id' => $mm->materia->id,
                    'modulo_materia_id' => $mm->id,
                    'nombre' => $mm->materia->nombre,
                    'codigo_materia' => $mm->materia->codigo_materia,
                    'area' => $mm->materia->area,
                    'color' => $mm->materia->color,
                    'orden' => $mm->orden,
                    'total_temas' => $mm->temas_count,
                ];
            });

        return Inertia::render('Professor/Cursos/materias', [
            'curso' => $curso->only('id', 'nombre', 'codigo_curso'),
            'modulo' => $modulo->only('id', 'nombre', 'codigo_modulo'),
            'materias' => $materias
        ]);
    }

    /**
     * Muestra los temas de una materia en un módulo específico
     */
    public function temasProfesor(Curso $curso, Modulo $modulo, Materia $materia)
    {
        $profesorId = auth()->guard()->id();

        // Verificar que el módulo pertenezca al curso
        if ($modulo->curso_id !== $curso->id) {
            abort(404);
        }

        // Obtener el modulo_materia
        $moduloMateria = ModuloMateria::where('mod_id', $modulo->id)
            ->where('mat_id', $materia->id)
            ->where('prof_id', $profesorId)
            ->where('estado', 'activo')
            ->firstOrFail();

        // Obtener temas de esta materia en este módulo
        $temas = Tema::where('modulo_materia_id', $moduloMateria->id)
            ->select('id', 'codigo_tema', 'nombre', 'descripcion', 'tipo', 'estado', 'contenido_json')
            ->orderBy('orden')
            ->orderBy('created_at')
            ->get()
            ->map(fn($tema) => [
                'id' => $tema->id,
                'codigo_tema' => $tema->codigo_tema,
                'nombre' => $tema->nombre ?? 'Sin nombre',
                'descripcion' => $tema->descripcion,
                'tipo' => $tema->tipo,
                'estado' => $tema->estado,
                'total_preguntas' => count(json_decode($tema->contenido_json, true)['questions'] ?? [])
            ]);

        return Inertia::render('Professor/Cursos/temas', [
            'curso' => $curso->only('id', 'nombre', 'codigo_curso'),
            'modulo' => $modulo->only('id', 'nombre', 'codigo_modulo'),
            'materia' => $materia->only('id', 'nombre', 'codigo_materia'),
            'modulo_materia_id' => $moduloMateria->id,
            'temas' => $temas
        ]);
    }

    /**
     * Muestra el editor de un tema/quiz
     */
    public function editTema(Curso $curso, Modulo $modulo, Materia $materia, Tema $tema)
    {
        $profesorId = auth()->guard()->id();

        // Verificar que el tema pertenezca al modulo_materia correcto
        $moduloMateria = ModuloMateria::where('mod_id', $modulo->id)
            ->where('mat_id', $materia->id)
            ->where('prof_id', $profesorId)
            ->firstOrFail();

        if ($tema->modulo_materia_id !== $moduloMateria->id) {
            abort(404);
        }

        $contenido = json_decode($tema->contenido_json, true);

        return Inertia::render('Professor/Temas/edit', [
            'tema' => [
                'id' => $tema->id,
                'codigo_tema' => $tema->codigo_tema,
                'nombre' => $tema->nombre,
                'descripcion' => $tema->descripcion,
                'tipo' => $tema->tipo,
                'estado' => $tema->estado,
                'contenido' => $contenido,
                'modulo_materia_id' => $moduloMateria->id,
            ],
            'curso' => $curso->only('id', 'nombre'),
            'modulo' => $modulo->only('id', 'nombre'),
            'materia' => $materia->only('id', 'nombre'),
        ]);
    }

    /**
     * Formulario para crear nuevo tema
     */
    public function createTema(Curso $curso, Modulo $modulo, Materia $materia)
    {
        $profesorId = auth()->guard()->id();

        $moduloMateria = ModuloMateria::where('mod_id', $modulo->id)
            ->where('mat_id', $materia->id)
            ->where('prof_id', $profesorId)
            ->firstOrFail();

        // Generar código de tema automático
        $ultimoTema = Tema::where('modulo_materia_id', $moduloMateria->id)
            ->orderBy('id', 'desc')
            ->first();

        $ultimoNumero = $ultimoTema ? intval(preg_replace('/[^0-9]/', '', $ultimoTema->codigo_tema)) : 0;
        $nuevoNumero = $ultimoNumero + 1;
        $codigoTema = 't' . $nuevoNumero;

        return Inertia::render('Professor/Temas/create', [
            'curso' => $curso->only('id', 'nombre'),
            'modulo' => $modulo->only('id', 'nombre'),
            'materia' => $materia->only('id', 'nombre'),
            'modulo_materia_id' => $moduloMateria->id,
            'codigo_sugerido' => $codigoTema,
        ]);
    }

    /**
     * Guardar nuevo tema
     */
    public function storeTema(Request $request, Curso $curso, Modulo $modulo, Materia $materia)
    {
        $profesorId = auth()->guard()->id();

        $moduloMateria = ModuloMateria::where('mod_id', $modulo->id)
            ->where('mat_id', $materia->id)
            ->where('prof_id', $profesorId)
            ->firstOrFail();

        $validated = $request->validate([
            'codigo_tema' => 'required|string|max:20|unique:temas,codigo_tema',
            'nombre' => 'nullable|string|max:150',
            'descripcion' => 'nullable|string',
            'tipo' => 'required|in:lectura,opcional,configurable',
            'estado' => 'required|in:activo,inactivo,borrador',
            'contenido' => 'required|array',
            'contenido.reading' => $request->tipo === 'lectura' ? 'required|string|min:10' : 'nullable|string',
            'contenido.questions' => 'required|array|min:1',
            'contenido.questions.*.id' => 'required|string',
            'contenido.questions.*.type' => 'required|in:select',
            'contenido.questions.*.text' => 'required|string|min:5',
            'contenido.questions.*.options' => 'required|array|min:2',
            'contenido.questions.*.options.*' => 'required|string|min:1',
            'contenido.questions.*.correctAnswer' => 'required|integer|min:0',
        ]);

        Tema::create([
            'modulo_materia_id' => $moduloMateria->id,
            'codigo_tema' => $validated['codigo_tema'],
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'tipo' => $validated['tipo'],
            'estado' => $validated['estado'],
            'contenido_json' => json_encode($validated['contenido']),
            'visibilidad' => 'estudiantes',
            'fecha_publicacion' => now(),
            'created_by' => $profesorId,
        ]);

        return redirect()
            ->route('cursos.temas', [
                'curso' => $curso->id,
                'modulo' => $modulo->id,
                'materia' => $materia->id
            ])
            ->with('success', 'Tema creado correctamente');
    }

    /**
     * Actualizar tema
     */
    public function updateTema(Request $request, Curso $curso, Modulo $modulo, Materia $materia, Tema $tema)
    {
        $profesorId = auth()->guard()->id();

        $moduloMateria = ModuloMateria::where('mod_id', $modulo->id)
            ->where('mat_id', $materia->id)
            ->where('prof_id', $profesorId)
            ->firstOrFail();

        if ($tema->modulo_materia_id !== $moduloMateria->id) {
            abort(404);
        }

        $validated = $request->validate([
            'nombre' => 'nullable|string|max:150',
            'descripcion' => 'nullable|string',
            'tipo' => 'required|in:lectura,opcional,configurable',
            'estado' => 'required|in:activo,inactivo,borrador',
            'contenido' => 'required|array',
            'contenido.reading' => $request->tipo === 'lectura' ? 'required|string|min:10' : 'nullable|string',
            'contenido.questions' => 'required|array|min:1',
            'contenido.questions.*.id' => 'required|string',
            'contenido.questions.*.type' => 'required|in:select',
            'contenido.questions.*.text' => 'required|string|min:5',
            'contenido.questions.*.options' => 'required|array|min:2',
            'contenido.questions.*.options.*' => 'required|string|min:1',
            'contenido.questions.*.correctAnswer' => 'required|integer|min:0',
        ]);

        $tema->update([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'tipo' => $validated['tipo'],
            'estado' => $validated['estado'],
            'contenido_json' => json_encode($validated['contenido']),
        ]);

        return redirect()
            ->route('cursos.temas', [
                'curso' => $curso->id,
                'modulo' => $modulo->id,
                'materia' => $materia->id
            ])
            ->with('success', 'Tema actualizado correctamente');
    }
    /*
     *****************************************************************
                    RUTAS PARA EL PROFESOR
    *****************************************************************
    */
}
