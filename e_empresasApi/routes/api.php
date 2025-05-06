<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\InternshipController;
use App\Http\Controllers\FollowUpController;
use App\Http\Controllers\DailyLogController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
/*
Route::apiResources([
    'companies' => CompanyController::class,
    'users' => UserController::class,
    'internships' => InternshipController::class,
    'followups' => FollowUpController::class,
    'dailylogs' => DailyLogController::class,
]);
*/