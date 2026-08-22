import { useSearchParams } from "react-router-dom"
import { usePublicPosts } from "@/hooks/use-public-posts"
import { PaginationBar } from "@/components/pagination-bar"
import { PostCard } from "@/components/post-card"

export function LatestPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get("page") ?? "1")

  const { data, isLoading, isError } = usePublicPosts({ page })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Postingan Terbaru</h1>
        <p className="mt-2 text-muted-foreground">
          Postingan terbaru, diurutkan dari yang paling baru.
        </p>
      </div>

      {isLoading && <p className="text-muted-foreground">Memuat postingan…</p>}

      {isError && (
        <p className="text-muted-foreground">
          Terjadi kesalahan saat memuat postingan. Silakan muat ulang halaman.
        </p>
      )}

      {data && data.data.length === 0 && (
        <p className="text-muted-foreground">
          Belum ada postingan yang dipublikasikan. Silakan periksa kembali nanti.
        </p>
      )}

      <div className="flex flex-col gap-4">
        {data?.data.map((post, index) => (
          <PostCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {data && (
        <PaginationBar
          currentPage={page}
          lastPage={data.last_page}
          onPageChange={(p) => setSearchParams({ page: String(p) })}
        />
      )}
    </div>
  )
}
