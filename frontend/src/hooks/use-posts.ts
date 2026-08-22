import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Post, PaginatedResponse, PostStatus } from "@/types"

export interface PostPayload {
  title: string
  content: string
  category_id: number
  status: PostStatus
  is_featured: boolean
}

export function usePosts(page: number = 1) {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Post>>("/posts", {
        params: { page },
      })
      return data
    },
  })
}

export function usePost(id: number | undefined) {
  return useQuery({
    queryKey: ["posts", "detail", id],
    queryFn: async () => {
      const { data } = await api.get<Post>(`/posts/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: PostPayload) => {
      const { data } = await api.post<Post>("/posts", payload)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  })
}

export function useUpdatePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: PostPayload & { id: number }) => {
      const { data } = await api.put<Post>(`/posts/${id}`, payload)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/posts/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  })
}
