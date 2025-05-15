<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index()
    {
        return Company::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'manager' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'industry' => 'nullable|string|max:255',
            'observations' => 'nullable|string|max:255',
            'allows_erasmus' => 'nullable|boolean',
        ]);

        $company = Company::create($validated);

        return response()->json($company, 201);
    }

    public function show($id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['message' => "No se ha encontrado ninguna compañía con ID $id"], 404);
        }

        return response()->json($company);
    }

    public function update(Request $request, $id)
    {
        $company = Company::find($id);

        if (!$company) {
            return response()->json(['message' => "No se ha encontrado ninguna compañía con ID $id"], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'manager' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'industry' => 'nullable|string|max:255',
            'observations' => 'nullable|string|max:255',
            'allows_erasmus' => 'nullable|boolean',
        ]);

        $company->update($validated);

        return response()->json($company);
    }


    public function destroy($id)
    {
        try {
            $company = Company::find($id);
            $company->reviews()->delete();
            $company->delete();
            return response()->json(['message' => 'Compañía y eliminada correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
