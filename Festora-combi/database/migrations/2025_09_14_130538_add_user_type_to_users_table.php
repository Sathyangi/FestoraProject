<?php
// database/migrations/xxxx_add_user_type_to_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('user_type', ['admin', 'supplier', 'organization', 'customer'])
                  ->default('customer')
                  ->after('email');
            $table->text('description')->nullable()->after('user_type');
            $table->string('phone')->nullable()->after('description');
            $table->text('address')->nullable()->after('phone');
            $table->enum('status', ['active', 'inactive', 'pending'])->default('active')->after('address');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['user_type', 'description', 'phone', 'address', 'status']);
        });
    }
};