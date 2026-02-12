<?php

use App\Http\Controllers\Admin\CursoController;
use App\Http\Controllers\Admin\MatriculaController;
use App\Http\Controllers\Admin\RecursoController as AdminRecursoController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\RecursoController;
use App\Http\Controllers\Student\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');
Route::get('/recursos', [RecursoController::class, 'index'])->name('recursos.index');
Route::get('/recursos/{recurso}', [RecursoController::class, 'show'])->name('recursos.show');


// Route::get('dashboard', function () {
//     $user = request()->user()->loadMissing('rol');

//     return match ($user->rol->nombre) {
//         'Admin' => Inertia::render('Admin/dashboard'),
//         'Profesor' => Inertia::render('Professor/dashboard'),
//         'Estudiante' => Inertia::render('dashboard'),
//         default      => abort(403),
//     };

// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', function () {
    $user = request()->user()->loadMissing('rol');

    return match ($user->rol->nombre) {
        'Admin'      => redirect()->route('admin.dashboard'),
        'Profesor'   => redirect()->route('profesor.dashboard'),
        'Estudiante' => redirect()->route('estudiante.dashboard'),
        default      => abort(403),
    };
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware(['auth', 'verified'])->group(function () {

    // Route::get('/admin', fn () =>
    //     Inertia::render('Admin/dashboard')
    // )->middleware('role:Admin')->name('admin.dashboard');

    Route::get(
        '/profesor',
        fn() =>
        Inertia::render('Professor/dashboard')
    )->middleware('role:Profesor')->name('profesor.dashboard');

    // Route::get('/estudiante', fn () =>
    //     Inertia::render('dashboard')
    // )->middleware('role:Estudiante')->name('estudiante.dashboard');
});

// Rutas para el administrador
Route::middleware(['auth', 'verified', 'role:Admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', fn() => Inertia::render('Admin/dashboard'))->name('dashboard');
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::get('/students/search', [UserController::class, 'search']);


    // 🆕 Gestión de recursos
    Route::get('/recursos', [AdminRecursoController::class, 'index'])->name('recursos.index');
    Route::get('/recursos/create', [AdminRecursoController::class, 'create'])->name('recursos.create');
    Route::post('/recursos', [AdminRecursoController::class, 'store'])->name('recursos.store');
    Route::get('/recursos/{recurso}/edit', [AdminRecursoController::class, 'edit'])->name('recursos.edit');
    Route::put('/recursos/{recurso}', [AdminRecursoController::class, 'update'])->name('recursos.update');
    Route::delete('/recursos/{recurso}', [AdminRecursoController::class, 'destroy'])->name('recursos.destroy');
    Route::patch('/recursos/{recurso}/toggle', [AdminRecursoController::class, 'toggleVisibility'])->name('recursos.toggle');

    // Rutas de matriculas
    Route::prefix('matriculas')->name('matriculas.')->group(function () {
        Route::get('/estudiante/{user}', [MatriculaController::class, 'estudiante'])->name('estudiante');
        Route::post('/estudiante/{user}/matricular', [MatriculaController::class, 'matricular'])->name('matricular');

        Route::get('/estudiante/{user}/curso/{curso}/modulos', [MatriculaController::class, 'modulos'])->name('modulos');
        Route::post('/estudiante/{user}/curso/{curso}/guardar-modulos', [MatriculaController::class, 'guardarModulos'])->name('guardar-modulos');


        // Route::get('/estudiante/{user}/curso/{curso}/materias', [MatriculaController::class, 'materias'])->name('materias');
        // Route::post('/estudiante/{user}/curso/{curso}/guardar-temas', [MatriculaController::class, 'guardarTemas'])->name('guardar-temas');

        Route::delete('/{matricula}', [MatriculaController::class, 'destroy'])->name('destroy');

        Route::get('/{matricula}/editar', [MatriculaController::class, 'edit'])->name('edit');
        Route::put('/{matricula}', [MatriculaController::class, 'update'])->name('update');
    });

    // Gestión de Cursos
    Route::prefix('cursos')->name('cursos.')->group(function () {
        Route::get('/', [CursoController::class, 'adminIndex'])->name('index');
        Route::get('/create', [CursoController::class, 'create'])->name('create');
        Route::post('/', [CursoController::class, 'store'])->name('store');
        Route::get('/{curso}/edit', [CursoController::class, 'edit'])->name('edit');
        Route::put('/{curso}', [CursoController::class, 'update'])->name('update');
        Route::delete('/{curso}', [CursoController::class, 'destroy'])->name('destroy');

        // Eliminación
        Route::patch('/{curso}/toggle-estado', [CursoController::class, 'toggleEstado'])->name('toggle-estado');


        // Asignar materias al curso
        Route::get('/{curso}/asignar-materias', [CursoController::class, 'asignarMaterias'])->name('asignar-materias');
        Route::post('/{curso}/guardar-materias', [CursoController::class, 'guardarMaterias'])->name('guardar-materias');
    });

    // TODO: Validar la ruta directa publica para que no puedan ingresar directamente desde la url
    // Route::get('/files/recursos/{filename}', function ($filename) {
    //     $path = storage_path('app/public/recursos/' . $filename);

    //     if (!file_exists($path)) {
    //         abort(404, 'Archivo no encontrado');
    //     }

    //     if (pathinfo($path, PATHINFO_EXTENSION) !== 'pdf') {
    //         abort(403, 'Solo se permiten archivos PDF');
    //     }

    //     return response()->file($path, [
    //         'Content-Type' => 'application/pdf',
    //         'Content-Disposition' => 'inline; filename="' . $filename . '"'
    //     ]);
    // })->name('recursos.viewPdf');
});

// Rutas para el estudiante
Route::middleware(['auth', 'verified', 'role:Estudiante,Admin'])->prefix('estudiante')->name('estudiante.')->group(function () {
    // Route::get('/', fn () => Inertia::render('dashboard'))->name('dashboard');
    Route::get('/', [StudentController::class, 'index'])->name('dashboard');
    Route::get('/curso/{course}', [StudentController::class, 'subjects'])->name('subjects');
    Route::get('/curso/{curso}/modulo/{modulo}/materia/{materia}', [StudentController::class, 'topics'])->name('topics');
    Route::get('/curso/{curso}/modulo/{modulo}/materia/{materia}/tema/{tema}', [StudentController::class, 'topic'])->name('topic');

    Route::post('/curso/{curso}/modulo/{modulo}/materia/{materia}/tema/{tema}/examen', [StudentController::class, 'guardarExamen'])
        ->name('examen.guardar');
    Route::get('/curso/{curso}/modulo/{modulo}/materia/{materia}/tema/{tema}/resultados', [StudentController::class, 'resultados'])
        ->name('tema.resultados');
});

// Rutas para el profesor con el admin
// Route::middleware(['auth', 'verified', 'role:Profesor,Admin'])->prefix('cursos')->name('cursos.')->group(function () {;
//     Route::get('/', [CursoController::class, 'index'])->name('index');
//     Route::get('/{curso}/materias', [CursoController::class, 'materias'])->name('materias');
//     Route::get('/{curso}/materias/{materia}/temas', [CursoController::class, 'temas'])->name('materias.temas');
//     Route::get('/{curso}/materias/{materia}/temas/{tema}/edit', [CursoController::class, 'editTema'])->name('temas.edit');
//     Route::put('/{curso}/materias/{materia}/temas/{tema}', [CursoController::class, 'updateTema'])->name('temas.update');
// });


// Rutas para el profesor - AHORA CON MÓDULOS
Route::middleware(['auth', 'verified', 'role:Profesor,Admin'])->prefix('cursos')->name('cursos.')->group(function () {
    Route::get('/', [CursoController::class, 'index'])->name('index');

    // Módulos del curso donde el profesor tiene materias
    Route::get('/{curso}/modulos', [CursoController::class, 'modulosProfesor'])->name('modulos');

    // Materias del profesor en un módulo específico
    Route::get('/{curso}/modulo/{modulo}/materias', [CursoController::class, 'materiasProfesor'])->name('materias');

    // Temas de una materia en un módulo específico
    Route::get('/{curso}/modulo/{modulo}/materia/{materia}/temas', [CursoController::class, 'temasProfesor'])->name('temas');

    // Editar tema con módulo en contexto
    Route::get('/{curso}/modulo/{modulo}/materia/{materia}/tema/{tema}/edit', [CursoController::class, 'editTema'])->name('temas.edit');
    Route::put('/{curso}/modulo/{modulo}/materia/{materia}/tema/{tema}', [CursoController::class, 'updateTema'])->name('temas.update');

    // Crear nuevo tema
    Route::get('/{curso}/modulo/{modulo}/materia/{materia}/temas/create', [CursoController::class, 'createTema'])->name('temas.create');
    Route::post('/{curso}/modulo/{modulo}/materia/{materia}/temas', [CursoController::class, 'storeTema'])->name('temas.store');

    // ELIMINAR tema
    Route::delete('/{curso}/modulo/{modulo}/materia/{materia}/tema/{tema}', [CursoController::class, 'destroyTema'])->name('temas.destroy');

    // Ver resultados del tema:
    Route::get(
        '/{curso}/modulo/{modulo}/materia/{materia}/tema/{tema}/resultados',
        [CursoController::class, 'resultadosTemaProfesor']
    )
        ->name('temas.resultados');
});



require __DIR__ . '/settings.php';



// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/dashboard', fn () =>
//         Inertia::render('dashboard')
//     )->middleware('role:estudiante')->name('dashboard');

//     Route::get('/admin', fn () =>
//         Inertia::render('Admin/Dashboard')
//     )->middleware('role:admin')->name('admin-dashboard');

//     Route::get('/profesor', fn () =>
//         Inertia::render('Profesor/Dashboard')
//     )->middleware('role:profesor')->name('profesor-dashboard');
// });