<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DonationController extends Controller
{
    public function index()
    {
        return Inertia::render('Donate', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Log the incoming request for debugging
            Log::info('Donation request received:', $request->all());

            // Validate the request
            $validated = $request->validate([
                'organization_id' => 'required|string',
                'organization_name' => 'required|string',
                'amount' => 'required|numeric|min:1',
                'currency' => 'required|string|max:3',
                'transaction_id' => 'required|string|unique:donations,transaction_id',
                'payment_method' => 'string',
                'card_type' => 'nullable|string',
                'donor_name' => 'required|string',
            ]);

            Log::info('Validation passed for donation');

            // Check if user is authenticated
            if (!Auth::check()) {
                Log::error('User not authenticated for donation');
                return response()->json([
                    'success' => false,
                    'message' => 'User not authenticated'
                ], 401);
            }

            // Create the donation
            $donation = Donation::create([
                'user_id' => Auth::id(),
                'organization_id' => $validated['organization_id'],
                'organization_name' => $validated['organization_name'],
                'amount' => $validated['amount'],
                'currency' => $validated['currency'],
                'transaction_id' => $validated['transaction_id'],
                'payment_method' => $validated['payment_method'] ?? 'card',
                'card_type' => $validated['card_type'],
                'donor_name' => $validated['donor_name'],
                'status' => 'completed',
                'donated_at' => now(),
            ]);

            Log::info('Donation created successfully:', ['id' => $donation->id]);

            return response()->json([
                'success' => true,
                'donation' => $donation,
                'message' => 'Donation recorded successfully!'
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed for donation:', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error during donation:', ['error' => $e->getMessage()]);
            
            // Check if it's a duplicate transaction ID error
            if ($e->getCode() == 23000) {
                return response()->json([
                    'success' => false,
                    'message' => 'This transaction has already been processed'
                ], 409);
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Database error occurred'
            ], 500);

        } catch (\Exception $e) {
            Log::error('Unexpected error during donation:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred'
            ], 500);
        }
    }
    
    public function getUserDonations()
    {
        try {
            $donations = Auth::user()->donations()->latest()->get();
            
            return response()->json([
                'success' => true,
                'donations' => $donations
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching user donations:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch donations'
            ], 500);
        }
    }
}