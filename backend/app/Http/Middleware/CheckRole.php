<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CheckRole
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // $user = Auth::user();
        // if (!$user || !$user->roles()->whereIn('name', $roles)->exists()) {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }
        // return $next($request);

        if (!auth()->check()) {
            Log::info('Authentication failed');
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $user = auth()->user();
        Log::info('Authenticated user ID: ' . $user->id);
        $userRoles = $user->roles()->pluck('name')->toArray();
        Log::info('User roles: ' . json_encode($userRoles));

        foreach ($roles as $role) {
            Log::info('Checking role: ' . $role);
            if (in_array($role, $userRoles)) {
                return $next($request);
            }
        }

        Log::info('Required roles not found: ' . json_encode($roles));
        return response()->json(['message' => 'Unauthorized.'], 403);
    }
}
