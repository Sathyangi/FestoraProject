<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\OrganizationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Include Laravel Breeze authentication routes
require __DIR__.'/auth.php';

// Home page
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// Public product routes (no auth required)
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{id}', [ProductController::class, 'show'])->name('products.show');

// Cart and checkout routes
Route::middleware(['auth'])->group(function () {
    Route::post('/checkout', [ProductController::class, 'checkout'])->name('checkout');
});

// API routes for cart validation
Route::middleware('auth')->group(function () {
    Route::get('/api/products/{id}', [ProductController::class, 'getProduct'])->name('api.products.show');
    Route::post('/api/cart/validate', [ProductController::class, 'validateCart'])->name('api.cart.validate');
    Route::post('/api/cart/summary', [ProductController::class, 'getCartSummary'])->name('api.cart.summary');
});

// Order routes
Route::middleware(['auth'])->group(function () {
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{orderId}', [OrderController::class, 'show'])->name('orders.show');
});

// Donation routes
Route::get('/donate', [DonationController::class, 'index'])->name('donate');
Route::post('/donations', [DonationController::class, 'store'])->middleware('auth')->name('donations.store');

// Static pages
Route::get('/festivals', function () {
    return Inertia::render('Festivals');
})->name('festivals');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

// Profile routes (protected)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin routes - Simple approach without closures
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
    Route::patch('/users/{user}/status', [AdminController::class, 'updateUserStatus'])->name('admin.users.status');
    
    // Product request management
    Route::get('/product-requests', [AdminController::class, 'productRequests'])->name('admin.product-requests');
    Route::patch('/product-requests/{productRequest}', [AdminController::class, 'reviewProductRequest'])->name('admin.product-requests.review');
    
    // Donation request management
    Route::get('/donation-requests', [AdminController::class, 'donationRequests'])->name('admin.donation-requests');
    Route::patch('/donation-requests/{donationRequest}', [AdminController::class, 'reviewDonationRequest'])->name('admin.donation-requests.review');
});

// Supplier routes - Simple approach without closures
    Route::middleware(['auth'])->prefix('supplier')->group(function () {
    Route::get('/dashboard', [SupplierController::class, 'dashboard'])->name('supplier.dashboard');
    Route::post('/supplier/products', [SupplierProductController::class, 'store'])->name('supplier.products.store');
    // Product management
    Route::get('/products', [SupplierController::class, 'products'])->name('supplier.products');
    Route::get('/products/create', [SupplierController::class, 'createProduct'])->name('supplier.products.create');
    Route::post('/products', [SupplierController::class, 'storeProduct'])->name('supplier.products.store');
    Route::get('/products/{product}/edit', [SupplierController::class, 'editProduct'])->name('supplier.products.edit');
    Route::patch('/products/{product}', [SupplierController::class, 'updateProduct'])->name('supplier.products.update');
    Route::delete('/products/{product}', [SupplierController::class, 'deleteProduct'])->name('supplier.products.destroy');
    
    // Product requests
    Route::get('/product-requests', [SupplierController::class, 'productRequests'])->name('supplier.product-requests');
    
    // Notifications
    Route::get('/notifications', [SupplierController::class, 'notifications'])->name('supplier.notifications');
});

// Organization routes - Simple approach without closures
Route::middleware(['auth'])->prefix('organization')->group(function () {
    Route::get('/dashboard', [OrganizationController::class, 'dashboard'])->name('organization.dashboard');
    
    // Campaign management
    Route::get('/campaigns', [OrganizationController::class, 'campaigns'])->name('organization.campaigns');
    Route::get('/campaigns/create', [OrganizationController::class, 'createCampaign'])->name('organization.campaigns.create');
    Route::post('/campaigns', [OrganizationController::class, 'storeCampaign'])->name('organization.campaigns.store');
    
    // Notifications
    Route::get('/notifications', [OrganizationController::class, 'notifications'])->name('organization.notifications');
});