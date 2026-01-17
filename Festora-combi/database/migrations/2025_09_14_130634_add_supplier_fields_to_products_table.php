<?php
// database/migrations/xxxx_add_supplier_fields_to_products_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('supplier_id')->nullable()->constrained('users')->onDelete('set null')->after('id');
            $table->string('sku')->unique()->nullable()->after('name');
            $table->json('specifications')->nullable()->after('description');
            $table->enum('approval_status', ['approved', 'pending', 'rejected'])->default('approved')->after('is_active');
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['supplier_id']);
            $table->dropColumn(['supplier_id', 'sku', 'specifications', 'approval_status']);
        });
    }
};