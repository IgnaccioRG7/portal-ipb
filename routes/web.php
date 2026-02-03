<?php

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
});

// Rutas para el estudiante
Route::middleware(['auth', 'verified', 'role:Estudiante,Admin'])->prefix('estudiante')->name('estudiante.')->group(function () {
    // Route::get('/', fn () => Inertia::render('dashboard'))->name('dashboard');
    Route::get('/', [StudentController::class, 'index'])->name('dashboard');
    Route::get('/curso/{course}', [StudentController::class, 'subjects'])->name('subjects');
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