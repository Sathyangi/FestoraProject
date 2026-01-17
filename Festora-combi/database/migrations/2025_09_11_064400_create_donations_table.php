<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('organization_id');
            $table->string('organization_name');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('LKR');
            $table->string('transaction_id')->unique();
            $table->string('payment_method')->default('card');
            $table->string('card_type')->nullable();
            $table->string('donor_name');
            $table->enum('status', ['pending', 'completed', 'failed'])->default('completed');
            $table->timestamp('donated_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};