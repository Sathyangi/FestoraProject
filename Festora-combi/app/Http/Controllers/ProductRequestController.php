<?php

namespace App\Http\Controllers;

use App\Models\ProductRequest;
use App\Models\Product;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProductRequestController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of product requests for suppliers
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        if ($user->role === 'admin') {
            // Admin can see all product requests
            $query = ProductRequest::with(['supplier', 'reviewer'])
                ->orderBy('created_at', 'desc');
        } else {
            // Suppliers can only see their own requests
            $query = ProductRequest::where('supplier_id', $user->id)
                ->with(['reviewer'])
                ->orderBy('created_at', 'desc');
        }

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $requests = $query->paginate(15)->withQueryString();

        // Add media URLs to each request
        $requests->getCollection()->transform(function ($productRequest) {
            $productRequest->images = $productRequest->getMedia('images')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'name' => $media->name,
                ];
            });
            return $productRequest;
        });

        return Inertia::render('ProductRequests/Index', [
            'requests' => $requests,
            'filters' => $request->only(['status', 'category', 'search']),
            'categories' => $this->getCategories(),
            'statuses' => ['pending', 'approved', 'rejected']
        ]);
    }

    /**
     * Show the form for creating a new product request
     */
    public function create()
    {
        return Inertia::render('ProductRequests/Create', [
            'categories' => $this->getCategories()
        ]);
    }

    /**
     * Store a newly created product request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category' => 'required|string|max:255',
            'is_available' => 'boolean',
            'cultural_context' => 'nullable|string|max:255',
            'sku' => 'nullable|string|max:100|unique:product_requests,sku',
            'tags' => 'nullable|json',
            'specifications' => 'nullable|json',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        try {
            DB::beginTransaction();

            // Create the product request
            $productRequest = ProductRequest::create([
                'supplier_id' => Auth::id(),
                'name' => $validated['name'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'stock_quantity' => $validated['stock_quantity'],
                'category' => $validated['category'],
                'is_available' => $validated['is_available'] ?? true,
                'cultural_context' => $validated['cultural_context'],
                'sku' => $validated['sku'],
                'tags' => $validated['tags'] ? json_decode($validated['tags'], true) : null,
                'specifications' => $validated['specifications'] ? json_decode($validated['specifications'], true) : null,
                'status' => 'pending'
            ]);

            // Handle image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $productRequest->addMediaFromRequest('images')
                        ->each(function ($fileAdder) {
                            $fileAdder->toMediaCollection('images');
                        });
                }
            }

            // Notify admins about new product request
            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                $this->notificationService->createNotification(
                    $admin->id,
                    'product_request_submitted',
                    'New Product Request',
                    "A new product request '{$productRequest->name}' has been submitted by " . Auth::user()->name,
                    [
                        'product_request_id' => $productRequest->id,
                        'supplier_name' => Auth::user()->name,
                        'product_name' => $productRequest->name
                    ]
                );
            }

            DB::commit();

            return redirect()->route('supplier.product-requests')
                ->with('success', 'Product request submitted successfully! It will be reviewed by an admin.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['general' => 'Failed to submit product request. Please try again.']);
        }
    }

    /**
     * Display the specified product request
     */
    public function show(ProductRequest $productRequest)
    {
        // Check authorization
        if (Auth::user()->role !== 'admin' && $productRequest->supplier_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this product request.');
        }

        $productRequest->load(['supplier', 'reviewer']);
        
        // Add media URLs
        $productRequest->images = $productRequest->getMedia('images')->map(function ($media) {
            return [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'name' => $media->name,
            ];
        });

        return Inertia::render('ProductRequests/Show', [
            'productRequest' => $productRequest
        ]);
    }

    /**
     * Show the form for editing the specified product request
     */
    public function edit(ProductRequest $productRequest)
    {
        // Only allow editing if request is pending and user is the supplier
        if ($productRequest->status !== 'pending' || $productRequest->supplier_id !== Auth::id()) {
            abort(403, 'Cannot edit this product request.');
        }

        // Add media URLs
        $productRequest->images = $productRequest->getMedia('images')->map(function ($media) {
            return [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'name' => $media->name,
            ];
        });

        return Inertia::render('ProductRequests/Edit', [
            'productRequest' => $productRequest,
            'categories' => $this->getCategories()
        ]);
    }

    /**
     * Update the specified product request
     */
    public function update(Request $request, ProductRequest $productRequest)
    {
        // Only allow updating if request is pending and user is the supplier
        if ($productRequest->status !== 'pending' || $productRequest->supplier_id !== Auth::id()) {
            abort(403, 'Cannot update this product request.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category' => 'required|string|max:255',
            'is_available' => 'boolean',
            'cultural_context' => 'nullable|string|max:255',
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('product_requests', 'sku')->ignore($productRequest->id)
            ],
            'tags' => 'nullable|json',
            'specifications' => 'nullable|json',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'remove_images' => 'nullable|array',
            'remove_images.*' => 'integer|exists:media,id'
        ]);

        try {
            DB::beginTransaction();

            // Update the product request
            $productRequest->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'stock_quantity' => $validated['stock_quantity'],
                'category' => $validated['category'],
                'is_available' => $validated['is_available'] ?? true,
                'cultural_context' => $validated['cultural_context'],
                'sku' => $validated['sku'],
                'tags' => $validated['tags'] ? json_decode($validated['tags'], true) : null,
                'specifications' => $validated['specifications'] ? json_decode($validated['specifications'], true) : null,
            ]);

            // Handle image removal
            if ($request->filled('remove_images')) {
                foreach ($request->remove_images as $mediaId) {
                    $media = $productRequest->getMedia('images')->where('id', $mediaId)->first();
                    if ($media) {
                        $media->delete();
                    }
                }
            }

            // Handle new image uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $productRequest->addMedia($image)->toMediaCollection('images');
                }
            }

            DB::commit();

            return redirect()->route('supplier.product-requests')
                ->with('success', 'Product request updated successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['general' => 'Failed to update product request. Please try again.']);
        }
    }

    /**
     * Remove the specified product request
     */
    public function destroy(ProductRequest $productRequest)
    {
        // Only allow deletion if request is pending and user is the supplier
        if ($productRequest->status !== 'pending' || $productRequest->supplier_id !== Auth::id()) {
            abort(403, 'Cannot delete this product request.');
        }

        try {
            DB::beginTransaction();

            // Delete associated media
            $productRequest->clearMediaCollection('images');
            
            // Delete the product request
            $productRequest->delete();

            DB::commit();

            return redirect()->route('supplier.product-requests')
                ->with('success', 'Product request deleted successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['general' => 'Failed to delete product request. Please try again.']);
        }
    }

    /**
     * Admin method to approve a product request
     */
    public function approve(Request $request, ProductRequest $productRequest)
    {
        // Only admins can approve
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        if ($productRequest->status !== 'pending') {
            return back()->withErrors(['general' => 'This product request has already been reviewed.']);
        }

        $validated = $request->validate([
            'admin_notes' => 'nullable|string|max:1000'
        ]);

        try {
            DB::beginTransaction();

            // Update product request status
            $productRequest->update([
                'status' => 'approved',
                'admin_notes' => $validated['admin_notes'],
                'reviewed_at' => now(),
                'reviewed_by' => Auth::id()
            ]);

            // Create the actual product from the approved request
            $product = Product::create([
                'supplier_id' => $productRequest->supplier_id,
                'name' => $productRequest->name,
                'description' => $productRequest->description,
                'price' => $productRequest->price,
                'stock_quantity' => $productRequest->stock_quantity,
                'category' => $productRequest->category,
                'is_available' => $productRequest->is_available,
                'cultural_context' => $productRequest->cultural_context,
                'sku' => $productRequest->sku,
                'tags' => $productRequest->tags,
                'specifications' => $productRequest->specifications,
            ]);

            // Copy images from product request to product
            foreach ($productRequest->getMedia('images') as $media) {
                $product->addMediaFromUrl($media->getUrl())
                    ->toMediaCollection('images');
            }

            // Notify supplier about approval
            $this->notificationService->createNotification(
                $productRequest->supplier_id,
                'product_approved',
                'Product Approved',
                "Your product '{$productRequest->name}' has been approved and is now available for sale!",
                [
                    'product_id' => $product->id,
                    'product_request_id' => $productRequest->id,
                    'product_name' => $productRequest->name,
                    'admin_notes' => $validated['admin_notes']
                ]
            );

            DB::commit();

            return back()->with('success', 'Product request approved successfully! The product is now available for sale.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['general' => 'Failed to approve product request. Please try again.']);
        }
    }

    /**
     * Admin method to reject a product request
     */
    public function reject(Request $request, ProductRequest $productRequest)
    {
        // Only admins can reject
        if (Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        if ($productRequest->status !== 'pending') {
            return back()->withErrors(['general' => 'This product request has already been reviewed.']);
        }

        $validated = $request->validate([
            'admin_notes' => 'required|string|max:1000'
        ]);

        try {
            DB::beginTransaction();

            // Update product request status
            $productRequest->update([
                'status' => 'rejected',
                'admin_notes' => $validated['admin_notes'],
                'reviewed_at' => now(),
                'reviewed_by' => Auth::id()
            ]);

            // Notify supplier about rejection
            $this->notificationService->createNotification(
                $productRequest->supplier_id,
                'product_rejected',
                'Product Request Rejected',
                "Your product request '{$productRequest->name}' has been rejected. Please review the admin notes and resubmit if needed.",
                [
                    'product_request_id' => $productRequest->id,
                    'product_name' => $productRequest->name,
                    'admin_notes' => $validated['admin_notes']
                ]
            );

            DB::commit();

            return back()->with('success', 'Product request rejected. The supplier has been notified.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['general' => 'Failed to reject product request. Please try again.']);
        }
    }

    /**
     * Get available categories
     */
    private function getCategories()
    {
        return [
            'Fruits', 'Vegetables', 'Meat', 'Dairy', 'Bakery', 'Grains', 
            'Canned Goods', 'Beverages', 'Snacks', 'Spices', 'Seafood',
            'Organic Products', 'Traditional Foods', 'Other'
        ];
    }
}