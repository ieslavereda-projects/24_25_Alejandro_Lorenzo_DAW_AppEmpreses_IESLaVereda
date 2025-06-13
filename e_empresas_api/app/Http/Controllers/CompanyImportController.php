<?php

namespace App\Http\Controllers;

use App\Imports\CompaniesImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class CompanyImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx',
        ]);

        logger('Inicio de importación de empresas');
        Excel::import(new CompaniesImport, $request->file('file'));
        logger('Importación completada');


        return response()->json(['message' => 'Empresas importadas correctamente']);
    }
}
