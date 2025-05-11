<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserType
{
    public function handle(Request $request, Closure $next, ...$types)
    {
        $user = $request->user();

        foreach ($types as $type) {
            if (
                ($type === 'admin' && $user->is_admin) ||
                ($type === 'student' && $user->is_student) ||
                ($type === 'tutor' && $user->is_tutor)
            ) {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }
}
