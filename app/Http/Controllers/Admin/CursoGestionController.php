<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\Modulo;
use App\Models\Materia;
use App\Models\ModuloMateria;
use App\Models\Tema;
use App\Models\ExamenRealizado;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CursoGestionController extends Controller
{
    /**
     * Ver módulos de un curso (admin ve todos los módulos activos)
     */
    public function modulos(Curso $curso)
    {
        $modulos = Modulo::where('curso_id', $curso->id)
            ->where('estado', 'activo')
            ->withCount(['moduloMaterias as total_materias' => function ($q) {
                $q->where('estado', 'activo');
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

        return Inertia::render('Admin/GestionCursos/modulos', [
            'curso' => $curso->only('id', 'nombre', 'codigo_curso'),
            'modulos' => $modulos
        ]);
    }

    /**
     * Ver materias de un módulo (admin ve todas las materias)
     */
    public function materias(Curso $curso, Modulo $modulo)
    {
        if ($modulo->curso_id !== $curso->id) {
            abort(404);
        }

        $materias = ModuloMateria::where('mod_id', $modulo->id)
            // ->where('estado', 'activo')
            ->whereHas('temas')
            ->with([
                'materia:id,nombre,codigo_materia,area,color',
                'profesor:id,name,email'
            ])
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
                    'profesor' => $mm->profesor ? [
                        'id' => $mm->profesor->id,
                        'name' => $mm->profesor->name,
                        'email' => $mm->profesor->email,
                    ] : null,
                ];
            });

        return Inertia::render('Admin/GestionCursos/materias', [
            'curso' => $curso->only('id', 'nombre', 'codigo_curso'),
            'modulo' => $modulo->only('id', 'nombre', 'codigo_modulo'),
            'materias' => $materias
        ]);
    }

    /**
     * Ver temas de una materia (admin ve todos los temas)
     */
    public function temas(Curso $curso, Modulo $modulo, Materia $materia, $profesorId)
    {
        Log::info("EL ID QUE LLEGA DEL PROFESOR ES:");
        Log::info($profesorId);
        Log::info($modulo->id);
        Log::info($materia->id);

        $prof = User::find($profesorId);

        if (!$prof) {
            abort(404, "No existe ese profesor");
        }

        if ($prof->rol->nombre !== "Profesor") {
            abort(404, "Profesor no encontrado");
        }

        if ($modulo->curso_id !== $curso->id) {
            abort(404);
        }

        // Obtener el modulo_materia
        $moduloMateria = ModuloMateria::where('mod_id', $modulo->id)
            ->where('mat_id', $materia->id)
            ->where('prof_id', $profesorId)
            // ->where('estado', 'activo')
            ->with('profesor:id,name,email')
            ->first();

        Log::info("EL MODULO MATERIA ES");
        Log::info($moduloMateria);

        if (!$moduloMateria) {
            abort(404, 'No se encontró la asignación de esta materia para el profesor especificado');
        }

        // Obtener temas
        $temas = Tema::where('modulo_materia_id', $moduloMateria->id)
            ->select('id', 'codigo_tema', 'nombre', 'descripcion', 'tipo', 'estado', 'contenido_json', 'modulo_materia_id')
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
                'total_preguntas' => count(json_decode($tema->contenido_json, true)['questions'] ?? []),
                'profesor' => $moduloMateria->profesor ? [
                    'id' => $moduloMateria->profesor->id,
                    'name' => $moduloMateria->profesor->name,
                ] : null,
            ]);

        return Inertia::render('Admin/GestionCursos/temas', [
            'curso' => $curso->only('id', 'nombre', 'codigo_curso'),
            'modulo' => $modulo->only('id', 'nombre', 'codigo_modulo'),
            'materia' => $materia->only('id', 'nombre', 'codigo_materia'),
            'profesor' => [
                'id' => $prof->id,
                'name' => $prof->name,
            ],
            'temas' => $temas
        ]);
    }

    /**
     * Ver resultados de un tema (admin ve todos los resultados)
     */
    public function resultados(Curso $curso, Modulo $modulo, Materia $materia, Tema $tema)
    {
        if ($modulo->curso_id !== $curso->id) {
            abort(404);
        }

        $contenido = json_decode($tema->contenido_json, true);
        if (isset($contenido['questions']) && is_array($contenido['questions'])) {
            $contenido['questions'] = array_map(function ($question) {
                return [
                    'id' => $question['id'],
                    'text' => $question['text']
                ];
            },$contenido['questions']);
        }

        // Verificar que el tema pertenezca a algún módulo_materia de esta materia
        $moduloMateriaIds = ModuloMateria::where('mod_id', $modulo->id)
            ->where('mat_id', $materia->id)
            ->pluck('id');

        if (!in_array($tema->modulo_materia_id, $moduloMateriaIds->toArray())) {
            abort(404);
        }

        // Obtener TODOS los exámenes de este tema (sin filtro de profesor)
        $examenes = ExamenRealizado::where('tema_id', $tema->id)
            ->with([
                'matricula.estudiante.persona',
                'matricula.curso',
                'tema.moduloMateria.profesor'
            ])
            ->orderBy('fecha_fin', 'desc')
            ->get();

        // Agrupar por estudiante
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

        // Información del profesor que creó el tema
        $profesorInfo = $tema->moduloMateria->profesor ?? null;

        // Estadísticas generales
        $estadisticasGenerales = [
            'total_estudiantes' => $estadisticasPorEstudiante->count(),
            'total_intentos' => $examenes->count(),
            'promedio_general' => round($examenes->avg('porcentaje'), 2),
            'nota_maxima' => $examenes->max('porcentaje'),
            'nota_minima' => $examenes->min('porcentaje'),
            'total_aprobados' => $examenes->filter(fn($e) => $e->porcentaje >= 70)->count(),
            'total_reprobados' => $examenes->filter(fn($e) => $e->porcentaje < 70)->count(),
            'profesor' => $profesorInfo ? [
                'id' => $profesorInfo->id,
                'name' => $profesorInfo->name,
                'email' => $profesorInfo->email,
            ] : null,
        ];

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

        return Inertia::render('Admin/GestionCursos/resultados', [
            'curso' => $curso->only('id', 'nombre', 'codigo_curso'),
            'modulo' => $modulo->only('id', 'nombre', 'codigo_modulo'),
            'materia' => $materia->only('id', 'nombre', 'codigo_materia'),
            'tema' => [
                'id' => $tema->id,
                'codigo_tema' => $tema->codigo_tema,
                'nombre' => $tema->nombre,
                'total_preguntas' => count(json_decode($tema->contenido_json, true)['questions'] ?? []),
                'contenido_json' => $contenido,
                'profesor' => $profesorInfo ? [
                    'name' => $profesorInfo->name,
                ] : null,
            ],
            'estadisticas_generales' => $estadisticasGenerales,
            'estadisticas_estudiantes' => $estadisticasPorEstudiante,
            'intentos' => $intentosDetallados,
        ]);
    }
}
