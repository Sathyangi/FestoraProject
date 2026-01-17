<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'supplier_id',
        'name',
        'category',
        'price',
        'image_url',
        'tags',
        'cultural_context',
        'description',
        'stock_quantity',
        'is_active',
        'sku',
        'specifications',
        'approval_status',
    ];

    protected $casts = [
        'tags' => 'array',
        'specifications' => 'array',
        'price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Define relationship with supplier (User model)
     */
    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    /**
     * Register media collections for product images
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
    }

    /**
     * Register media conversions for image optimization
     */
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->sharpen(10);
    }

    /**
     * Scope to get only active and approved products
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->where('approval_status', 'approved');
    }

    /**
     * Scope to get products by category
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to get products by cultural context
     */
    public function scopeByCulturalContext($query, $context)
    {
        return $query->where('cultural_context', $context);
    }

    /**
     * Scope to get products by approval status
     */
    public function scopeByApprovalStatus($query, $status)
    {
        return $query->where('approval_status', $status);
    }

    /**
     * Scope to get products by supplier
     */
    public function scopeBySupplier($query, $supplierId)
    {
        return $query->where('supplier_id', $supplierId);
    }

    /**
     * Search products by name, description, tags, or SKU
     */
    public function scopeSearch($query, $term)
    {
        return $query->where(function ($query) use ($term) {
            $query->where('name', 'like', "%{$term}%")
                  ->orWhere('description', 'like', "%{$term}%")
                  ->orWhere('sku', 'like', "%{$term}%")
                  ->orWhere('tags', 'like', "%{$term}%");
        });
    }

    /**
     * Check if product is in stock
     */
    public function inStock()
    {
        return $this->stock_quantity > 0;
    }

    /**
     * Check if product is approved
     */
    public function isApproved()
    {
        return $this->approval_status === 'approved';
    }

    /**
     * Check if product is pending approval
     */
    public function isPending()
    {
        return $this->approval_status === 'pending';
    }

    /**
     * Check if product is rejected
     */
    public function isRejected()
    {
        return $this->approval_status === 'rejected';
    }

    /**
     * Get formatted price with currency (LKR)
     */
    public function getFormattedPriceAttribute()
    {
        return 'LKR ' . number_format($this->price, 2);
    }

    /**
     * Get the main product image
     */
    public function getMainImageAttribute()
    {
        $media = $this->getFirstMedia('images');
        return $media ? $media->getUrl() : $this->image_url;
    }

    /**
     * Get product thumbnail
     */
    public function getThumbnailAttribute()
    {
        $media = $this->getFirstMedia('images');
        return $media ? $media->getUrl('thumb') : $this->image_url;
    }

    /**
     * Get all product images
     */
    public function getAllImagesAttribute()
    {
        $mediaImages = $this->getMedia('images')->map(function ($media) {
            return $media->getUrl();
        });
        
        if ($this->image_url && $mediaImages->isEmpty()) {
            $mediaImages->push($this->image_url);
        }
        
        return $mediaImages;
    }

    /**
     * Get stock status as string
     */
    public function getStockStatusAttribute()
    {
        if ($this->stock_quantity > 10) {
            return 'In Stock';
        } elseif ($this->stock_quantity > 0) {
            return 'Low Stock';
        } else {
            return 'Out of Stock';
        }
    }

    /**
     * Decrease stock quantity
     */
    public function decreaseStock($quantity)
    {
        if ($this->stock_quantity >= $quantity) {
            $this->decrement('stock_quantity', $quantity);
            return true;
        }
        return false;
    }

    /**
     * Increase stock quantity
     */
    public function increaseStock($quantity)
    {
        $this->increment('stock_quantity', $quantity);
    }
}