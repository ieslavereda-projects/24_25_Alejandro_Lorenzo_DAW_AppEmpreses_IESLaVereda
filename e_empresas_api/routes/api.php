<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\TutorsImportController;
use App\Http\Controllers\CompanyImportController;
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
    return response()->json([
        'token' => $token,
        'user' => [
            'id' => $user->id,
            'email' => $user->email,
            'name' => $user->name,
        ]
    ]);
});

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', function (Request $request) {
        $request->user()?->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    });

    Route::post('/tutors/import', [TutorsImportController::class, 'import']);
    Route::post('/companies/import', [CompanyImportController::class, 'import']);

    Route::get('/user', fn(Request $request) => $request->user());

    Route::get('/notices', [NoticeController::class, 'index']);
    Route::post('/notices', [NoticeController::class, 'store']);

    Route::put('/tutor-comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/tutor-comments/{comment}', [CommentController::class, 'destroy']);
});

Route::get('/companies/{company}/reviews', [CompanyReviewController::class, 'index']);
Route::post('/companies/{company}/reviews', [CompanyReviewController::class, 'store']);
Route::get('/reviews', [CompanyReviewController::class, 'allReviews']);
Route::put('/reviews/{id}', [CompanyReviewController::class, 'approve']);
Route::delete('/reviews/{review}', [CompanyReviewController::class, 'destroy']);

Route::get('/companies/{company}/tutor-comments', [CommentController::class, 'index']);
Route::post('/companies/{company}/tutor-comments', [CommentController::class, 'store']);

