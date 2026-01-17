<?php

// app/Http/Controllers/Auth/AuthenticatedSessionController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'email' => session('email'), // Pass email from registration
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = $request->user();

        // Log for debugging
        \Log::info('User logged in:', [
            'id' => $user->id,
            'email' => $user->email,
            'user_type' => $user->user_type,
            'status' => $user->status
        ]);

        // Check if account is active
        if ($user->status !== 'active') {
            Auth::logout();
            
            $message = match($user->status) {
                'pending' => 'Your account is pending approval. Please wait for admin approval.',
                'suspended' => 'Your account has been suspended. Please contact support.',
                'inactive' => 'Your account is inactive. Please contact support.',
                default => 'Your account is not active. Please contact support.'
            };
            
            return redirect()->route('login')
                ->withErrors(['email' => $message]);
        }

        // Create success message
        $welcomeMessage = "Welcome back, {$user->name}!";

        // Redirect based on user type with success message
        return match($user->user_type) {
            'admin' => redirect()->route('admin.dashboard')->with('success', $welcomeMessage),
            'supplier' => redirect()->route('supplier.dashboard')->with('success', $welcomeMessage),
            'organization' => redirect()->route('organization.dashboard')->with('success', $welcomeMessage),
            default => redirect()->route('home')->with('success', $welcomeMessage) // customers go to home
        };
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        if ($user) {
            \Log::info('User logged out:', [
                'id' => $user->id,
                'email' => $user->email,
                'user_type' => $user->user_type
            ]);
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('status', 'You have been successfully logged out.');
    }
}