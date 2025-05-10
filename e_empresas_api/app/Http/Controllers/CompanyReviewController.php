<?php

namespace App\Http\Controllers;

use App\Models\CompanyReview;
use Illuminate\Http\Request;

class CompanyReviewController extends Controller
{
    public function index()
    {
        return CompanyReview::all();
    }

    public function store(Request $request)
    {
        return CompanyReview::create($request->all());
    }

    public function show($id)
    {
        return CompanyReview::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $comment = CompanyReview::findOrFail($id);
        $comment->update($request->all());
        return $comment;
    }

    public function destroy($id)
    {
        return CompanyReview::destroy($id);
    }
}
