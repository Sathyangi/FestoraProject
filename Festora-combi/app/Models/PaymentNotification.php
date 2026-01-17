<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentNotification extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_payment_id',
        'supplier_id',
        'organization_id',
        'amount',
        'notification_type',
        'is_read',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'is_read' => 'boolean',
        'metadata' => 'array',
    ];

    public function orderPayment()
    {
        return $this->belongsTo(OrderPayment::class);
    }

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    public function organization()
    {
        return $this->belongsTo(User::class, 'organization_id');
    }
}
