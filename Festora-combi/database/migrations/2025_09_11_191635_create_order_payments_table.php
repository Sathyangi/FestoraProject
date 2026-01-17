<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('order_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('order_id')->unique();
            $table->decimal('total_amount', 10, 2);
            $table->decimal('shipping_amount', 10, 2)->default(0);
            $table->string('currency', 3)->default('LKR');
            $table->string('transaction_id')->unique();
            $table->string('payment_method');
            $table->string('card_type')->nullable();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->text('shipping_address');
            $table->string('shipping_city');
            $table->text('billing_address')->nullable();
            $table->json('order_items');
            $table->string('order_status')->default('pending');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_payments');
    }
};