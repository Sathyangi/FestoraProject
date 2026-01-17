<?php
// database/migrations/xxxx_create_payment_notifications_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payment_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_payment_id')->constrained('order_payments')->onDelete('cascade');
            $table->foreignId('supplier_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('organization_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('amount', 10, 2);
            $table->string('notification_type'); // 'product_sale' or 'donation'
            $table->boolean('is_read')->default(false);
            $table->json('metadata')->nullable(); // Store additional info
            $table->timestamps();
            
            $table->index(['supplier_id', 'is_read']);
            $table->index(['organization_id', 'is_read']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('payment_notifications');
    }
};