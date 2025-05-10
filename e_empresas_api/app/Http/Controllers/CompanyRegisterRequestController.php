<?php

namespace App\Http\Controllers;

use App\Models\CompanyRegisterRequest;
use Illuminate\Http\Request;

class CompanyRegisterRequestController extends Controller
{
    public function index()
    {
        return CompanyRegisterRequest::all();
    }

    public function store(Request $request)
    {
        return CompanyRegisterRequest::create($request->all());
    }

    public function show($id)
    {
        return CompanyRegisterRequest::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $comment = CompanyRegisterRequest::findOrFail($id);
        $comment->update($request->all());
        return $comment;
    }

    public function destroy($id)
    {
        return CompanyRegisterRequest::destroy($id);
    }
}
