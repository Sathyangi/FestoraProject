<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'organization_id',
        'organization_name',
        'amount',
        'currency',
        'transaction_id',
        'payment_method',
        'card_type',
        'donor_name',
        'status',
        'donated_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'donated_at' => 'datetime',
    ];

    /**
     * Get the user that made the donation.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}