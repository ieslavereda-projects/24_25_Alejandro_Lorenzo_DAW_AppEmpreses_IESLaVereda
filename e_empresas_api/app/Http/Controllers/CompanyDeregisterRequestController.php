<?php

namespace App\Http\Controllers;

use App\Models\CompanyDeregisterRequest;
use Illuminate\Http\Request;

class CompanyDeregisterRequestController extends Controller
{
    public function index()
    {
        return CompanyDeregisterRequest::all();
    }

    public function store(Request $request)
    {
        return CompanyDeregisterRequest::create($request->all());
    }

    public function show($id)
    {
        return CompanyDeregisterRequest::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $comment = CompanyDeregisterRequest::findOrFail($id);
        $comment->update($request->all());
        return $comment;
    }

    public function destroy($id)
    {
        return CompanyDeregisterRequest::destroy($id);
    }
}
