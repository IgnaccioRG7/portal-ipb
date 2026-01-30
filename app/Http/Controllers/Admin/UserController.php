<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Persona;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // $users = User::with(['persona', 'rol'])
        //     ->select(
        //         'id',
        //         'persona_id',
        //         'rol_id',
        //         'email',
        //         'estado',
        //         // 'ultimo_acceso', 
        //         'created_at'
        //     )
        //     ->get()
        //     ->map(function ($user) {
        //         return [
        //             'id' => $user->id,
        //             'nombre_completo' => $user->persona->nombre_completo,
        //             'email' => $user->email,
        //             'rol' => $user->rol->nombre,
        //             'estado' => $user->estado,
        //             // 'ultimo_acceso' => $user->ultimo_acceso?->format('d/m/Y H:i'),
        //             'created_at' => $user->created_at->format('d/m/Y'),
        //         ];
        //     });
        $users = User::with(['persona', 'rol'])
            ->select(
                'id',
                'persona_id',
                'rol_id',
                'email',
                'estado',
                // 'ultimo_acceso', 
                // 'created_at'
            )
            ->paginate(4)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'nombre_completo' => $user->persona->nombre_completo,
                    'email' => $user->email,
                    'rol' => $user->rol->nombre,
                    'estado' => $user->estado,
                    // 'created_at' => $user->created_at->format('d/m/Y'),
                ];
            });

        $stats = [
            'total' => User::count(),
            'activos' => User::where('estado', 'activo')->count(),
            'inactivos' => User::where('estado', 'inactivo')->count(),
        ];

        return Inertia::render('Admin/Users/index', [
            'users' => $users,
            'stats' => $stats
        ]);
    }

    public function create()
    {
        $roles = Rol::select('id', 'nombre')->get();

        return Inertia::render('Admin/Users/create', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $messages = [
            // CI
            'ci.required' => 'El número de CI es obligatorio.',
            'ci.unique' => 'Este número de CI ya está registrado.',
            'ci.max' => 'El CI no puede tener más de 20 caracteres.',

            // Nombre y apellidos
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.max' => 'El nombre no puede tener más de 100 caracteres.',

            'apellido_paterno.required' => 'El apellido paterno es obligatorio.',
            'apellido_paterno.max' => 'El apellido paterno no puede tener más de 100 caracteres.',

            'apellido_materno.max' => 'El apellido materno no puede tener más de 100 caracteres.',

            // Fecha
            'fecha_nacimiento.date' => 'La fecha de nacimiento debe ser una fecha válida.',

            // Género
            'genero.required' => 'El género es obligatorio.',
            'genero.in' => 'El género seleccionado no es válido.',

            // Celular
            'celular.max' => 'El celular no puede tener más de 20 caracteres.',
            'celular.not_regex' => 'El celular no puede contener letras.',

            // Dirección y ciudad
            'direccion.max' => 'La dirección no puede tener más de 255 caracteres.',
            'ciudad.required' => 'La ciudad es obligatoria.',
            'ciudad.max' => 'La ciudad no puede tener más de 100 caracteres.',

            // Email
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Debe ingresar un correo electrónico válido.',
            'email.max' => 'El correo no puede tener más de 255 caracteres.',
            'email.unique' => 'Este correo electrónico ya está registrado.',

            // Contraseña
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden.',

            // Rol
            'rol_id.required' => 'El rol es obligatorio.',
            'rol_id.exists' => 'El rol seleccionado no es válido.',
        ];

        $validated = $request->validate([
            // Datos de Persona
            'ci' => 'required|string|max:20|unique:personas,ci',
            'nombre' => 'required|string|max:100',
            'apellido_paterno' => 'required|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'fecha_nacimiento' => 'nullable|date',
            'genero' => 'required|in:masculino,femenino,otro',
            'celular' => 'nullable|string|max:20|not_regex:/[a-zA-Z]/',
            'direccion' => 'nullable|string|max:255',
            'ciudad' => 'required|string|max:100',

            // Datos de Usuario
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'rol_id' => 'required|exists:roles,id',
        ], $messages);

        // 1. Crear la persona
        $persona = Persona::create([
            'ci' => $validated['ci'],
            'nombre' => $validated['nombre'],
            'apellido_paterno' => $validated['apellido_paterno'],
            'apellido_materno' => $validated['apellido_materno'],
            'fecha_nacimiento' => $validated['fecha_nacimiento'],
            'genero' => $validated['genero'],
            'celular' => $validated['celular'],
            'direccion' => $validated['direccion'],
            'ciudad' => $validated['ciudad'],
        ]);

        // 2. Crear el usuario
        $user = User::create([
            'name' => $persona->nombre_completo,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'persona_id' => $persona->id,
            'rol_id' => $validated['rol_id'],
            'estado' => 'activo',
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario creado exitosamente');
    }


    public function edit(User $user)
    {
        // Cargar relaciones necesarias
        $user->load('persona', 'rol');
        $roles = Rol::select('id', 'nombre')->get();

        // Formatear la fecha para el input type="date" (YYYY-MM-DD)
        $fechaNacimiento = $user->persona->fecha_nacimiento
            ? $user->persona->fecha_nacimiento->format('Y-m-d')
            : '';

        return Inertia::render('Admin/Users/edit', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'rol_id' => $user->rol_id,
                'estado' => $user->estado,
                'persona' => [
                    'ci' => $user->persona->ci,
                    'nombre' => $user->persona->nombre,
                    'apellido_paterno' => $user->persona->apellido_paterno,
                    'apellido_materno' => $user->persona->apellido_materno,
                    'fecha_nacimiento' => $fechaNacimiento, // Ya formateada
                    'genero' => $user->persona->genero,
                    'celular' => $user->persona->celular,
                    'direccion' => $user->persona->direccion,
                    'ciudad' => $user->persona->ciudad,
                ]
            ],
            'roles' => $roles,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $messages = [
            // CI
            'ci.required' => 'El número de CI es obligatorio.',
            'ci.unique' => 'Este número de CI ya está registrado.',
            'ci.max' => 'El CI no puede tener más de 20 caracteres.',

            // Nombre y apellidos
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.max' => 'El nombre no puede tener más de 100 caracteres.',

            'apellido_paterno.required' => 'El apellido paterno es obligatorio.',
            'apellido_paterno.max' => 'El apellido paterno no puede tener más de 100 caracteres.',

            'apellido_materno.max' => 'El apellido materno no puede tener más de 100 caracteres.',

            // Fecha
            'fecha_nacimiento.date' => 'La fecha de nacimiento debe ser una fecha válida.',

            // Género
            'genero.required' => 'El género es obligatorio.',
            'genero.in' => 'El género seleccionado no es válido.',

            // Celular
            'celular.max' => 'El celular no puede tener más de 20 caracteres.',
            'celular.not_regex' => 'El celular no puede contener letras.',

            // Dirección y ciudad
            'direccion.max' => 'La dirección no puede tener más de 255 caracteres.',
            'ciudad.required' => 'La ciudad es obligatoria.',
            'ciudad.max' => 'La ciudad no puede tener más de 100 caracteres.',

            // Email
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Debe ingresar un correo electrónico válido.',
            'email.max' => 'El correo no puede tener más de 255 caracteres.',
            'email.unique' => 'Este correo electrónico ya está registrado.',

            // Contraseña
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden.',

            // Rol
            'rol_id.required' => 'El rol es obligatorio.',
            'rol_id.exists' => 'El rol seleccionado no es válido.',
        ];

        $validated = $request->validate([
            // Datos de Persona
            'ci' => 'required|string|max:20|unique:personas,ci,' . $user->persona_id,
            'nombre' => 'required|string|max:100',
            'apellido_paterno' => 'required|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'fecha_nacimiento' => 'nullable|date',
            'genero' => 'required|in:masculino,femenino,otro',
            'celular' => 'nullable|string|max:20|not_regex:/[a-zA-Z]/',
            'direccion' => 'nullable|string|max:255',
            'ciudad' => 'required|string|max:100',

            // Datos de Usuario
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'rol_id' => 'required|exists:roles,id',
        ], $messages);

        // 1. Actualizar la persona
        $personaData = [
            'ci' => $validated['ci'],
            'nombre' => $validated['nombre'],
            'apellido_paterno' => $validated['apellido_paterno'],
            'apellido_materno' => $validated['apellido_materno'],
            'genero' => $validated['genero'],
            'celular' => $validated['celular'],
            'direccion' => $validated['direccion'],
            'ciudad' => $validated['ciudad'],
        ];

        // Solo agregar fecha_nacimiento si no está vacía
        if (!empty($validated['fecha_nacimiento'])) {
            $personaData['fecha_nacimiento'] = $validated['fecha_nacimiento'];
        } else {
            $personaData['fecha_nacimiento'] = null;
        }

        $user->persona->update($personaData);

        // 2. Actualizar el usuario
        $updateData = [
            'name' => $user->persona->nombre_completo,
            'email' => $validated['email'],
            'rol_id' => $validated['rol_id'],
        ];

        // Solo actualizar contraseña si se proporciona
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario actualizado exitosamente');
    }

    public function destroy(User $user)
    {
        // Eliminar usuario y su persona asociada
        $user->delete();
        $user->persona->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'Usuario eliminado exitosamente');
    }
}
