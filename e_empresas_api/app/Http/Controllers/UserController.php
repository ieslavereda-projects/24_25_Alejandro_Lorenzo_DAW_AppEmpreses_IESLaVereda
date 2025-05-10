<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function store(Request $request)
    {
        return User::create($request->all());
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

    

}
