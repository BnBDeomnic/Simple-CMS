import axios from "axios"
import { toast } from "sonner"

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const onLoginPage = window.location.pathname === "/admin/login"
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      if (!onLoginPage) {
        toast.error("Your session expired — please log in again.")
        window.location.href = "/admin/login"
      }
    }
    return Promise.reject(error)
  },
)

/** Flattens Laravel's { errors: { field: [msg] } } into one readable string. */
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data?.errors) {
      const firstField = Object.values(data.errors)[0]
      if (Array.isArray(firstField) && firstField.length > 0) {
        return firstField[0] as string
      }
    }
    if (data?.message) return data.message as string
  }
  return fallback
}
