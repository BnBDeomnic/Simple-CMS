import { Routes, Route, Navigate } from "react-router-dom"
import { PublicLayout } from "@/components/layouts/public-layout"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { HomePage } from "@/pages/public/home-page"
import { LatestPage } from "@/pages/public/latest-page"
import { TopTenPage } from "@/pages/public/top-ten-page"
import { PostDetailPage } from "@/pages/public/post-detail-page"
import { LoginPage } from "@/pages/admin/login-page"
import { PostsListPage } from "@/pages/admin/posts-list-page"
import { PostFormPage } from "@/pages/admin/post-form-page"
import { CategoriesPage } from "@/pages/admin/categories-page"
import { UsersPage } from "@/pages/admin/users-page"
import { NotFoundPage } from "@/pages/not-found-page"

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/latest" element={<LatestPage />} />
        <Route path="/top-10" element={<TopTenPage />} />
        <Route path="/post/:slug" element={<PostDetailPage />} />
      </Route>

      <Route path="/admin/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/posts" replace />} />
          <Route path="/admin/posts" element={<PostsListPage />} />
          <Route path="/admin/posts/new" element={<PostFormPage />} />
          <Route path="/admin/posts/:id/edit" element={<PostFormPage />} />

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin/categories" element={<CategoriesPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
