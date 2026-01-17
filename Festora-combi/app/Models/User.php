<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Traits\HasRoles;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class User extends Authenticatable implements HasMedia
{
    use HasFactory, Notifiable, HasRoles, InteractsWithMedia;

    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type',
        'description',
        'phone',
        'address',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'supplier_id');
    }

    public function productRequests()
    {
        return $this->hasMany(ProductRequest::class, 'supplier_id');
    }
public function notifications()
{
    return $this->hasMany(Notification::class);
}

    public function donationRequests()
    {
        return $this->hasMany(DonationRequest::class, 'organization_id');
    }

    public function organization()
    {
        return $this->hasOne(Organization::class);
    }

    public function orderPayments()
    {
        return $this->hasMany(OrderPayment::class);
    }

    public function paymentNotifications()
    {
        return $this->hasMany(PaymentNotification::class, 'supplier_id')
                ->orWhere('organization_id', $this->id);
    }

    // Helper methods
    public function isAdmin()
    {
        return $this->user_type === 'admin';
    }

    public function isSupplier()
    {
        return $this->user_type === 'supplier';
    }

    public function isOrganization()
    {
        return $this->user_type === 'organization';
    }

    public function isCustomer()
    {
        return $this->user_type === 'customer';
    }
}