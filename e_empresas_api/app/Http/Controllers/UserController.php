<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        try {

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|unique:users,email|max:255',
                'password' => 'required|string|min:4',
                'is_admin' => 'nullable|boolean',
                'is_student' => 'nullable|boolean',
                'is_tutor' => 'nullable|boolean',
                'study_cycle' => 'nullable|string|max:255',
                'nia' => 'nullable|digits_between:1,11',
                'nif' => 'nullable|string|max:20',
                'gender' => 'nullable|string|max:20',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'is_admin' => $validated['is_admin'] ?? 0,
                'is_student' => $validated['is_student'] ?? 0,
                'is_tutor' => $validated['is_tutor'] ?? 0,
                'study_cycle' => $validated['study_cycle'],
                'nia' => $validated['nia'],
                'nif' => $validated['nif'],
                'gender' => $validated['gender'],
            ]);

            return response()->json(['message' => 'Usuario creado correctamente'], 201);

        } catch (Exception $e) {
            return response()->json(['error' => 'Hubo un error interno'], 500);
        }

    }


    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'nif' => 'required|string',
            'study_cycle' => 'nullable|string',
            'is_admin' => 'boolean',
            'is_tutor' => 'boolean',
            'is_student' => 'boolean',
            'nia' => 'nullable|integer',
            'gender' => 'nullable|string',
        ]);

        $user = User::findOrFail($id);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->nif = $request->nif;
        $user->study_cycle = $request->study_cycle;
        $user->is_admin = $request->is_admin;
        $user->is_tutor = $request->is_tutor;
        $user->is_student = $request->is_student;
        $user->nia = $request->nia;
        $user->gender = $request->gender;

        $user->save();

        return response()->json($user);
    }


    public function destroy($id)
    {
        return User::destroy($id);
    }

}
