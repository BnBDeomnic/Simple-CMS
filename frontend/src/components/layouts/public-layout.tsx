import { Outlet, Link, NavLink } from "react-router-dom"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "text-muted-foreground transition-colors hover:text-primary",
    isActive && "font-medium text-primary",
  )

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
              Simple CMS Blog
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/login">
                <LogIn className="size-4" />
                Admin Login
              </Link>
            </Button>
          </div>
          <nav className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/latest" className={navLinkClass}>
              Latest
            </NavLink>
            <NavLink to="/top-10" className={navLinkClass}>
              Top 10
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <Outlet />
      </main>
      <footer className="border-t">
        <div className="mx-auto max-w-3xl px-6 py-8 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Simple CMS Blog</p>
          <p className="mt-1">Bacaan singkat tentang hal-hal yang sedang kami bangun dan pelajari.</p>
          <p className="mt-4">
            © {new Date().getFullYear()} Simple CMS Blog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
