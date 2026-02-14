<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        // No autenticado (por si acaso)
        if (! $user) {
            // abort(401);
            return redirect()->route('login');
        }

        // Cargar relación rol (por seguridad)
        $user->loadMissing('rol');

        if (! $user->rol || ! in_array($user->rol->nombre, $roles)) {
            // abort(403, 'No tienes permiso para acceder a esta sección');
            return redirect()
                ->route('dashboard')
                ->with('error', 'No tienes permiso para acceder a esa sección');
        }

        return $next($request);
    }
}
