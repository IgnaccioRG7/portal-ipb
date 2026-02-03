<?php

namespace App\Http\Controllers;

use App\Models\Recurso;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RecursoController extends Controller
{
    /**
     * Muestra la página pública de recursos
     * Esta ruta es accesible sin autenticación
     */
    public function index(): Response
    {
        // Obtenemos solo los recursos visibles, ordenados por más recientes
        $recursos = Recurso::where('visible', true)
            ->with('user:id,name') // Cargamos solo id y nombre del usuario
            ->latest()
            ->get()
            ->map(function ($recurso) {
                return [
                    'id' => $recurso->id,
                    'titulo' => $recurso->titulo,
                    'descripcion' => $recurso->descripcion,
                    'url' => $recurso->url, // URL pública del PDF
                    'nombre_original' => $recurso->nombre_original,
                    'tamano_formateado' => $recurso->tamano_formateado,
                    'autor' => $recurso->user->name,
                    'fecha' => $recurso->created_at->format('d/m/Y'),
                ];
            });

        return Inertia::render('Recursos/Index', [
            'recursos' => $recursos,
        ]);
    }

    /**
     * Muestra un recurso específico
     */
    public function show(Recurso $recurso): Response
    {
        // Verificamos que el recurso esté visible
        if (!$recurso->visible) {
            abort(404);
        }

        return Inertia::render('Recursos/Show', [
            'recurso' => [
                'id' => $recurso->id,
                'titulo' => $recurso->titulo,
                'descripcion' => $recurso->descripcion,
                'url' => $recurso->url,
                'nombre_original' => $recurso->nombre_original,
                'tamano_formateado' => $recurso->tamano_formateado,
                'autor' => $recurso->user->name,
                'fecha' => $recurso->created_at->format('d/m/Y H:i'),
            ],
        ]);
    }
}
