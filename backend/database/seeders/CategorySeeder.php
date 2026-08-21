<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (['Technology', 'Lifestyle', 'Business', 'Travel'] as $name) {
            Category::create(['name' => $name]);
        }
    }
}
