<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    public function index()
    {
        return Notice::all();
    }

    public function store(Request $request)
    {
        return Notice::create($request->all());
    }

    public function show($id)
    {
        return Notice::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $comment = Notice::findOrFail($id);
        $comment->update($request->all());
        return $comment;
    }

    public function destroy($id)
    {
        return Notice::destroy($id);
    }
}
