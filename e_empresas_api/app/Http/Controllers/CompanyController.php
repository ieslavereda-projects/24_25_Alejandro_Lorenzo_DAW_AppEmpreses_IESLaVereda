<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index() {
        return Company::all();
    }

    public function store(Request $request) {
        return Company::create($request->all());
    }

    public function show($id) {
        return Company::findOrFail($id);
    }

    public function update(Request $request, $id) {
        $comment = Company::findOrFail($id);
        $comment->update($request->all());
        return $comment;
    }

    public function destroy($id) {
        return Company::destroy($id);
    }
}
