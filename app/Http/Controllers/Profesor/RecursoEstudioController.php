<?php

namespace App\Http\Controllers\Profesor;

use App\Http\Controllers\Controller;
use App\Models\Curso;
use App\Models\Modulo;
use App\Models\Materia;
use App\Models\ModuloMateria;
use App\Models\RecursoEstudio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RecursoEstudioController extends Controller
{
    private function getModuloMateria($modulo, $materia)
    {
        $userId = auth()->guard()->id();

        return ModuloMateria::where([
            'mod_id' => $modulo->id,
            'mat_id' => $materia->id,
            'prof_id' => $userId,
        ])->firstOrFail();
    }

    public function index(Curso $curso, Modulo $modulo, Materia $materia)
    {
        $moduloMateria = $this->getModuloMateria($modulo, $materia);

        return Inertia::render('Professor/Recursos/index', [
            'curso' => $curso,
            'modulo' => $modulo,
            'materia' => $materia,
            'recursos' => $moduloMateria->recursos()->latest()->get(),
        ]);
    }

    public function create(Curso $curso, Modulo $modulo, Materia $materia)
    {
        return Inertia::render('Professor/Recursos/create', [
            'curso' => $curso,
            'modulo' => $modulo,
            'materia' => $materia,
        ]);
    }

    public function store(Request $request, Curso $curso, Modulo $modulo, Materia $materia)
    {
        $moduloMateria = $this->getModuloMateria($modulo, $materia);

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:255',
            'archivo' => 'required|file|max:20480',
        ]);

        $ruta = $request->file('archivo')->store('recursos', 'private');

        $moduloMateria->recursos()->create([
            'titulo' => $validated['titulo'],
            'descripcion' => $validated['descripcion'],
            'tipo' => $request->file('archivo')->getClientMimeType(),
            'url' => $ruta,
            'visibilidad' => 'privado',
            'descargas' => 0,
            'estado' => 'activo',
        ]);

        return redirect()->route('cursos.recursos.index', [
            'curso' => $curso->id,
            'modulo' => $modulo->id,
            'materia' => $materia->id
        ])->with('success', 'Recurso creado correctamente');
    }

    public function preview(
        Curso $curso,
        Modulo $modulo,
        Materia $materia,
        RecursoEstudio $recurso
    ) {
        abort_unless($recurso->estado === 'activo', 403);

        $rutaCompleta = storage_path('app/private/' . $recurso->url);

        if (!file_exists($rutaCompleta)) {
            abort(404);
        }

        return response()->file($rutaCompleta);
    }

    public function edit(
        Curso $curso,
        Modulo $modulo,
        Materia $materia,
        RecursoEstudio $recurso
    ) {
        $moduloMateria = $this->getModuloMateria($modulo, $materia);

        // Seguridad extra: verificar que el recurso pertenece a ese módulo-materia
        abort_unless(
            $recurso->modulo_materia_id === $moduloMateria->id,
            403
        );

        return Inertia::render('Professor/Recursos/edit', [
            'curso' => $curso,
            'modulo' => $modulo,
            'materia' => $materia,
            'recurso' => $recurso,
        ]);
    }

    public function update(
        Request $request,
        Curso $curso,
        Modulo $modulo,
        Materia $materia,
        RecursoEstudio $recurso
    ) {
        $moduloMateria = $this->getModuloMateria($modulo, $materia);

        abort_unless(
            $recurso->modulo_materia_id === $moduloMateria->id,
            403
        );

        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:255',
            'archivo' => 'nullable|file|max:20480',
        ]);

        // Si se sube nuevo archivo
        if ($request->hasFile('archivo')) {

            // borrar archivo anterior
            Storage::disk('private')->delete($recurso->url);

            // guardar nuevo
            $ruta = $request->file('archivo')->store('recursos', 'private');

            $recurso->tipo = $request->file('archivo')->getClientMimeType();
            $recurso->url = $ruta;
            $recurso->descargas = 0;
        }

        $recurso->titulo = $validated['titulo'];
        $recurso->descripcion = $validated['descripcion'];
        $recurso->save();

        return redirect()->route('cursos.recursos.index', [
            'curso' => $curso->id,
            'modulo' => $modulo->id,
            'materia' => $materia->id
        ])->with('success', 'Recurso actualizado correctamente');
    }

    public function destroy(Curso $curso, Modulo $modulo, Materia $materia, RecursoEstudio $recurso)
    {
        Storage::disk('private')->delete($recurso->url);
        $recurso->delete();

        return back()->with('success', 'Recurso eliminado');
    }

    public function download(Curso $curso, Modulo $modulo, Materia $materia, RecursoEstudio $recurso)
    {
        abort_unless($recurso->estado === 'activo', 403);

        $rutaCompleta = storage_path('app/private/' . $recurso->url);

        if (!file_exists($rutaCompleta)) {
            abort(404);
        }

        $recurso->increment('descargas');

        return response()->download($rutaCompleta);
    }
}
