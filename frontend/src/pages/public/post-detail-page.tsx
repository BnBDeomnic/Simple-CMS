import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { usePublicPost } from "@/hooks/use-public-posts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

export function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = usePublicPost(slug)

  if (isLoading) {
    return <p className="text-muted-foreground">Loading post…</p>
  }

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <h1 className="text-2xl font-semibold">Post not found</h1>
        <p className="text-muted-foreground">
          This post may have been unpublished or the link may be incorrect.
        </p>
        <Button asChild variant="outline">
          <Link to="/">Back to homepage</Link>
        </Button>
      </div>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      <Link
        to="/"
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Back to all posts
      </Link>
      <div>
        <div className="mb-3 flex items-center gap-2">
          {post.category && <Badge variant="secondary">{post.category.name}</Badge>}
          <span className="text-sm text-muted-foreground">
            {formatDate(post.published_at)}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
        {post.user && (
          <p className="mt-2 text-sm text-muted-foreground">By {post.user.name}</p>
        )}
      </div>
      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </motion.article>
  )
}
