<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\ProductRequest;
use App\Models\DonationRequest;
use App\Models\Donation;
use App\Models\OrderPayment;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_suppliers' => User::where('user_type', 'supplier')->count(),
            'total_organizations' => User::where('user_type', 'organization')->count(),
            'total_products' => Product::count(),
            'pending_product_requests' => ProductRequest::where('status', 'pending')->count(),
            'total_donations' => Donation::count(),
            'total_donation_amount' => Donation::sum('amount'),
            'total_revenue' => OrderPayment::where('order_status', 'completed')->sum('total_amount'),
            'monthly_orders' => OrderPayment::whereMonth('created_at', Carbon::now()->month)->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
        ]);
    }

    public function users(Request $request)
    {
        $query = User::query();

        // Simple filters
        if ($request->filled('user_type')) {
            $query->where('user_type', $request->user_type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->paginate(15);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only(['user_type', 'status', 'search'])
        ]);
    }

    public function updateUserStatus(Request $request, User $user)
    {
        $request->validate([
            'status' => 'required|in:active,inactive,suspended',
        ]);

        $user->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'User status updated successfully.');
    }

    public function productRequests(Request $request)
    {
        $query = ProductRequest::with(['supplier', 'reviewer', 'media']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhereHas('supplier', function($q) use ($request) {
                      $q->where('name', 'like', '%' . $request->search . '%');
                  });
        }

        $requests = $query->orderBy('created_at', 'desc')->paginate(15);

        // Transform the data to include images
        $requests->getCollection()->transform(function ($request) {
            $images = $request->getMedia('images')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'path' => $media->getUrl(),
                    'thumb' => $media->getUrl('thumb'),
                ];
            });

            $request->images = $images;
            return $request;
        });

        return Inertia::render('Admin/ProductRequests/Index', [
            'requests' => $requests,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function reviewProductRequest(Request $request, ProductRequest $productRequest)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        // Update the product request
        $productRequest->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        // If approved, create the actual product
        if ($request->status === 'approved') {
            $product = Product::create([
                'supplier_id' => $productRequest->supplier_id,
                'name' => $productRequest->name,
                'category' => $productRequest->category,
                'price' => $productRequest->price,
                'description' => $productRequest->description,
                'stock_quantity' => $productRequest->stock_quantity,
                'is_active' => $productRequest->is_available,
                'approval_status' => 'approved',
                'image_url' => null, // Will be handled by media
                'tags' => $productRequest->tags,
                'cultural_context' => $productRequest->cultural_context,
                'sku' => $productRequest->sku ?? 'SKU-' . uniqid(),
                'specifications' => $productRequest->specifications,
            ]);

            // Copy images from product request to product
            $productRequest->getMedia('images')->each(function ($media) use ($product) {
                $product->addMediaFromUrl($media->getUrl())
                        ->toMediaCollection('images');
            });

            // Notify supplier about product being created
            NotificationService::notifyProductCreated($productRequest, $product->id);
        }

        // Always notify supplier about the review
        NotificationService::notifyProductRequestReviewed($productRequest, $request->status);

        return redirect()->back()->with('success', 
            $request->status === 'approved' 
                ? 'Product request approved and product created successfully.' 
                : 'Product request rejected successfully.'
        );
    }

    public function donationRequests(Request $request)
    {
        $query = DonationRequest::with(['organization', 'reviewer']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $requests = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/DonationRequests/Index', [
            'requests' => $requests,
            'filters' => $request->only(['status']),
        ]);
    }

    public function reviewDonationRequest(Request $request, DonationRequest $donationRequest)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $donationRequest->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Donation request reviewed successfully.');
    }
}