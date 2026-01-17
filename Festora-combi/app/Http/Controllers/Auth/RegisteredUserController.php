<?php
// app/Http/Controllers/Auth/RegisteredUserController.php 

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Organization;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Basic validation rules for all users
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'user_type' => 'required|in:customer,supplier,organization',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'description' => 'nullable|string|max:1000',
        ];

        // Add supplier-specific validation
        if ($request->user_type === 'supplier') {
            $rules['phone'] = 'required|string|max:20';
            $rules['address'] = 'required|string|max:500';
        }

        $validatedData = $request->validate($rules);

        // Log registration attempt
        \Log::info('Registration attempt:', [
            'email' => $validatedData['email'],
            'user_type' => $validatedData['user_type']
        ]);

        try {
            DB::beginTransaction();

            // Create user with appropriate status
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'user_type' => $validatedData['user_type'],
                'phone' => $validatedData['phone'] ?? null,
                'address' => $validatedData['address'] ?? null,
                'description' => $validatedData['description'] ?? null,
                'status' => $validatedData['user_type'] === 'organization' ? 'pending' : 'active',
            ]);

            // For organizations, we'll create a basic organization record
            // The detailed organization info can be filled later in the dashboard
            if ($validatedData['user_type'] === 'organization') {
                Organization::create([
                    'user_id' => $user->id,
                    'organization_name' => $validatedData['name'], // Use user's name as initial org name
                    'registration_number' => 'TEMP-' . time(), // Temporary registration number
                    'mission_statement' => $validatedData['description'] ?? 'Mission statement to be updated',
                    'contact_person' => $validatedData['name'], // Use user's name as contact person
                    'contact_phone' => $validatedData['phone'] ?? 'To be updated',
                    'contact_address' => $validatedData['address'] ?? 'To be updated',
                    'organization_type' => 'other', // Default type
                    'focus_areas' => ['Other'], // Default focus area
                ]);
            }

            DB::commit();

            event(new Registered($user));

            // Log successful registration
            \Log::info('User registered successfully:', [
                'id' => $user->id,
                'email' => $user->email,
                'user_type' => $user->user_type,
                'status' => $user->status
            ]);

            // Set appropriate message and redirect data based on user type
            $message = match($validatedData['user_type']) {
                'organization' => 'Organization account created successfully! Please complete your organization details in the dashboard.',
                'supplier' => 'Supplier registration successful! Please log in to access your dashboard.',
                default => 'Registration successful! Please log in to continue.'
            };

            // Redirect to login with status message and pre-filled email
            return redirect()->route('login')
                ->with('status', $message)
                ->with('email', $validatedData['email']);

        } catch (\Exception $e) {
            DB::rollback();
            
            \Log::error('Registration failed:', [
                'email' => $validatedData['email'],
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->back()
                ->withInput()
                ->withErrors(['email' => 'Registration failed. Please try again. Error: ' . $e->getMessage()]);
        }
    }
}