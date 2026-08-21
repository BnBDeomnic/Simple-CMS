<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $author = User::where('role', 'author')->first();
        $categories = Category::all();

        $posts = [
            ['title' => 'Getting Started with Laravel', 'status' => 'published'],
            ['title' => 'Why TypeScript Makes React Better', 'status' => 'published'],
            ['title' => 'Five Tips for Remote Work', 'status' => 'published'],
            ['title' => 'A Weekend Trip to the Mountains', 'status' => 'published'],
            ['title' => 'Upcoming Product Roadmap', 'status' => 'draft'],
        ];

        foreach ($posts as $i => $data) {
            Post::create([
                'title' => $data['title'],
                'content' => "<p>This is sample content for \"{$data['title']}\".</p>",
                'status' => $data['status'],
                'category_id' => $categories[$i % $categories->count()]->id,
                'user_id' => $i % 2 === 0 ? $admin->id : $author->id,
            ]);
        }
    }
}
