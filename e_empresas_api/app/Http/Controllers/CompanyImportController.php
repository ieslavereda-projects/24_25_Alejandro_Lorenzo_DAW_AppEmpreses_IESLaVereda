<?php

namespace App\Http\Controllers;

use App\Imports\CompaniesImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class CompanyImportController extends Controller
{
    public function import(Request $request)
    {
        logger('Entrando a CompaniesImport 🚨');

        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        logger('Inicio de importación de empresas'); // LOG PARA COMPROBAR ENTRADA
        Excel::import(new CompaniesImport, $request->file('file'));
        logger('Importación completada'); // LOG DESPUÉS DE EJECUTAR EL IMPORT


        return response()->json(['message' => 'Empresas importadas correctamente']);
    }
}
