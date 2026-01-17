<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;

class ProductController extends Controller
{
    /**
     * Display a listing of products
     */
    public function index(Request $request)
    {
        // FIXED: Changed from Product::active() to Product::query()
        // If you need active products, add ->where('is_active', true) or similar
        $query = Product::query()->with('supplier');
        
        // Get filter values with defaults
        $categoryFilter = $request->input('category', 'All');
        $availabilityFilter = $request->input('availability', 'All');
        $searchFilter = $request->input('search', '');
        $culturalContextFilter = $request->input('cultural_context', '');
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');
        
        // Apply search filter
        if ($request->filled('search') && !empty($searchFilter)) {
            $query->where(function($q) use ($searchFilter) {
                $q->where('name', 'LIKE', "%{$searchFilter}%")
                  ->orWhere('description', 'LIKE', "%{$searchFilter}%")
                  ->orWhere('category', 'LIKE', "%{$searchFilter}%");
            });
        }
        
        // Apply category filter
        if ($request->filled('category') && $categoryFilter && $categoryFilter !== 'All') {
            $query->where('category', $categoryFilter);
        }
        
        // Apply cultural context filter
        if ($request->filled('cultural_context') && !empty($culturalContextFilter)) {
            $query->where('cultural_context', $culturalContextFilter);
        }
        
        // Apply price range filters
        if ($request->filled('min_price') && $minPrice) {
            $query->where('price', '>=', $minPrice);
        }
        
        if ($request->filled('max_price') && $maxPrice) {
            $query->where('price', '<=', $maxPrice);
        }
        
        // Apply availability filter
        if ($availabilityFilter && $availabilityFilter !== 'All') {
            switch ($availabilityFilter) {
                case 'In Stock':
                    $query->where('stock_quantity', '>', 10);
                    break;
                case 'Low Stock':
                    $query->whereBetween('stock_quantity', [1, 10]);
                    break;
                case 'Out of Stock':
                    $query->where('stock_quantity', 0);
                    break;
            }
        }
        
        // Get products with pagination and ordering
        $products = $query->orderBy('created_at', 'desc')->paginate(12);
        
        // FIXED: Changed from Product::active() to Product::query()
        $categories = Product::query()
            ->distinct()
            ->whereNotNull('category')
            ->orderBy('category')
            ->pluck('category')
            ->toArray();
            
        $culturalContexts = Product::query()
            ->distinct()
            ->whereNotNull('cultural_context')
            ->orderBy('cultural_context')
            ->pluck('cultural_context')
            ->toArray();
        
        // Transform products data
        $transformedProducts = $products->getCollection()->map(function($product) {
            return [
                'id' => $product->id,
                'name' => $product->name ?? 'Unnamed Product',
                'category' => $product->category ?? 'Uncategorized',
                'cultural_context' => $product->cultural_context ?? null,
                'price' => $product->price ?? 0,
                'stock_quantity' => $product->stock_quantity ?? 0,
                'description' => $product->description ?? '',
                'image_url' => $product->image_url ?? null,
                'supplier' => $product->supplier ?? null,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ];
        });
        
        // Replace the collection in the paginator
        $products->setCollection($transformedProducts);
        
        // FIXED: Simplified the products data - pass the items directly instead of paginator object
        return Inertia::render('Products', [
            'products' => $transformedProducts->toArray(), // Convert to array
            'categories' => $categories,
            'culturalContexts' => $culturalContexts,
            'filters' => [
                'category' => $categoryFilter,
                'availability' => $availabilityFilter,
                'search' => $searchFilter,
                'cultural_context' => $culturalContextFilter,
                'min_price' => $minPrice,
                'max_price' => $maxPrice,
            ],
            'totalProducts' => Product::count(), // FIXED: Changed from Product::active()->count()
            // Add authentication data for cart functionality
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
    
    /**
     * Show a specific product
     */
    public function show($id)
    {
        // FIXED: Changed from Product::active() to Product::query()
        $product = Product::query()->with('supplier')->findOrFail($id);
        
        // Get related products from the same category
        $relatedProducts = Product::query()
            ->where('category', $product->category)
            ->where('id', '!=', $product->id)
            ->limit(4)
            ->get();
        
        return Inertia::render('Products/Show', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name ?? 'Unnamed Product',
                'category' => $product->category ?? 'Uncategorized',
                'cultural_context' => $product->cultural_context ?? null,
                'price' => $product->price ?? 0,
                'stock_quantity' => $product->stock_quantity ?? 0,
                'description' => $product->description ?? '',
                'image_url' => $product->image_url ?? null,
                'supplier' => $product->supplier ?? null,
                'created_at' => $product->created_at,
                'updated_at' => $product->updated_at,
            ],
            'relatedProducts' => $relatedProducts,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    /**
     * Handle checkout process
     */
    public function checkout(Request $request)
    {
        $cart = $request->input('cart', []);
        
        if (empty($cart)) {
            return redirect()->route('products.index')
                ->with('error', 'Your cart is empty');
        }

        // Validate cart items exist and have sufficient stock
        $validatedCart = [];
        $errors = [];

        foreach ($cart as $item) {
            // Validate required cart item fields
            if (!isset($item['id']) || !isset($item['quantity'])) {
                $errors[] = "Invalid cart item structure";
                continue;
            }

            // FIXED: Changed from Product::active() to Product::query()
            $product = Product::query()->find($item['id']);
            
            if (!$product) {
                $errors[] = "Product with ID {$item['id']} not found";
                continue;
            }

            if ($product->stock_quantity < $item['quantity']) {
                $errors[] = "Insufficient stock for {$product->name}. Available: {$product->stock_quantity}, Requested: {$item['quantity']}";
                continue;
            }

            if ($item['quantity'] <= 0) {
                $errors[] = "Invalid quantity for {$product->name}";
                continue;
            }

            $validatedCart[] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => (int)$item['quantity'],
                'stock_quantity' => $product->stock_quantity,
                'image_url' => $product->image_url,
                'category' => $product->category,
                'cultural_context' => $product->cultural_context,
            ];
        }

        // If there are validation errors, redirect back with errors
        if (!empty($errors)) {
            return redirect()->route('products.index')
                ->withErrors($errors)
                ->with('error', 'There were issues with some items in your cart');
        }

        // If no valid items after validation
        if (empty($validatedCart)) {
            return redirect()->route('products.index')
                ->with('error', 'No valid items found in your cart');
        }

        return Inertia::render('Checkout', [
            'cart' => $validatedCart,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    /**
     * Get product by ID for cart validation
     */
    public function getProduct($id)
    {
        // FIXED: Changed from Product::active() to Product::query()
        $product = Product::query()->find($id);
        
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'stock_quantity' => $product->stock_quantity,
                'category' => $product->category,
                'cultural_context' => $product->cultural_context,
                'image_url' => $product->image_url,
                'supplier' => $product->supplier,
            ]
        ]);
    }

    /**
     * Validate cart items (AJAX endpoint)
     */
    public function validateCart(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $validatedItems = [];
        $errors = [];

        foreach ($request->items as $item) {
            // FIXED: Changed from Product::active() to Product::query()
            $product = Product::query()->find($item['id']);
            
            if (!$product) {
                $errors[] = "Product with ID {$item['id']} not found";
                continue;
            }

            if ($product->stock_quantity < $item['quantity']) {
                $errors[] = "Insufficient stock for {$product->name}. Available: {$product->stock_quantity}";
                continue;
            }

            $validatedItems[] = [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => (int)$item['quantity'],
                'stock_quantity' => $product->stock_quantity,
                'max_quantity' => $product->stock_quantity,
                'subtotal' => $product->price * $item['quantity'],
            ];
        }

        return response()->json([
            'valid' => empty($errors),
            'success' => empty($errors),
            'items' => $validatedItems,
            'errors' => $errors
        ]);
    }

    /**
     * Get cart summary
     */
    public function getCartSummary(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $subtotal = 0;
        $itemCount = 0;
        $validItems = [];

        foreach ($request->items as $item) {
            // FIXED: Changed from Product::active() to Product::query()
            $product = Product::query()->find($item['id']);
            
            if ($product && $product->stock_quantity >= $item['quantity']) {
                $itemTotal = $product->price * $item['quantity'];
                $subtotal += $itemTotal;
                $itemCount += $item['quantity'];
                
                $validItems[] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'quantity' => (int)$item['quantity'],
                    'subtotal' => $itemTotal,
                    'total' => $itemTotal // For backward compatibility
                ];
            }
        }

        // Calculate shipping using the private method
        $shipping = $this->calculateShipping($subtotal);
        $total = $subtotal + $shipping;

        return response()->json([
            'success' => true,
            'items' => $validItems,
            'summary' => [
                'items' => $validItems,
                'item_count' => $itemCount,
                'subtotal' => $subtotal,
                'shipping' => $shipping,
                'total' => $total,
                'currency' => 'LKR',
                'free_shipping_threshold' => 5000,
                'free_shipping_eligible' => $subtotal >= 5000
            ],
            // For backward compatibility
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'total' => $total,
        ]);
    }

    /**
     * Calculate shipping cost based on subtotal
     */
    private function calculateShipping($subtotal)
    {
        // Free shipping over LKR 5000 (updated from 10000 in original)
        if ($subtotal >= 5000) {
            return 0;
        }
        return 500; // LKR 500 shipping fee
    }
}