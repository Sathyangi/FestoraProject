<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Vesak Lantern Kit',
                'category' => 'Decorations',
                'price' => 1200.00,
                'image_url' => '/images/vesak4.jpg',
                'tags' => json_encode(['Vesak', 'Buddhist', 'Handicraft']),
                'cultural_context' => 'Vesak Poya',
                'description' => 'A DIY kit to create beautiful traditional Sri Lankan Vesak lanterns, perfect for home decorations during the festival.',
                'stock_quantity' => 50,
                'is_active' => true,
            ],
            [
                'name' => 'Clay Oil Lamp (Pahana)',
                'category' => 'Ceremonial Items',
                'price' => 250.00,
                'image_url' => '/images/pahana.jpg',
                'tags' => json_encode(['Vesak', 'Poson', 'Buddhist', 'Traditional']),
                'cultural_context' => 'Vesak Poya',
                'description' => 'Hand-crafted clay oil lamps (pahana) used during religious ceremonies and festivals, symbolizing light and wisdom.',
                'stock_quantity' => 100,
                'is_active' => true,
            ],
            [
                'name' => 'Pottu (Bindi) & Kumkum Pack',
                'category' => 'Adornments',
                'price' => 500.00,
                'image_url' => '/images/kukum.png',
                'tags' => json_encode(['Hindu', 'Traditional', 'Festival']),
                'cultural_context' => 'Thai Pongal / Deepavali',
                'description' => 'Authentic Indian bindi and kumkum powder, essential adornments for Hindu women, especially during festive occasions.',
                'stock_quantity' => 75,
                'is_active' => true,
            ],
            [
                'name' => 'Spice Box Set',
                'category' => 'Food',
                'price' => 4000.00,
                'image_url' => '/images/spices.jpg',
                'tags' => json_encode(['Culinary', 'Gift', 'General Cultural']),
                'cultural_context' => 'General Sri Lankan Culture',
                'description' => 'A curated set of premium Sri Lankan spices, including cinnamon, cardamom, and turmeric, perfect for culinary enthusiasts.',
                'stock_quantity' => 30,
                'is_active' => true,
            ],
            [
                'name' => 'Wooden Elephant Carving',
                'category' => 'Carvings',
                'price' => 8000.00,
                'image_url' => '/images/woodenElephant.png',
                'tags' => json_encode(['Cultural', 'Souvenir', 'Handicraft']),
                'cultural_context' => 'General Sri Lankan Culture',
                'description' => 'An intricately carved wooden elephant figurine, a classic Sri Lankan souvenir representing strength and prosperity.',
                'stock_quantity' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Batik Saree',
                'category' => 'Textiles',
                'price' => 15000.00,
                'image_url' => '/images/bathik.jpg',
                'tags' => json_encode(['Fashion', 'Traditional', 'Gift']),
                'cultural_context' => 'General Sri Lankan Culture',
                'description' => 'A vibrant, hand-dyed batik saree, showcasing the traditional art of wax-resist dyeing, elegant for any occasion.',
                'stock_quantity' => 15,
                'is_active' => true,
            ],
            [
                'name' => 'Murukku (Savory Snack)',
                'category' => 'Food',
                'price' => 750.00,
                'image_url' => '/images/Murukku.jpg',
                'tags' => json_encode(['Hindu', 'Festival Food', 'Snack']),
                'cultural_context' => 'Thai Pongal / Deepavali',
                'description' => 'Crispy and savory Murukku, a popular spiral-shaped snack commonly enjoyed during Hindu festivals and celebrations.',
                'stock_quantity' => 60,
                'is_active' => true,
            ],
            [
                'name' => 'Decorative Christmas Tree',
                'category' => 'Decorations',
                'price' => 10000.00,
                'image_url' => '/images/decoratedTree.jpg',
                'tags' => json_encode(['Christmas', 'Christian', 'Seasonal']),
                'cultural_context' => 'Christmas',
                'description' => 'A festive pre-lit artificial Christmas tree, ideal for decorating your home during the holiday season.',
                'stock_quantity' => 25,
                'is_active' => true,
            ],
            [
                'name' => 'Prayer Mat (Janamaz)',
                'category' => 'Religious Items',
                'price' => 4500.00,
                'image_url' => '/images/prayerMat.jpg',
                'tags' => json_encode(['Muslim', 'Religious', 'Eid']),
                'cultural_context' => 'Eid al-Fitr / Eid al-Adha',
                'description' => 'A soft and portable prayer mat (Janamaz), an essential item for daily prayers for Muslims, often gifted during Eid.',
                'stock_quantity' => 40,
                'is_active' => true,
            ],
            [
                'name' => 'Avurudu Sweet Platter Kit',
                'category' => 'Food',
                'price' => 2500.00,
                'image_url' => '/images/sweet.png',
                'tags' => json_encode(['Sinhala New Year', 'Tamil New Year', 'Sweet', 'Traditional']),
                'cultural_context' => 'Sinhala & Tamil New Year',
                'description' => 'A DIY kit with ingredients and instructions to prepare traditional Sinhala and Tamil New Year sweets like Konda Kavum and Kokis.',
                'stock_quantity' => 35,
                'is_active' => true,
            ],
            [
                'name' => 'Traditional Drum (Beraya)',
                'category' => 'Musical Instruments',
                'price' => 25000.00,
                'image_url' => '/images/Tdrum.png',
                'tags' => json_encode(['Traditional', 'Musical Instrument', 'Cultural']),
                'cultural_context' => 'General Sri Lankan Culture',
                'description' => 'An authentic traditional Sri Lankan drum (Beraya), handcrafted by local artisans, used in various cultural performances.',
                'stock_quantity' => 10,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}