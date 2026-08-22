export type Role = "admin" | "author"

export interface User {
  id: number
  name: string
  email: string
  role: Role
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export type PostStatus = "draft" | "published"

export interface Post {
  id: number
  title: string
  slug: string
  content: string
  status: PostStatus
  is_featured: boolean
  published_at: string | null
  category_id: number
  user_id: number
  category?: Category
  user?: User
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface ApiValidationError {
  message: string
  errors?: Record<string, string[]>
}
