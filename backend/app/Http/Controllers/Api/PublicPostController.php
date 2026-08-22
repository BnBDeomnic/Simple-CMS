<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;

class PublicPostController extends Controller
{
    /**
     * List categories that have at least one published post — used to
     * populate the homepage filter without exposing empty categories.
     */
    public function categories()
    {
        return response()->json(
            Category::whereHas('posts', fn ($q) => $q->where('status', 'published'))
                ->orderBy('name')
                ->get()
        );
    }

    /**
     * Display a paginated listing of published posts.
     */
    public function index(Request $request)
    {
        $query = Post::query()
            ->with(['category', 'user'])
            ->where('status', 'published');

        if ($search = $request->query('search')) {
            // Postgres LIKE is case-sensitive, unlike MySQL — use ILIKE explicitly.
            $query->whereRaw('title ILIKE ?', ["%{$search}%"])
                // Titles starting with the search term rank above titles that
                // just contain it elsewhere (Postgres sorts true before false DESC).
                ->orderByRaw('(title ILIKE ?) DESC', ["{$search}%"]);
        }

        if ($category = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        $query->latest('published_at');

        return response()->json($query->paginate(10));
    }

    /**
     * Top 10 published posts — featured posts first, filled out with the
     * latest posts so the list is never empty even before anything has
     * been marked as featured.
     */
    public function topTen()
    {
        $posts = Post::query()
            ->with(['category', 'user'])
            ->where('status', 'published')
            ->orderByDesc('is_featured')
            ->latest('published_at')
            ->limit(10)
            ->get();

        return response()->json($posts);
    }

    /**
     * Display the specified published post by its slug.
     */
    public function show(string $slug)
    {
        $post = Post::with(['category', 'user'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        return response()->json($post);
    }
}
