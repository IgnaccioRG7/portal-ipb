<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class ImageController extends Controller
{
    public function getPrivateImage($folder, $filename)
    {
        // Verificar que el usuario está autenticado
        if (!Auth::check()) {
            abort(403, 'No autorizado');
        }

        $path = "private/{$folder}/{$filename}";
        
        if (!Storage::exists($path)) {
            abort(404);
        }

        return Storage::response($path);
    }
}