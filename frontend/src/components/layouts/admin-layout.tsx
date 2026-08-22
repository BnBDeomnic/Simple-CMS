import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === "admin"

  async function handleLogout() {
    await logout()
    navigate("/admin/login", { replace: true })
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "text-sm text-muted-foreground transition-colors hover:text-primary",
      isActive && "font-medium text-primary",
    )

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-2 font-semibold">
              <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
              Simple CMS
            </span>
            <nav className="flex flex-wrap gap-4">
              <NavLink to="/admin/posts" className={linkClass}>
                Posts
              </NavLink>
              {isAdmin && (
                <>
                  <NavLink to="/admin/categories" className={linkClass}>
                    Categories
                  </NavLink>
                  <NavLink to="/admin/users" className={linkClass}>
                    Users
                  </NavLink>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <span className="truncate text-sm text-muted-foreground">
              {user?.name} <span className="capitalize">({user?.role})</span>
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
