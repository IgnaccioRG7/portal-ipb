<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

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

    Route::get('/profesor', fn () =>
        Inertia::render('Professor/dashboard')
    )->middleware('role:Profesor')->name('profesor.dashboard');

    Route::get('/estudiante', fn () =>
        Inertia::render('dashboard')
    )->middleware('role:Estudiante')->name('estudiante.dashboard');
});

// Rutas para el administrador
Route::middleware(['auth', 'verified', 'role:Admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', fn () => Inertia::render('Admin/dashboard'))->name('dashboard');
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
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