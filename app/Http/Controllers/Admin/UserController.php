<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Persona;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
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

        $search = $request->query('search', '');
        $perPage = $request->query('per_page', 4);
        $rolFilter = $request->query('rol', '');

        $query = User::with(['persona', 'rol'])
            ->select(
                'id',
                'persona_id',
                'rol_id',
                'email',
                'estado',
                // 'ultimo_acceso', 
                // 'created_at'
            );

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                // Buscar en email del usuario
                $q->where('email', 'LIKE', "%{$search}%")
                    // Buscar en datos de la persona relacionada
                    ->orWhereHas('persona', function ($personaQuery) use ($search) {
                        $personaQuery->where('ci', 'LIKE', "%{$search}%")
                            ->orWhere('nombre', 'LIKE', "%{$search}%")
                            ->orWhere('apellido_paterno', 'LIKE', "%{$search}%")
                            ->orWhere('apellido_materno', 'LIKE', "%{$search}%")
                            ->orWhereRaw("nombre || ' ' || apellido_paterno LIKE ?", ["%{$search}%"])
                            ->orWhereRaw("nombre || ' ' || apellido_paterno || ' ' || apellido_materno LIKE ?", ["%{$search}%"]);
                        // En MYSQL ->orWhereRaw("CONCAT(nombre, ' ', apellido_paterno) LIKE ?", ["%{$search}%"]);
                    });
            });
        }

        if (!empty($rolFilter)) {
            $query->whereHas('rol', function ($q) use ($rolFilter) {
                $q->where('nombre', $rolFilter);
            });
        }

        $users = $query
            ->paginate($perPage)
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
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
                'role' => $rolFilter
            ]
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

            // Si tiene parentesco validar el estudiante
            'estudiante_id.required_if' => 'Debe seleccionar un estudiante.',
            'estudiante_id.exists' => 'El estudiante seleccionado no existe.',
            'parentesco.required_if' => 'El parentesco es obligatorio para tutores.',
        ];

        $rol = Rol::find($request->rol_id);
        $isTutor = $rol && $rol->nombre === 'Tutor';

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

            'estudiante_id' => $isTutor ? 'required|exists:users,id' : 'nullable',
            'parentesco' => $isTutor ? 'required|string|in:padre,madre,tio,tia,abuelo,abuela,otro' : 'nullable',
        ], $messages);


        $tutorId = null;
        if ($isTutor && !empty($validated['estudiante_id'])) {
            $estudianteUser = User::find($validated['estudiante_id']);
            if ($estudianteUser) {
                $tutorId = $estudianteUser->persona_id;
            }
        }

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

            'tutor_id' => $tutorId,
            'parentesco_tutor' => $isTutor ? $validated['parentesco'] : null,
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

        $userData = [
            'id' => $user->id,
            'email' => $user->email,
            'rol_id' => $user->rol_id,
            'estado' => $user->estado,
            'persona' => [
                'ci' => $user->persona->ci,
                'nombre' => $user->persona->nombre,
                'apellido_paterno' => $user->persona->apellido_paterno,
                'apellido_materno' => $user->persona->apellido_materno,
                'fecha_nacimiento' => $fechaNacimiento,
                'genero' => $user->persona->genero,
                'celular' => $user->persona->celular,
                'direccion' => $user->persona->direccion,
                'ciudad' => $user->persona->ciudad,
            ]
        ];

        // Agregar datos de tutor si existe
        if ($user->persona->tutor_id) {
            // Buscar el usuario que corresponde a este tutor_id
            $estudiantePersona = Persona::find($user->persona->tutor_id);
            if ($estudiantePersona) {
                $estudianteUser = User::where('persona_id', $estudiantePersona->id)->first();

                $userData['tutor'] = [
                    'estudiante_id' => $estudianteUser ? $estudianteUser->id : 0,
                    'parentesco' => $user->persona->parentesco_tutor,
                    'estudiante' => [
                        'nombre_completo' => $estudiantePersona->nombre_completo ?? '',
                    ],
                ];
            }
        }

        return Inertia::render('Admin/Users/edit', [
            'user' => $userData,
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

            // Si tiene parentesco validar el estudiante
            'estudiante_id.required_if' => 'Debe seleccionar un estudiante.',
            'estudiante_id.exists' => 'El estudiante seleccionado no existe.',
            'parentesco.required_if' => 'El parentesco es obligatorio para tutores.',
        ];

        // Obtener el rol seleccionado
        $rol = Rol::find($request->rol_id);
        $isTutor = $rol && $rol->nombre === 'Tutor';

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

            'estudiante_id' => $isTutor ? 'required|exists:users,id' : 'nullable',
            'parentesco' => $isTutor ? 'required|string|in:padre,madre,tio,tia,abuelo,abuela,otro' : 'nullable',
        ], $messages);

        // Si es Tutor, obtener el persona_id del estudiante
        $tutorId = null;
        if ($isTutor && !empty($validated['estudiante_id'])) {
            $estudianteUser = User::find($validated['estudiante_id']);
            if ($estudianteUser) {
                $tutorId = $estudianteUser->persona_id;
            }
        }

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
        try {
            // Eliminar usuario y su persona asociada
            $user->delete();
            $user->persona->delete();

            return redirect()->route('admin.users.index')
                ->with('success', 'Usuario eliminado exitosamente');
        } catch (QueryException $e) {
            //throw $th;
            Log::info("Error al eliminar el usuario");
            Log::info($e);
            return redirect()->route('admin.users.index')
                ->withErrors(['error' => 'No es posible eliminar a este usuario.']);
        }
    }


    public function search(Request $request)
    {
        $query = $request->input('q', '');

        // Si no hay búsqueda, retornar vacío
        if (strlen($query) < 1) {
            return response()->json([]);
        }

        // Buscar usuarios con rol "Estudiante"
        $students = User::with('persona')
            ->whereHas('rol', function ($q) {
                $q->where('nombre', 'Estudiante');
            })
            ->whereHas('persona', function ($q) use ($query) {
                $q->where('nombre', 'LIKE', "%{$query}%")
                    ->orWhere('apellido_paterno', 'LIKE', "%{$query}%")
                    ->orWhere('apellido_materno', 'LIKE', "%{$query}%")
                    ->orWhere('ci', 'LIKE', "%{$query}%")
                    ->orWhereRaw("nombre || ' ' || apellido_paterno LIKE ?", ["%{$query}%"])
                    ->orWhereRaw("nombre || ' ' || apellido_paterno || ' ' || apellido_materno LIKE ?", ["%{$query}%"]);
                // Para MySQL usa: CONCAT(nombre, ' ', apellido_paterno)
            })
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'nombre_completo' => $user->persona->nombre_completo,
                    'ci' => $user->persona->ci,
                    'email' => $user->email,
                ];
            });

        return response()->json($students);
    }

    public function toggleEstado(User $user) {
        Log::info($user);
        $nuevoEstado = $user->estado === 'activo' ? 'inactivo' : 'activo';
        $user->update(['estado' => $nuevoEstado]);
        Log::info($nuevoEstado);
        Log::info($user);

        return back()->with('success', "Usuario {$nuevoEstado} correctamente");
    }
}
