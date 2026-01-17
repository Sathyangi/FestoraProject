<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_id',
        'total_amount',
        'shipping_amount',
        'currency',
        'transaction_id',
        'payment_method',
        'card_type',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'shipping_city',
        'billing_address',
        'order_items',
        'order_status',
    ];

    protected $casts = [
        'order_items' => 'array',
        'total_amount' => 'decimal:2',
        'shipping_amount' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function paymentNotifications()
    {
        return $this->hasMany(PaymentNotification::class);
    }
    // Generate unique order ID
    public static function generateOrderId()
    {
        do {
            $orderId = 'ORD-' . strtoupper(uniqid());
        } while (self::where('order_id', $orderId)->exists());

        return $orderId;
    }
}