import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Post, Category, PaginatedResponse } from "@/types"

export function usePublicCategories() {
  return useQuery({
    queryKey: ["public-categories"],
    queryFn: async () => {
      const { data } = await api.get<Category[]>("/public/categories")
      return data
    },
  })
}

interface PublicPostsParams {
  page?: number
  search?: string
  category?: string
}

export function usePublicPosts(params: PublicPostsParams) {
  return useQuery({
    queryKey: ["public-posts", params],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Post>>("/public/posts", {
        params,
      })
      return data
    },
  })
}

export function useTopTenPosts() {
  return useQuery({
    queryKey: ["public-posts", "top-10"],
    queryFn: async () => {
      const { data } = await api.get<Post[]>("/public/posts/top-10")
      return data
    },
  })
}

export function usePublicPost(slug: string | undefined) {
  return useQuery({
    queryKey: ["public-posts", "detail", slug],
    queryFn: async () => {
      const { data } = await api.get<Post>(`/public/posts/${slug}`)
      return data
    },
    enabled: !!slug,
  })
}
