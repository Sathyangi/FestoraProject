<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\DonationRequest;
use App\Models\PaymentNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class OrganizationController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $organization = $user->organization;
        
        // Initialize stats with default values
        $stats = [
            'total_donations' => 0,
            'pending_requests' => 0,
            'approved_requests' => 0,
            'total_funds_received' => 0,
            'recent_notifications' => 0,
        ];

        $recentNotifications = [];
        
        // Only calculate stats if organization exists
        if ($organization) {
            $stats = [
                'total_donations' => $organization->donationRequests()->count(),
                'pending_requests' => $organization->donationRequests()->where('status', 'pending')->count(),
                'approved_requests' => $organization->donationRequests()->where('status', 'approved')->count(),
                'total_funds_received' => $organization->donationRequests()->where('status', 'approved')->sum('raised_amount') ?? 0,
                'recent_notifications' => $organization->paymentNotifications()->where('is_read', false)->count(),
            ];

            $recentNotifications = $organization->paymentNotifications()
                                  ->with('orderPayment')
                                  ->orderBy('created_at', 'desc')
                                  ->limit(5)
                                  ->get()
                                  ->map(function ($notification) {
                                      return [
                                          'type' => 'donation_received',
                                          'amount' => $notification->orderPayment->amount ?? 0,
                                          'order_id' => $notification->orderPayment->order_id ?? null,
                                          'created_at' => $notification->created_at,
                                      ];
                                  });
        }

        return Inertia::render('Organization/Dashboard', [
            'stats' => $stats,
            'recentNotifications' => $recentNotifications,
            'hasOrganization' => $organization !== null,
            'auth' => [
                'user' => $user,
                'organization' => $organization
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'organization_name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:100|unique:organizations',
            'mission_statement' => 'required|string',
            'website' => 'nullable|url',
            'contact_person' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'contact_address' => 'required|string',
            'organization_type' => 'required|in:charity,ngo,foundation,trust,other',
            'focus_areas' => 'required|array|min:1',
            'focus_areas.*' => 'string|max:100',
        ]);

        // Create organization and associate with user
        $organization = Organization::create(array_merge($request->all(), ['user_id' => auth()->id()]));

        return redirect()->route('organization.dashboard')->with('success', 'Organization registered successfully.');
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->organization) {
            return redirect()->route('organization.dashboard')->with('error', 'No organization found to update.');
        }

        $request->validate([
            'organization_name' => 'required|string|max:255',
            'registration_number' => 'required|string|max:100|unique:organizations,registration_number,' . $user->organization->id,
            'mission_statement' => 'required|string',
            'website' => 'nullable|url',
            'contact_person' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'contact_address' => 'required|string',
            'organization_type' => 'required|in:charity,ngo,foundation,trust,other',
            'focus_areas' => 'required|array|min:1',
            'focus_areas.*' => 'string|max:100',
        ]);

        $user->organization->update($request->all());

        return redirect()->route('organization.dashboard')->with('success', 'Organization details updated successfully.');
    }

    public function donationRequests(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->organization) {
            return redirect()->route('organization.dashboard')->with('error', 'Please register your organization first.');
        }

        $query = $user->organization->donationRequests();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $donationRequests = $query->orderBy('created_at', 'desc')->paginate(12);

        return Inertia::render('Organization/DonationRequests/Index', [
            'donationRequests' => $donationRequests,
            'filters' => $request->only(['status']),
        ]);
    }
  
    public function donatePage()
    {
    $organizations = Organization::where('verification_status', 'verified')->get();
    
    return Inertia::render('Donate', [
        'organizations' => $organizations,
    ]);
   }
    public function createDonationRequest()
    {
        $user = auth()->user();
        
        if (!$user->organization) {
            return redirect()->route('organization.dashboard')->with('error', 'Please register your organization first.');
        }

        return Inertia::render('Organization/DonationRequests/Create');
    }

    public function storeDonationRequest(Request $request)
    {
        $user = auth()->user();
        
        if (!$user->organization) {
            return redirect()->route('organization.dashboard')->with('error', 'Please register your organization first.');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'target_amount' => 'required|numeric|min:1',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'category' => 'required|string|max:100',
        ]);

        DonationRequest::create([
            'organization_id' => $user->organization->id,
            'title' => $request->title,
            'description' => $request->description,
            'target_amount' => $request->target_amount,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'category' => $request->category,
        ]);

        return redirect()->route('organization.donation-requests')->with('success', 'Donation request submitted for review.');
    }

    public function notifications()
    {
        $user = auth()->user();
        
        if (!$user->organization) {
            return redirect()->route('organization.dashboard')->with('error', 'Please register your organization first.');
        }
        
        $notifications = $user->organization->paymentNotifications()
                         ->with('orderPayment')
                         ->orderBy('created_at', 'desc')
                         ->paginate(20);

        // Mark notifications as read
        $user->organization->paymentNotifications()
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return Inertia::render('Organization/Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }
}