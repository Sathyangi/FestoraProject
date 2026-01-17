<?php
namespace App\Http\Controllers;

use App\Models\ProductRequest;
use App\Models\Product;
use App\Models\PaymentNotification;
use App\Models\Notification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SupplierController extends Controller
{
    public function dashboard()
    {
        $supplier = auth()->user();
        
        $stats = [
            'total_products' => $supplier->products()->count(),
            'pending_requests' => $supplier->productRequests()->where('status', 'pending')->count(),
            'approved_products' => $supplier->products()->where('approval_status', 'approved')->count(),
            'total_sales' => PaymentNotification::where('supplier_id', $supplier->id)->sum('amount'),
            'recent_sales' => PaymentNotification::where('supplier_id', $supplier->id)
                                ->where('is_read', false)
                                ->count(),
        ];

        $recentNotifications = Notification::where('user_id', $supplier->id)
                                 ->orderBy('created_at', 'desc')
                                 ->limit(5)
                                 ->get()
                                 ->map(function($notification) {
                                     return [
                                         'id' => $notification->id,
                                         'type' => $notification->type,
                                         'title' => $notification->title,
                                         'message' => $notification->message,
                                         'data' => $notification->data,
                                         'is_read' => $notification->is_read,
                                         'created_at' => $notification->created_at,
                                     ];
                                 });

        $pendingProductsCount = $supplier->productRequests()->where('status', 'pending')->count();

        return Inertia::render('Supplier/Dashboard', [
            'stats' => $stats,
            'recentNotifications' => $recentNotifications,
            'pendingProductsCount' => $pendingProductsCount,
        ]);
    }

    public function products(Request $request)
    {
        $supplier = auth()->user();
        $query = $supplier->products()->with('media');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(12);

        // Transform products to include images
        $products->getCollection()->transform(function ($product) {
            $images = $product->getMedia('images')->map(function ($media) {
                return [
                    'id' => $media->id,
                    'path' => $media->getUrl(),
                    'thumb' => $media->getUrl('thumb'),
                ];
            });
            $product->images = $images;
            return $product;
        });

        return Inertia::render('Supplier/Products/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function createProduct()
    {
        return Inertia::render('Supplier/Products/Create');
    }

   public function storeProduct(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'required|string',
        'price' => 'required|numeric|min:0',
        'stock_quantity' => 'required|integer|min:0',
        'category' => 'required|string|max:100',
        'is_available' => 'boolean',
        'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
    ]);

    try {
        // Create product request instead of direct product
        $productRequest = ProductRequest::create([
            'supplier_id' => auth()->id(),
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'category' => $request->category,
            'is_available' => $request->is_available ?? true,
            'status' => 'pending', // Ensure status is set to pending
        ]);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $productRequest->addMedia($image)->toMediaCollection('images');
            }
        }

        // Notify admins about the new product request
        NotificationService::notifyProductRequestSubmitted($productRequest);

        return redirect()->route('supplier.product-requests')
            ->with('success', 'Product submitted for approval. You will be notified once it has been reviewed.');

    } catch (\Exception $e) {
        return redirect()->back()
            ->with('error', 'Failed to submit product request: ' . $e->getMessage())
            ->withInput();
    }
}

    public function editProduct(Product $product)
    {
        // Ensure supplier owns this product
        if ($product->supplier_id !== auth()->id()) {
            abort(403);
        }

        // Load images for the product
        $images = $product->getMedia('images')->map(function ($media) {
            return [
                'id' => $media->id,
                'path' => $media->getUrl(),
                'thumb' => $media->getUrl('thumb'),
            ];
        });

        $product->images = $images;

        return Inertia::render('Supplier/Products/Edit', [
            'product' => $product,
        ]);
    }

    public function updateProduct(Request $request, Product $product)
    {
        // Ensure supplier owns this product
        if ($product->supplier_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category' => 'required|string|max:100',
            'is_available' => 'boolean',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'remove_images' => 'nullable|array',
        ]);

        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock_quantity' => $request->stock_quantity,
            'category' => $request->category,
            'is_active' => $request->is_available ?? true,
        ]);

        // Handle image removal
        if ($request->has('remove_images')) {
            foreach ($request->remove_images as $mediaId) {
                $media = $product->media()->find($mediaId);
                if ($media) {
                    $media->delete();
                }
            }
        }

        // Handle new image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $product->addMedia($image)->toMediaCollection('images');
            }
        }

        return redirect()->route('supplier.products')->with('success', 'Product updated successfully.');
    }

    public function deleteProduct(Product $product)
    {
        // Ensure supplier owns this product
        if ($product->supplier_id !== auth()->id()) {
            abort(403);
        }

        // Delete associated media
        $product->clearMediaCollection('images');
        
        // Delete the product
        $product->delete();

        return redirect()->route('supplier.products')->with('success', 'Product deleted successfully.');
    }

    public function productRequests(Request $request)
    {
        $supplier = auth()->user();
        $query = $supplier->productRequests()->with(['reviewer', 'media']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $requests = $query->orderBy('created_at', 'desc')->paginate(15);

        // Transform requests to include images
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

        return Inertia::render('Supplier/ProductRequests/Index', [
            'requests' => $requests,
            'filters' => $request->only(['status']),
        ]);
    }

    public function notifications()
    {
        $supplier = auth()->user();
        $notifications = Notification::where('user_id', $supplier->id)
                                 ->orderBy('created_at', 'desc')
                                 ->paginate(15);

        // Mark as read
        Notification::where('user_id', $supplier->id)
                   ->where('is_read', false)
                   ->update(['is_read' => true]);

        return Inertia::render('Supplier/Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }
}