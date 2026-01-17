<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Organization extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'organization_name',
        'registration_number',
        'mission_statement',
        'website',
        'contact_person',
        'contact_phone',
        'contact_address',
        'organization_type',
        'focus_areas',
        'total_raised',
        'active_campaigns',
        'verification_status',
        'verified_at',
    ];

    protected $casts = [
        'focus_areas' => 'array',
        'total_raised' => 'decimal:2',
        'verified_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Add donation requests relationship
    public function donationRequests(): HasMany
    {
        return $this->hasMany(DonationRequest::class, 'organization_id');
    }

    // Add payment notifications relationship
    public function paymentNotifications(): HasMany
    {
        return $this->hasMany(PaymentNotification::class, 'organization_id');
    }
}