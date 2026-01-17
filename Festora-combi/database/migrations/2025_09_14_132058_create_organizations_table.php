<?php
// database/migrations/xxxx_create_organizations_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('organizations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('organization_name');
            $table->string('registration_number')->unique();
            $table->text('mission_statement');
            $table->string('website')->nullable();
            $table->string('contact_person');
            $table->string('contact_phone');
            $table->text('contact_address');
            $table->enum('organization_type', ['charity', 'ngo', 'foundation', 'trust', 'other']);
            $table->json('focus_areas');
            $table->decimal('total_raised', 12, 2)->default(0);
            $table->integer('active_campaigns')->default(0);
            $table->enum('verification_status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            
            $table->index('verification_status');
        });
    }

    public function down()
    {
        Schema::dropIfExists('organizations');
    }
};
