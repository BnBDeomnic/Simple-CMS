<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Budi Santoso',
            'email' => 'admin@gmail.com',
            'password' => '123',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Rina Wijaya',
            'email' => 'author@gmail.com',
            'password' => '123',
            'role' => 'author',
        ]);

        User::create([
            'name' => 'Dewi Lestari',
            'email' => 'dewi@gmail.com',
            'password' => '123',
            'role' => 'author',
        ]);

        $this->call([
            CategorySeeder::class,
            PostSeeder::class,
        ]);
    }
}
