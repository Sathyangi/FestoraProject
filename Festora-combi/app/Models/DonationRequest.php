<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class DonationRequest extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'organization_id',
        'title',
        'description',
        'target_amount',
        'raised_amount',
        'start_date',
        'end_date',
        'category',
        'documents',
        'status',
        'admin_notes',
        'reviewed_at',
        'reviewed_by',
        'is_featured',
    ];

    protected $casts = [
        'target_amount' => 'decimal:2',
        'raised_amount' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'documents' => 'array',
        'reviewed_at' => 'datetime',
        'is_featured' => 'boolean',
    ];

    public function organization()
    {
        return $this->belongsTo(User::class, 'organization_id');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
    }

    public function getProgressPercentageAttribute()
    {
        if ($this->target_amount == 0) return 0;
        return min(100, ($this->raised_amount / $this->target_amount) * 100);
    }
}
