<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class PublicPostController extends Controller
{
    /**
     * Display a paginated listing of published posts.
     */
    public function index(Request $request)
    {
        $query = Post::query()
            ->with(['category', 'user'])
            ->where('status', 'published')
            ->latest('published_at');

        if ($search = $request->query('search')) {
            // Postgres LIKE is case-sensitive, unlike MySQL — use ILIKE explicitly.
            $query->whereRaw('title ILIKE ?', ["%{$search}%"]);
        }

        if ($category = $request->query('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $category));
        }

        return response()->json($query->paginate(10));
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
