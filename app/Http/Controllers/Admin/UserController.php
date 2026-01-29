<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['persona', 'rol'])
            ->select('id', 'persona_id', 'rol_id', 'email', 'estado', 'ultimo_acceso', 'created_at')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'nombre_completo' => $user->persona->nombre_completo,
                    'email' => $user->email,
                    'rol' => $user->rol->nombre,
                    'estado' => $user->estado,
                    'ultimo_acceso' => $user->ultimo_acceso?->format('d/m/Y H:i'),
                    'created_at' => $user->created_at->format('d/m/Y'),
                ];
            });

        $stats = [
            'total' => User::count(),
            'activos' => User::where('estado', 'activo')->count(),
            'pendientes' => User::where('estado', 'pendiente')->count(),
            'bloqueados' => User::where('estado', 'bloqueado')->count(),
        ];

        return Inertia::render('Admin/Users/index', [
            'users' => $users,
            'stats' => $stats
        ]);
    }
}