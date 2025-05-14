<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\TutorsImportController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CompanyDeregisterRequestController;
use App\Http\Controllers\CompanyRegisterRequestController;
use App\Http\Controllers\CompanyReviewController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\UserController;

use App\Models\User;

Route::apiResource('comments', CommentController::class);
Route::apiResource('companies', CompanyController::class);
Route::apiResource('company-deregister-requests', CompanyDeregisterRequestController::class);
Route::apiResource('company-register-requests', CompanyRegisterRequestController::class);
Route::apiResource('company-reviews', CompanyReviewController::class);
Route::apiResource('notices', NoticeController::class);
Route::apiResource('users', UserController::class);

Route::post('/login', function (Request $request) {
    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Credenciales inválidas'], 401);
    }

    $token = $user->createToken('api-token')->plainTextToken;
    return response()->json(['token' => $token]);
});

Route::middleware('auth:sanctum')->post('/logout', function (Request $request) {
    $user = $request->user();

    if ($user) {
        $user->currentAccessToken()->delete();
    }

    return response()->json(['message' => 'Sesión cerrada correctamente']);
});

Route::middleware('auth:sanctum')->post('/tutors/import', [TutorsImportController::class, 'import']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
