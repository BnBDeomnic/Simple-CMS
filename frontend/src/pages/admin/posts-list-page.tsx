import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { usePosts, useDeletePost } from "@/hooks/use-posts"
import { useAuth } from "@/lib/auth-context"
import { extractErrorMessage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PaginationBar } from "@/components/pagination-bar"
import { formatDate } from "@/lib/utils"
import type { Post } from "@/types"

export function PostsListPage() {
  const [page, setPage] = useState(1)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const { data, isLoading, isError } = usePosts(page)
  const deletePost = useDeletePost()
  const { user } = useAuth()

  async function confirmDelete() {
    if (!postToDelete) return
    try {
      await deletePost.mutateAsync(postToDelete.id)
      toast.success(`"${postToDelete.title}" was deleted.`)
      setPostToDelete(null)
    } catch (error) {
      toast.error(extractErrorMessage(error, "Could not delete this post."))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Posts</h1>
          <p className="text-sm text-muted-foreground">
            {user?.role === "admin"
              ? "All posts across every author."
              : "Posts you've written."}
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/posts/new">New Post</Link>
        </Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading posts…</p>}

      {isError && (
        <p className="text-muted-foreground">
          Something went wrong loading posts. Please try refreshing the page.
        </p>
      )}

      {data && data.data.length === 0 && (
        <p className="text-muted-foreground">
          You haven't written any posts yet. Create your first one to get started.
        </p>
      )}

      {data && data.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead>Status</TableHead>
              {user?.role === "admin" && (
                <TableHead className="hidden md:table-cell">Author</TableHead>
              )}
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="max-w-[110px] truncate font-medium sm:max-w-xs">
                  {post.title}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {post.category?.name ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                {user?.role === "admin" && (
                  <TableCell className="hidden md:table-cell">
                    {post.user?.name ?? "—"}
                  </TableCell>
                )}
                <TableCell className="hidden md:table-cell">
                  {formatDate(post.updated_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm" className="px-2">
                    <Link to={`/admin/posts/${post.id}/edit`}>Edit</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 text-destructive hover:text-destructive"
                    onClick={() => setPostToDelete(post)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {data && (
        <PaginationBar currentPage={page} lastPage={data.last_page} onPageChange={setPage} />
      )}

      <Dialog open={!!postToDelete} onOpenChange={(open) => !open && setPostToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete "{postToDelete?.title}"?</DialogTitle>
            <DialogDescription>
              This can't be undone. The post will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPostToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletePost.isPending}
            >
              {deletePost.isPending ? "Deleting…" : "Delete Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
