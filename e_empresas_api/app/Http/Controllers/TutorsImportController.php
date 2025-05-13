<?php

namespace App\Http\Controllers;

use App\Imports\TutorsImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Exception;
use Illuminate\Database\QueryException;

class TutorsImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        $file = $request->file('file');

        try {
            Excel::import(new TutorsImport, $file);
            return response()->json(['message' => 'Importación exitosa'], 200);
        } catch (QueryException $e) {
            return response()->json(['error' => 'Error de base de datos: ' . $e->getMessage()], 500);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error en la importación: ' . $e->getMessage()], 500);
        }
    }
}
