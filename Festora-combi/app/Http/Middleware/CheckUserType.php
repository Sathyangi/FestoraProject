<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserType
{
    public function handle(Request $request, Closure $next, ...$types)
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $userType = auth()->user()->user_type;
        
        if (!in_array($userType, $types)) {
            abort(403, 'Unauthorized access');
        }

        // Check if account is active
        if (auth()->user()->status !== 'active') {
            auth()->logout();
            return redirect()->route('login')
                ->withErrors(['email' => 'Your account is not active. Please contact support.']);
        }

        return $next($request);
    }
}
