<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use App\Models\ProductRequest;

class NotificationService
{
    public static function notifyProductRequestSubmitted(ProductRequest $productRequest)
    {
        // Notify all admins about new product request
        $admins = User::where('user_type', 'admin')->get();
        
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'product_request_submitted',
                'title' => 'New Product Request',
                'message' => "New product request '{$productRequest->name}' submitted by {$productRequest->supplier->name}",
                'data' => [
                    'product_request_id' => $productRequest->id,
                    'supplier_name' => $productRequest->supplier->name,
                    'product_name' => $productRequest->name,
                ],
            ]);
        }
    }

    public static function notifyProductRequestReviewed(ProductRequest $productRequest, $status)
    {
        $statusText = $status === 'approved' ? 'approved' : 'rejected';
        $title = $status === 'approved' ? 'Product Approved' : 'Product Rejected';
        
        Notification::create([
            'user_id' => $productRequest->supplier_id,
            'type' => 'product_request_reviewed',
            'title' => $title,
            'message' => "Your product '{$productRequest->name}' has been {$statusText}",
            'data' => [
                'product_request_id' => $productRequest->id,
                'product_name' => $productRequest->name,
                'status' => $status,
                'admin_notes' => $productRequest->admin_notes,
            ],
        ]);
    }

    public static function notifyProductCreated(ProductRequest $productRequest, $productId)
    {
        Notification::create([
            'user_id' => $productRequest->supplier_id,
            'type' => 'product_created',
            'title' => 'Product Now Live',
            'message' => "Your product '{$productRequest->name}' is now available for customers to purchase",
            'data' => [
                'product_request_id' => $productRequest->id,
                'product_id' => $productId,
                'product_name' => $productRequest->name,
            ],
        ]);
    }
}