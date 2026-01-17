<?php

// database/migrations/xxxx_create_donation_requests_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('donation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organization_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->decimal('target_amount', 12, 2);
            $table->decimal('raised_amount', 12, 2)->default(0);
            $table->date('start_date');
            $table->date('end_date');
            $table->string('category');
            $table->json('documents')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
            
            $table->index(['organization_id', 'status']);
            $table->index('status');
        });
    }

    public function down()
    {
        Schema::dropIfExists('donation_requests');
    }
};
