<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\PublicPostController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Public routes (no auth required) — consumed by the homepage.
Route::post('/login', [AuthController::class, 'login']);
Route::get('/public/posts', [PublicPostController::class, 'index']);
Route::get('/public/posts/top-10', [PublicPostController::class, 'topTen']);
Route::get('/public/categories', [PublicPostController::class, 'categories']);
Route::get('/public/posts/{slug}', [PublicPostController::class, 'show']);

// Admin panel routes — require a valid Sanctum token.
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::apiResource('posts', PostController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('users', UserController::class);
});
