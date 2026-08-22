import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { excerpt, formatDate } from "@/lib/utils"
import type { Post } from "@/types"

interface PostCardProps {
  post: Post
  index?: number
  rank?: number
}

export function PostCard({ post, index = 0, rank }: PostCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group rounded-xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
    >
      <div className="mb-2 flex items-center gap-2">
        {rank !== undefined && <span className="text-sm font-semibold text-primary">#{rank}</span>}
        {post.category && <Badge variant="secondary">{post.category.name}</Badge>}
        {post.is_featured && <Badge>Unggulan</Badge>}
        <span className="text-sm text-muted-foreground">{formatDate(post.published_at)}</span>
      </div>
      <h2 className="text-xl font-semibold">
        <Link to={`/post/${post.slug}`} className="transition-colors group-hover:text-primary">
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 text-muted-foreground">{excerpt(post.content)}</p>
      {post.user && <p className="mt-3 text-sm text-muted-foreground">Oleh {post.user.name}</p>}
    </motion.article>
  )
}
