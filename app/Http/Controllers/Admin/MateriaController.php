<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Materia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MateriaController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search', '');

        $materias = Materia::query()
            ->when($search, function ($query, $search) {
                $query->where('nombre', 'like', "%{$search}%")
                    ->orWhere('codigo_materia', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();

        $stats = [
            'total' => Materia::count(),
            // 'ciencias' => Materia::where('area', 'ciencias')->count(),
            // 'lenguaje' => Materia::where('area', 'lenguaje')->count(),
            // 'general' => Materia::where('area', 'general')->count(),
        ];

        return Inertia::render('Admin/Materias/index', [
            'materias' => $materias,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Materias/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo_materia' => 'required|string|max:20|unique:materias,codigo_materia',
            'nombre' => 'required|string|max:150',
            'descripcion' => 'nullable|string',
            // 'area' => 'required|in:ciencias,lenguaje,general,especifica',
            // 'color' => 'required|string|max:7',
            'objetivos_generales' => 'nullable|string',
        ]);

        Materia::create($validated);

        return redirect()->route('admin.materias.index')
            ->with('success', 'Materia creada exitosamente');
    }

    public function edit(Materia $materia)
    {
        return Inertia::render('Admin/Materias/edit', [
            'materia' => $materia,
        ]);
    }

    public function update(Request $request, Materia $materia)
    {
        $validated = $request->validate([
            'codigo_materia' => 'required|string|max:20|unique:materias,codigo_materia,' . $materia->id,
            'nombre' => 'required|string|max:150',
            'descripcion' => 'nullable|string',
            // 'area' => 'required|in:ciencias,lenguaje,general,especifica',
            // 'color' => 'required|string|max:7',
            'objetivos_generales' => 'nullable|string',
        ]);

        $materia->update($validated);

        return redirect()->route('admin.materias.index')
            ->with('success', 'Materia actualizada exitosamente');
    }

    public function destroy(Materia $materia)
    {
        $materia->delete();

        return redirect()->route('admin.materias.index')
            ->with('success', 'Materia eliminada exitosamente');
    }
}