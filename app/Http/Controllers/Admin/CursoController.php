<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Acceso;
use App\Models\Curso;
use App\Models\CursoMateria;
use App\Models\ExamenRealizado;
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
            // 1 Obtener TODOS los módulos actuales (con dependencias)
            $modulosActuales = Modulo::where('curso_id', $curso->id)
                ->with(['moduloMaterias' => function ($q) {
                    $q->withCount(['temas', 'accesos']);
                }])
                ->get()
                ->keyBy('codigo_modulo');

            // 2 Obtener los códigos que vienen del formulario
            $codigosFormulario = collect($validated['modulos'])->pluck('codigo_modulo')->toArray();

            // 3 ELIMINAR módulos que NO están en el formulario Y NO tienen dependencias
            foreach ($modulosActuales as $codigo => $modulo) {
                if (!in_array($codigo, $codigosFormulario)) {
                    $tieneDependencias = $modulo->moduloMaterias->sum('temas_count') > 0
                        || $modulo->moduloMaterias->sum('accesos_count') > 0;

                    if ($tieneDependencias) {
                        // Con dependencias → Solo INACTIVAR
                        if ($modulo->estado !== 'inactivo') {
                            $modulo->update(['estado' => 'inactivo']);
                            $modulo->moduloMaterias()->update(['estado' => 'inactivo']);
                        }
                    } else {
                        // Sin dependencias → ELIMINAR completamente
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
        // 1 Obtener TODOS los registros actuales del módulo (activos e inactivos)
        $registrosActuales = ModuloMateria::where('mod_id', $modulo->id)
            ->where('estado', 'activo')
            ->get()
            ->keyBy(function ($item) {
                return $item->mat_id . '_' . ($item->prof_id ?? 'null');
            });

        // Log::info("Registros actuales en BD:");
        // foreach ($registrosActuales as $key => $registro) {
        //     Log::info("  Key: {$key} → ID: {$registro->id}, Materia: {$registro->mat_id}, Profesor: " . ($registro->prof_id ?? 'NULL') . ", Estado: {$registro->estado}");
        // }

        // 2️⃣ Procesar cada materia que viene del formulario
        foreach ($materiasData as $index => $materiaData) {
            $materiaId = $materiaData['materia_id'];
            $nuevoProfId = $materiaData['prof_id'] ?? null;
            $key = $materiaId . '_' . ($nuevoProfId ?? 'null');

            Log::info("--- Procesando materia {$materiaId} con profesor " . ($nuevoProfId ?? 'SIN PROFESOR') . " ---");

            // Buscar si YA EXISTE esta combinación exacta (materia + profesor)
            $registroExistente = $registrosActuales->get($key);

            if ($registroExistente) {
                // CASO 1: La combinación materia+profesor YA EXISTE
                Log::info("CASO 1: Registro existente ID {$registroExistente->id} - Solo actualizar orden/estado");

                $registroExistente->update([
                    'orden' => $materiaData['orden'] ?? 1,
                    'estado' => $materiaData['estado'],
                ]);

                Log::info("Actualizado registro {$registroExistente->id}. Los accesos NO se tocan (ya están bien).");

                // Marcar como procesado (para no inactivarlo después)
                $registrosActuales->forget($key);
            } else {
                // CASO 2: NUEVA combinación (materia + profesor diferente o nuevo)
                Log::info("CASO 2: Nueva combinación detectada");

                // Buscar si existe un registro ACTIVO de esta materia con OTRO profesor
                $registroAnterior = ModuloMateria::where('mod_id', $modulo->id)
                    ->where('mat_id', $materiaId)
                    ->where('estado', 'activo')
                    ->first();

                if ($registroAnterior) {
                    Log::info("Encontrado registro ANTERIOR activo: ID {$registroAnterior->id} con profesor " . ($registroAnterior->prof_id ?? 'NULL'));
                } else {
                    Log::info("NO hay registro anterior activo para esta materia");
                }

                // Buscar si existe un registro INACTIVO con la MISMA combinación materia+profesor
                $registroInactivoMismoProf = ModuloMateria::where('mod_id', $modulo->id)
                    ->where('mat_id', $materiaId)
                    ->where(function ($q) use ($nuevoProfId) {
                        if ($nuevoProfId === null) {
                            $q->whereNull('prof_id');
                        } else {
                            $q->where('prof_id', $nuevoProfId);
                        }
                    })
                    ->where('estado', 'inactivo')
                    ->first();

                if ($registroInactivoMismoProf) {
                    // CASO 2A: Reactivar un registro inactivo existente
                    Log::info("CASO 2A: Reactivando registro inactivo ID {$registroInactivoMismoProf->id}");

                    $nuevoRegistro = $registroInactivoMismoProf;
                    $nuevoRegistro->update([
                        'orden' => $materiaData['orden'] ?? 1,
                        'estado' => 'activo',
                    ]);

                    Log::info("Registro {$nuevoRegistro->id} reactivado");
                } else {
                    // CASO 2B: Crear un registro completamente NUEVO
                    Log::info("CASO 2B: Creando NUEVO registro en modulos_materias");

                    $nuevoRegistro = ModuloMateria::create([
                        'mod_id' => $modulo->id,
                        'mat_id' => $materiaId,
                        'prof_id' => $nuevoProfId,
                        'orden' => $materiaData['orden'] ?? 1,
                        'estado' => $materiaData['estado'],
                    ]);

                    Log::info("Nuevo registro creado con ID {$nuevoRegistro->id}");
                }

                // TRANSFERIR ACCESOS si había un registro anterior DIFERENTE
                if ($registroAnterior && $registroAnterior->id != $nuevoRegistro->id) {
                    Log::info("⚠️ CAMBIO DE PROFESOR: Transferir accesos de {$registroAnterior->id} → {$nuevoRegistro->id}");

                    // Contar accesos antes de transferir
                    $cantidadAccesos = Acceso::where('modulo_materia_id', $registroAnterior->id)->count();
                    Log::info("Accesos a transferir: {$cantidadAccesos}");

                    if ($cantidadAccesos > 0) {
                        // SIMPLE: Solo actualizar modulo_materia_id
                        try {
                            $actualizados = Acceso::where('modulo_materia_id', $registroAnterior->id)
                                ->update(['modulo_materia_id' => $nuevoRegistro->id]);
                            Log::info("✅ {$actualizados} accesos transferidos");
                        } catch (\Exception $e) {
                            Log::error("❌ ERROR al transferir accesos: " . $e->getMessage());
                            Log::error($e->getTraceAsString());
                        }

                        Log::info("✅ {$actualizados} accesos transferidos exitosamente");

                        // Verificar después de transferir
                        $accesosDespues = Acceso::where('modulo_materia_id', $nuevoRegistro->id)->count();
                        Log::info("Total accesos en nuevo registro: {$accesosDespues}");
                    } else {
                        Log::info("No hay accesos para transferir");
                    }

                    //  Inactivar el registro anterior
                    $registroAnterior->update(['estado' => 'inactivo']);
                    Log::info("Registro anterior {$registroAnterior->id} inactivado");
                } else {
                    Log::info("No requiere transferencia de accesos (mismo registro o no hay anterior)");
                }
            }
        }

        Log::info("--- FIN procesamiento materias del formulario ---");
        Log::info("Registros pendientes de revisar:", $registrosActuales->pluck('id')->toArray());

        // 3️⃣ Inactivar registros que YA NO están en el formulario
        foreach ($registrosActuales as $registro) {
            Log::info("Revisando registro {$registro->id}: materia {$registro->mat_id}, profesor " . ($registro->prof_id ?? 'NULL'));

            // Verificar si esta combinación materia+profesor sigue en el formulario
            $sigueEnFormulario = collect($materiasData)->contains(function ($materiaData) use ($registro) {
                $profFormulario = $materiaData['prof_id'] ?? null;
                $profRegistro = $registro->prof_id;

                $mismaMateria = $materiaData['materia_id'] == $registro->mat_id;
                $mismoProf = ($profFormulario === $profRegistro) ||
                    (is_null($profFormulario) && is_null($profRegistro));

                return $mismaMateria && $mismoProf;
            });

            if (!$sigueEnFormulario && $registro->estado === 'activo') {
                Log::info("⚠️ Registro {$registro->id} NO está en formulario → Inactivar");
                $registro->update(['estado' => 'inactivo']);
            } else {
                Log::info("Registro {$registro->id} sigue vigente o ya está inactivo");
            }
        }

        Log::info("========== FIN SINCRONIZACIÓN ==========");
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
            ->whereHas('modulos', function ($q) {
                $q->where('estado', 'activo');
            })
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
            ->withCount('temas')
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
                'randomizar_preguntas' => $tema->randomizar_preguntas ?? false,
                'randomizar_respuestas' => $tema->randomizar_respuestas ?? false,
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
            'nombre' => 'required|string|max:150',
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
            'randomizar_preguntas' => 'sometimes|boolean',
            'randomizar_respuestas' => 'sometimes|boolean',
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
            'randomizar_preguntas' => $validated['randomizar_preguntas'] ?? false,
            'randomizar_respuestas' => $validated['randomizar_respuestas'] ?? false,
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
            'nombre' => 'required|string|max:150',
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
            'randomizar_preguntas' => 'sometimes|boolean',
            'randomizar_respuestas' => 'sometimes|boolean',
        ]);

        $tema->update([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'tipo' => $validated['tipo'],
            'estado' => $validated['estado'],
            'contenido_json' => json_encode($validated['contenido']),
            'randomizar_preguntas' => $validated['randomizar_preguntas'] ?? false,
            'randomizar_respuestas' => $validated['randomizar_respuestas'] ?? false,
        ]);

        return redirect()
            ->route('cursos.temas', [
                'curso' => $curso->id,
                'modulo' => $modulo->id,
                'materia' => $materia->id
            ])
            ->with('success', 'Tema actualizado correctamente');
    }


    // TODO: ver si vamos a mover esta funcion a la parte de profesores o a un controlador a parte
    /**
     * Mostrar resultados de un tema para todos los estudiantes
     */
    public function resultadosTemaProfesor(Curso $curso, Modulo $modulo, Materia $materia, Tema $tema)
    {
        $profesorId = auth()->guard()->id();

        // Verificar que el profesor tenga acceso a este tema
        $moduloMateria = ModuloMateria::where('mod_id', $modulo->id)
            ->where('mat_id', $materia->id)
            ->where('prof_id', $profesorId)
            ->where('estado', 'activo')
            ->firstOrFail();

        if ($tema->modulo_materia_id !== $moduloMateria->id) {
            abort(403, 'No tienes permiso para ver estos resultados');
        }

        // Obtener TODOS los exámenes de este tema
        $examenes = ExamenRealizado::where('tema_id', $tema->id)
            ->with(['matricula.estudiante.persona', 'matricula.curso'])
            ->orderBy('fecha_fin', 'desc')
            ->get();

        // Agrupar por estudiante y calcular estadísticas
        $estadisticasPorEstudiante = $examenes->groupBy('matricula.estudiante_id')
            ->map(function ($examenesEstudiante) {
                $mejorIntento = $examenesEstudiante->sortByDesc('porcentaje')->first();
                $ultimoIntento = $examenesEstudiante->sortByDesc('fecha_fin')->first();

                return [
                    'estudiante_id' => $examenesEstudiante->first()->matricula->estudiante_id,
                    'estudiante_nombre' => $examenesEstudiante->first()->matricula->estudiante->persona->nombre_completo,
                    'estudiante_email' => $examenesEstudiante->first()->matricula->estudiante->email,
                    'total_intentos' => $examenesEstudiante->count(),
                    'mejor_puntaje' => $mejorIntento->porcentaje,
                    'mejor_fecha' => $mejorIntento->fecha_fin,
                    'ultimo_puntaje' => $ultimoIntento->porcentaje,
                    'ultima_fecha' => $ultimoIntento->fecha_fin,
                    'promedio' => round($examenesEstudiante->avg('porcentaje'), 2),
                    'aprobados' => $examenesEstudiante->filter(fn($e) => $e->porcentaje >= 70)->count(),
                    'reprobados' => $examenesEstudiante->filter(fn($e) => $e->porcentaje < 70)->count(),
                ];
            })->values();

        // Estadísticas generales del tema
        $estadisticasGenerales = [
            'total_estudiantes' => $estadisticasPorEstudiante->count(),
            'total_intentos' => $examenes->count(),
            'promedio_general' => round($examenes->avg('porcentaje'), 2),
            'nota_maxima' => $examenes->max('porcentaje'),
            'nota_minima' => $examenes->min('porcentaje'),
            'total_aprobados' => $examenes->filter(fn($e) => $e->porcentaje >= 70)->count(),
            'total_reprobados' => $examenes->filter(fn($e) => $e->porcentaje < 70)->count(),
        ];

        // Obtener todos los intentos detallados (para la tabla expandible)
        $intentosDetallados = $examenes->map(fn($examen) => [
            'id' => $examen->id,
            'estudiante_nombre' => $examen->matricula->estudiante->persona->nombre_completo,
            'intento_numero' => $examen->intento_numero,
            'fecha' => $examen->fecha_fin,
            'tiempo' => $examen->tiempo_utilizado,
            'puntaje' => $examen->puntaje_total,
            'porcentaje' => $examen->porcentaje,
            'estado' => $examen->estado,
            'respuestas' => $examen->respuestas_json
        ]);

        // Filtrar contenido json
        $contenido = json_decode($tema->contenido_json, true);
        if (isset($contenido['questions']) && is_array($contenido['questions'])) {
            $contenido['questions'] = array_map(function ($question) {
                return[
                    'id' => $question['id'],
                    'text' => $question['text'],
                ];
            }, $contenido['questions']);
        }
 
        return Inertia::render('Professor/Cursos/resultados', [
            'curso' => $curso->only('id', 'nombre', 'codigo_curso'),
            'modulo' => $modulo->only('id', 'nombre', 'codigo_modulo'),
            'materia' => $materia->only('id', 'nombre', 'codigo_materia'),
            'tema' => [
                'id' => $tema->id,
                'codigo_tema' => $tema->codigo_tema,
                'nombre' => $tema->nombre,
                'total_preguntas' => count(json_decode($tema->contenido_json, true)['questions'] ?? []),
                'contenido_json' => $contenido,
            ],
            'estadisticas_generales' => $estadisticasGenerales,
            'estadisticas_estudiantes' => $estadisticasPorEstudiante,
            'intentos' => $intentosDetallados,
        ]);
    }
    /*
     *****************************************************************
                    RUTAS PARA EL PROFESOR
    *****************************************************************
    */
}
