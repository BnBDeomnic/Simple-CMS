import { useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { usePost, useCreatePost, useUpdatePost } from "@/hooks/use-posts"
import { useCategories } from "@/hooks/use-categories"
import { extractErrorMessage } from "@/lib/api"
import { TiptapEditor } from "@/components/tiptap-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import type { Post, PostStatus } from "@/types"

const postSchema = z.object({
  title: z.string().min(1, "Title is required.").max(255),
  category_id: z.string().min(1, "Choose a category."),
  status: z.enum(["draft", "published"]),
  is_featured: z.boolean(),
})

type PostFormValues = z.infer<typeof postSchema>

export function PostFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const {
    data: post,
    isLoading: isLoadingPost,
    isError,
  } = usePost(isEditing ? Number(id) : undefined)

  if (isEditing && isLoadingPost) {
    return <p className="text-muted-foreground">Loading post…</p>
  }

  if (isEditing && isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <h1 className="text-2xl font-semibold">Can't open this post</h1>
        <p className="text-muted-foreground">
          You don't have permission to edit this post, or it no longer exists.
        </p>
        <Button asChild variant="outline">
          <Link to="/admin/posts">Back to Posts</Link>
        </Button>
      </div>
    )
  }

  // Keyed by post id so navigating between two edit pages remounts the form
  // fresh with the right defaultValues, instead of reusing stale field state.
  return <PostForm key={post?.id ?? "new"} post={post} postId={isEditing ? Number(id) : undefined} />
}

function PostForm({ post, postId }: { post: Post | undefined; postId: number | undefined }) {
  const navigate = useNavigate()
  const isEditing = postId !== undefined
  const [content, setContent] = useState(post?.content ?? "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: categories } = useCategories()
  const createPost = useCreatePost()
  const updatePost = useUpdatePost()

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title ?? "",
      category_id: post ? String(post.category_id) : "",
      status: (post?.status ?? "draft") as PostStatus,
      is_featured: post?.is_featured ?? false,
    },
  })

  async function onSubmit(values: PostFormValues) {
    if (!content.trim()) {
      toast.error("Post content can't be empty.")
      return
    }
    setIsSubmitting(true)
    const payload = {
      title: values.title,
      content,
      category_id: Number(values.category_id),
      status: values.status,
      is_featured: values.is_featured,
    }
    try {
      if (isEditing) {
        await updatePost.mutateAsync({ id: postId, ...payload })
        toast.success("Post updated.")
      } else {
        await createPost.mutateAsync(payload)
        toast.success(values.status === "published" ? "Post published." : "Draft saved.")
      }
      navigate("/admin/posts")
    } catch (error) {
      toast.error(extractErrorMessage(error, "Could not save this post."))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="text-2xl font-semibold">{isEditing ? "Edit Post" : "New Post"}</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Give your post a clear, descriptive title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <Label>Content</Label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft — only visible to you</SelectItem>
                    <SelectItem value="published">
                      Published — visible on the homepage
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="is_featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-3 space-y-0 rounded-lg border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Mark as Featured</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Featured posts appear first on the homepage's Top 10 list.
                  </p>
                </div>
              </FormItem>
            )}
          />

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving…"
                : form.watch("status") === "published"
                  ? "Publish Post"
                  : "Save Draft"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/admin/posts")}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
