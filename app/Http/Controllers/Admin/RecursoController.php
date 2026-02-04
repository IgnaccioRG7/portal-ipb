<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Recurso;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RecursoController extends Controller
{
    /**
     * Muestra todos los recursos para el administrador
     */
    public function index(): Response
    {
        $recursos = Recurso::with('user:id,name')
            ->latest()
            ->get()
            ->map(function ($recurso) {
                return [
                    'id' => $recurso->id,
                    'titulo' => $recurso->titulo,
                    'descripcion' => $recurso->descripcion,
                    'nombre_original' => $recurso->nombre_original,
                    'tamano_formateado' => $recurso->tamano_formateado,
                    'visible' => $recurso->visible,
                    'categoria' => $recurso->categoria,
                    'autor' => $recurso->user->name,
                    'fecha' => $recurso->created_at->format('d/m/Y H:i'),
                    'url' => $recurso->url,
                ];
            });

        return Inertia::render('Admin/Recursos/Index', [
            'recursos' => $recursos,
        ]);
    }

    /**
     * Muestra el formulario para crear un nuevo recurso
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Recursos/Create');
    }

    /**
     * Almacena un nuevo recurso en la base de datos
     */
    public function store(Request $request): RedirectResponse
    {
        // Validación
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'archivo' => 'required|file|mimes:pdf|max:10240', // Máximo 10MB
            'visible' => 'boolean',
            'categoria' => 'required|string|in:otro,policias,militares,medicina,ingenieria',
        ], [
            'archivo.required' => 'Debe seleccionar un archivo PDF',
            'archivo.mimes' => 'El archivo debe ser un PDF',
            'archivo.max' => 'El archivo no puede superar los 10MB',
            'categoria.required' => 'La categoría es obligatoria',
            'categoria.in' => 'La categoría seleccionada no es válida',
        ]);

        try {
            // Almacenar el archivo en storage/app/public/recursos
            $archivo = $request->file('archivo');
            $nombreArchivo = time() . '_' . $archivo->getClientOriginalName();
            $ruta = $archivo->storeAs('recursos', $nombreArchivo, 'public');

            // Crear el registro en la base de datos
            Recurso::create([
                'titulo' => $validated['titulo'],
                'descripcion' => $validated['descripcion'] ?? null,
                'archivo' => $ruta,
                'nombre_original' => $archivo->getClientOriginalName(),
                'tamano' => $archivo->getSize(),
                'user_id' => auth()->guard()->id(),
                'visible' => $validated['visible'] ?? true,
                'categoria' => $validated['categoria'],
            ]);

            return redirect()
                ->route('admin.recursos.index')
                ->with('success', 'Recurso creado exitosamente');

        } catch (\Exception $e) {
            // Si hay error, eliminar el archivo si se subió
            if (isset($ruta)) {
                Storage::disk('public')->delete($ruta);
            }

            throw ValidationException::withMessages([
                'archivo' => 'Error al subir el archivo: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Muestra el formulario para editar un recurso
     */
    public function edit(Recurso $recurso): Response
    {
        return Inertia::render('Admin/Recursos/Edit', [
            'recurso' => [
                'id' => $recurso->id,
                'titulo' => $recurso->titulo,
                'descripcion' => $recurso->descripcion,
                'visible' => $recurso->visible,
                'nombre_original' => $recurso->nombre_original,
                'url' => $recurso->url,
                'categoria' => $recurso->categoria,
            ],
        ]);
    }

    /**
     * Actualiza un recurso existente
     */
    public function update(Request $request, Recurso $recurso): RedirectResponse
    {
        $validated = $request->validate([
            'titulo' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'archivo' => 'nullable|file|mimes:pdf|max:10240',
            'visible' => 'boolean',
            'categoria' => 'required|string|in:otro,policias,militares,medicina,ingenieria', 
        ]);

        try {
            // Si hay un nuevo archivo
            if ($request->hasFile('archivo')) {
                // Eliminar el archivo anterior
                Storage::disk('public')->delete($recurso->archivo);

                // Subir el nuevo archivo
                $archivo = $request->file('archivo');
                $nombreArchivo = time() . '_' . $archivo->getClientOriginalName();
                $ruta = $archivo->storeAs('recursos', $nombreArchivo, 'public');

                $recurso->update([
                    'archivo' => $ruta,
                    'nombre_original' => $archivo->getClientOriginalName(),
                    'tamano' => $archivo->getSize(),                    
                ]);
            }

            // Actualizar otros campos
            $recurso->update([
                'titulo' => $validated['titulo'],
                'descripcion' => $validated['descripcion'] ?? null,
                'visible' => $validated['visible'] ?? true,
                'categoria' => $validated['categoria'],
            ]);

            return redirect()
                ->route('admin.recursos.index')
                ->with('success', 'Recurso actualizado exitosamente');

        } catch (\Exception $e) {
            throw ValidationException::withMessages([
                'archivo' => 'Error al actualizar: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Elimina un recurso
     */
    public function destroy(Recurso $recurso): RedirectResponse
    {
        try {
            // Eliminar el archivo del storage
            Storage::disk('public')->delete($recurso->archivo);

            // Eliminar el registro de la base de datos
            $recurso->delete();

            return redirect()
                ->route('admin.recursos.index')
                ->with('success', 'Recurso eliminado exitosamente');

        } catch (\Exception $e) {
            return redirect()
                ->route('admin.recursos.index')
                ->with('error', 'Error al eliminar el recurso: ' . $e->getMessage());
        }
    }

    /**
     * Alterna la visibilidad de un recurso
     */
    public function toggleVisibility(Recurso $recurso): RedirectResponse
    {
        $recurso->update([
            'visible' => !$recurso->visible,
        ]);

        return back()->with('success', 'Visibilidad actualizada');
    }
}