<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Company;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Company $company)
    {
        return $company->tutorComments;
    }

    public function store(Request $req, Company $company)
    {
        $validated = $req->validate([
            'comment' => 'required|string',
            'id_tutor' => 'required|integer|exists:users,id',
        ]);

        return $company->tutorComments()->create([
            'id_tutor' => $validated['id_tutor'],
            'comment'  => $validated['comment']
        ]);
    }

    public function show($id)
    {
        return Comment::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        $user = auth()->user();
        if ($comment->id_tutor !== $user->id && !$user->is_admin) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'comment' => 'required|string'
        ]);

        $comment->update($validated);
        return response()->json($comment);
    }

    public function destroy(Comment $comment)
    {
        $user = auth()->user();
        if ($comment->id_tutor !== $user->id && !$user->is_admin) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $comment->delete();
        return response()->noContent();
    }
}
