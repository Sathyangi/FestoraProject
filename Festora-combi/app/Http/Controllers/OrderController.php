<?php

namespace App\Http\Controllers;

use App\Models\OrderPayment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        try {
            Log::info('Order creation request received', ['data' => $request->all()]);

            // Validate request
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'total_amount' => 'required|numeric|min:0',
                'shipping_amount' => 'required|numeric|min:0',
                'currency' => 'required|string|max:3',
                'transaction_id' => 'required|string|unique:order_payments,transaction_id',
                'payment_method' => 'required|string',
                'card_type' => 'nullable|string',
                'customer_name' => 'required|string|max:255',
                'customer_email' => 'required|email|max:255',
                'customer_phone' => 'required|string|max:20',
                'shipping_address' => 'required|string',
                'shipping_city' => 'required|string|max:100',
                'billing_address' => 'nullable|string',
                'order_items' => 'required|array|min:1',
                'order_items.*.product_id' => 'required|exists:products,id',
                'order_items.*.product_name' => 'required|string',
                'order_items.*.quantity' => 'required|integer|min:1',
                'order_items.*.unit_price' => 'required|numeric|min:0',
                'order_items.*.total_price' => 'required|numeric|min:0',
                'order_status' => 'string|in:pending,completed,cancelled,refunded',
            ]);

            Log::info('Validation passed', ['validated' => $validated]);

            // Check user authentication
            if (!Auth::check() || Auth::id() !== $validated['user_id']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Verify stock availability and update quantities
            DB::beginTransaction();

            $stockErrors = [];
            foreach ($validated['order_items'] as $item) {
                $product = Product::find($item['product_id']);
                if (!$product) {
                    $stockErrors[] = "Product {$item['product_name']} not found";
                    continue;
                }

                if ($product->stock_quantity < $item['quantity']) {
                    $stockErrors[] = "Insufficient stock for {$product->name}. Available: {$product->stock_quantity}, Requested: {$item['quantity']}";
                }
            }

            if (!empty($stockErrors)) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Stock validation failed',
                    'errors' => $stockErrors
                ], 400);
            }

            // Update product stock quantities
            foreach ($validated['order_items'] as $item) {
                Product::where('id', $item['product_id'])
                    ->decrement('stock_quantity', $item['quantity']);
            }

            // Generate unique order ID
            $orderId = OrderPayment::generateOrderId();

            // Create order
            $order = OrderPayment::create([
                'user_id' => $validated['user_id'],
                'order_id' => $orderId,
                'total_amount' => $validated['total_amount'],
                'shipping_amount' => $validated['shipping_amount'],
                'currency' => $validated['currency'],
                'transaction_id' => $validated['transaction_id'],
                'payment_method' => $validated['payment_method'],
                'card_type' => $validated['card_type'],
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'shipping_city' => $validated['shipping_city'],
                'billing_address' => $validated['billing_address'],
                'order_items' => $validated['order_items'],
                'order_status' => $validated['order_status'] ?? 'completed',
            ]);

            DB::commit();

            Log::info('Order created successfully', ['order_id' => $order->id]);

            return response()->json([
                'success' => true,
                'message' => 'Order placed successfully',
                'order_id' => $order->order_id,
                'order' => $order
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error in order creation', ['errors' => $e->errors()]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating order', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        $orders = OrderPayment::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }

    public function show($orderId)
    {
        $order = OrderPayment::where('order_id', $orderId)
            ->where('user_id', Auth::id())
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }
}