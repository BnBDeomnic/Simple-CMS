import { useTopTenPosts } from "@/hooks/use-public-posts"
import { PostCard } from "@/components/post-card"

export function TopTenPage() {
  const { data, isLoading, isError } = useTopTenPosts()

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Top 10</h1>
        <p className="mt-2 text-muted-foreground">
          Pilihan editor, dilengkapi dengan postingan-postingan terbaru.
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground">Memuat postingan…</p>}

      {isError && (
        <p className="text-muted-foreground">
          Terjadi kesalahan saat memuat postingan. Silakan muat ulang halaman.
        </p>
      )}

      {data && data.length === 0 && (
        <p className="text-muted-foreground">
          Belum ada postingan yang dipublikasikan. Silakan periksa kembali nanti.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {data?.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} rank={index + 1} />
        ))}
      </div>
    </div>
  )
}
