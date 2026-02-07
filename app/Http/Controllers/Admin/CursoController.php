<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\CursoMateria;
use App\Models\Tema;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CursoController extends Controller
{
    /**
     * Lista todos los cursos
     */
    public function index()
    {
        $cursos = Curso::select('id', 'codigo_curso', 'nombre', 'nivel', 'estado')
            ->orderBy('nombre')
            ->get();

        return Inertia::render('Admin/Cursos/index', [
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
    public function updateTema(Request $request,Curso $curso, $materiaId, Tema $tema)
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
