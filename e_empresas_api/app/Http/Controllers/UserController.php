<?php

namespace App\Http\Controllers;

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
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string',
            'phone' => 'nullable|string',
            'is_admin' => 'boolean',
            'is_student' => 'boolean',
            'is_tutor' => 'boolean',
            'study_cycle' => 'nullable|string',
            'nia' => 'nullable|string',
            'nif' => 'nullable|string',
            'gender' => 'nullable|string',
            'photo' => 'nullable|image|max:2048',
            'status' => 'boolean',
            'email_verified' => 'boolean',
        ]);

        $user = new User();
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->phone = $validated['phone'] ?? null;
        $user->password = Hash::make($validated['password']);
        $user->is_admin = $validated['is_admin'] ?? false;
        $user->is_student = $validated['is_student'] ?? false;
        $user->is_tutor = $validated['is_tutor'] ?? false;
        $user->study_cycle = $validated['study_cycle'] ?? null;
        $user->nia = $validated['nia'] ?? null;
        $user->nif = $validated['nif'] ?? null;
        $user->gender = $validated['gender'] ?? null;
        $user->status = $validated['status'] ?? true;
        $user->email_verified = $validated['email_verified'] ?? false;

        if ($request->hasFile('photo')) {
            $user->photo = $request->file('photo')->store('photos', 'public');
        }

        $user->save();

        return response()->json($user, 201);
    }


    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $comment = User::findOrFail($id);
        $comment->update($request->all());
        return $comment;
    }

    public function destroy($id)
    {
        return User::destroy($id);
    }

    public function storeTutor(Request $request)
    {
        if ($request->user()->is_tutor && $request->is_admin) {
            return response()->json(['message' => 'Unauthorized to create admins'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'study_cycle' => 'nullable|string|max:255',
            'nia' => 'nullable|integer',
            'nif' => 'nullable|string|max:20',
            'gender' => 'nullable|string|max:20',
        ]);

        $tutor = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'is_admin' => false,
            'is_student' => false,
            'is_tutor' => true,
            'study_cycle' => $request->study_cycle,
            'nia' => $request->nia,
            'nif' => $request->nif,
            'gender' => $request->gender,
        ]);

        return response()->json(['message' => 'Tutor created successfully', 'tutor' => $tutor], 201);
    }

}
