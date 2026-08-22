import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { User, PaginatedResponse, Role } from "@/types"

export interface UserPayload {
  name: string
  email: string
  password?: string
  role: Role
}

export function useUsers(page: number = 1) {
  return useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<User>>("/users", {
        params: { page },
      })
      return data
    },
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: UserPayload) => {
      const { data } = await api.post<User>("/users", payload)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }: UserPayload & { id: number }) => {
      const { data } = await api.put<User>(`/users/${id}`, payload)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/users/${id}`)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  })
}
