<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\CursoMateria;
use App\Models\Materia;
use App\Models\Tema;
use Illuminate\Http\Request;
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
     * Formulario para asignar materias a un curso
     */
    public function asignarMaterias(Curso $curso)
    {
        $todasLasMaterias = Materia::select('id', 'codigo_materia', 'nombre', 'area', 'color')
            ->orderBy('nombre')
            ->get();

        $materiasAsignadas = CursoMateria::where('curso_id', $curso->id)
            ->with('materia:id,nombre,codigo_materia')
            ->get()
            ->map(fn($cm) => [
                'id' => $cm->materia->id,
                'nombre' => $cm->materia->nombre,
                'codigo_materia' => $cm->materia->codigo_materia,
                'horas_semanales' => $cm->horas_semanales,
                'estado' => $cm->estado,
            ]);

        // ✅ Obtener todos los temas agrupados por materia
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
            'materiasAsignadas' => $materiasAsignadas,
            'temasPorMateria' => $temasPorMateria, // ✅ Nuevo
        ]);
    }

    /**
     * Guardar las materias asignadas
     */
    public function guardarMaterias(Request $request, Curso $curso)
    {
        $validated = $request->validate([
            'materias' => 'required|array|min:1',
            'materias.*.materia_id' => 'required|exists:materias,id',
            'materias.*.horas_semanales' => 'required|integer|min:1|max:20',
            'materias.*.estado' => 'required|in:activo,inactivo',
        ], [
            'materias.required' => 'Debes seleccionar al menos una materia',
            'materias.min' => 'Debes seleccionar al menos una materia',
        ]);

        // Eliminar asignaciones anteriores
        CursoMateria::where('curso_id', $curso->id)->delete();

        // Crear nuevas asignaciones
        foreach ($validated['materias'] as $materiaData) {
            CursoMateria::create([
                'curso_id' => $curso->id,
                'materia_id' => $materiaData['materia_id'],
                'horas_semanales' => $materiaData['horas_semanales'],
                'estado' => $materiaData['estado'],
            ]);
        }

        return redirect()
            ->route('cursos.materias', $curso)
            ->with('success', 'Materias asignadas correctamente al curso');
    }

    /*
     *****************************************************************
                    RUTAS PARA EL ADMINISTRADOR
    *****************************************************************
    */

    /**
     * Lista todos los cursos
     */
    public function index()
    {
        $cursos = Curso::select('id', 'codigo_curso', 'nombre', 'nivel', 'estado')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Professor/Cursos/index', [
            'cursos' => $cursos
        ]);
    }

    /**
     * Muestra las materias de un curso
     */
    public function materias(Curso $curso)
    {
        $materias = CursoMateria::where('curso_id', $curso->id)
            ->with('materia:id,nombre,codigo_materia,area,color')
            ->get()
            ->map(fn($cm) => [
                'id' => $cm->materia->id,
                'nombre' => $cm->materia->nombre,
                'codigo_materia' => $cm->materia->codigo_materia,
                'area' => $cm->materia->area,
                'color' => $cm->materia->color,
                'horas_semanales' => $cm->horas_semanales,
                'estado' => $cm->estado,
            ]);

        return Inertia::render('Admin/Cursos/materias', [
            'curso' => $curso->only('id', 'nombre', 'codigo_curso'),
            'materias' => $materias
        ]);
    }

    /**
     * Muestra los temas de una materia en un curso
     */
    public function temas(Curso $curso, $materiaId)
    {
        $cursoMateria = CursoMateria::where('curso_id', $curso->id)
            ->where('materia_id', $materiaId)
            ->with('materia:id,nombre,codigo_materia')
            ->firstOrFail();

        $temas = Tema::where('materia_id', $materiaId)
            ->select('id', 'codigo_tema', 'nombre', 'descripcion', 'tipo', 'estado', 'contenido_json')
            ->orderBy('orden')
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

        return Inertia::render('Admin/Cursos/temas', [
            'curso' => $curso->only('id', 'nombre', 'codigo_curso'),
            'materia' => $cursoMateria->materia->only('id', 'nombre', 'codigo_materia'),
            'temas' => $temas
        ]);
    }

    /**
     * Muestra el editor de un tema/quiz
     */
    public function editTema(Curso $curso, $materiaId, Tema $tema)
    {
        $tema->load('materia:id,nombre');

        $cursoMateria = CursoMateria::where('materia_id', $tema->materia_id);

        $contenido = json_decode($tema->contenido_json, true);

        return Inertia::render('Admin/Temas/edit', [
            'tema' => [
                'id' => $tema->id,
                'codigo_tema' => $tema->codigo_tema,
                'nombre' => $tema->nombre,
                'descripcion' => $tema->descripcion,
                'tipo' => $tema->tipo,
                'estado' => $tema->estado,
                'materia' => $tema->materia->only('id', 'nombre'),
                'contenido' => $contenido,
                'curso_id' => $curso->id,
                'materia_id' => $materiaId,
            ]
        ]);
    }

    /**
     * Actualiza el quiz/tema
     */
    public function updateTema(Request $request, Curso $curso, $materiaId, Tema $tema)
    {
        if ($tema->materia_id != $materiaId) {
            abort(404, 'El tema no pertenece a esta materia');
        }

        $validated = $request->validate([
            'nombre' => 'nullable|string|max:150',
            'descripcion' => 'nullable|string',
            'tipo' => 'required|in:lectura,opcional,configurable',
            'estado' => 'required|in:activo,inactivo,borrador',
            'contenido' => 'required|array',

            // ✅ Reading es requerido SOLO si el tipo es "lectura"
            'contenido.reading' => $request->tipo === 'lectura'
                ? 'required|string|min:10'
                : 'nullable|string',

            'contenido.questions' => 'required|array|min:1',
            'contenido.questions.*.id' => 'required|string',
            'contenido.questions.*.type' => 'required|in:select',

            // ✅ Mensajes personalizados para errores claros
            'contenido.questions.*.text' => 'required|string|min:5',
            'contenido.questions.*.options' => 'required|array|min:2',
            'contenido.questions.*.options.*' => 'required|string|min:1',
            'contenido.questions.*.correctAnswer' => 'required|integer|min:0',

            'curso_id' => 'nullable|exists:cursos,id',
            'materia_id' => 'required|exists:materias,id',

        ], [
            // ✅ Mensajes personalizados
            'contenido.reading.required' => 'El texto de lectura es obligatorio para temas de tipo "lectura"',
            'contenido.reading.min' => 'El texto de lectura debe tener al menos 10 caracteres',
            'contenido.questions.required' => 'Debe haber al menos una pregunta',
            'contenido.questions.min' => 'Debe haber al menos una pregunta',
            'contenido.questions.*.text.required' => 'El texto de la pregunta es obligatorio',
            'contenido.questions.*.text.min' => 'La pregunta debe tener al menos 5 caracteres',
            'contenido.questions.*.options.required' => 'Debe agregar opciones de respuesta',
            'contenido.questions.*.options.min' => 'Debe haber al menos 2 opciones',
            'contenido.questions.*.options.*.required' => 'La opción no puede estar vacía',
            'contenido.questions.*.options.*.min' => 'La opción debe tener al menos 1 caracter',
        ]);

        $tema->update([
            'nombre' => $validated['nombre'],
            'descripcion' => $validated['descripcion'],
            'tipo' => $validated['tipo'],
            'estado' => $validated['estado'],
            'contenido_json' => json_encode($validated['contenido']),
        ]);

        // if ($validated['curso_id'] && $validated['materia_id']) {
        //     return redirect()
        //         ->route('cursos.materias.temas', [
        //             'curso' => $validated['curso_id'],
        //             'materia' => $validated['materia_id']
        //         ])
        //         ->with('success', 'Quiz actualizado correctamente');
        // }

        return redirect()
            ->route('cursos.materias.temas', [
                'curso' => $curso->id,
                'materia' => $materiaId
            ])
            ->with('success', 'Quiz actualizado correctamente');
    }
}
