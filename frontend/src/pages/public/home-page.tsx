import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Search } from "lucide-react"
import { usePublicPosts, usePublicCategories } from "@/hooks/use-public-posts"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PaginationBar } from "@/components/pagination-bar"
import { PostCard } from "@/components/post-card"

const ALL_CATEGORIES = "all"

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get("search") ?? ""
  const category = searchParams.get("category") ?? ALL_CATEGORIES
  const page = Number(searchParams.get("page") ?? "1")

  const [searchInput, setSearchInput] = useState(search)
  const debouncedSearchInput = useDebouncedValue(searchInput, 350)

  const { data: categories } = usePublicCategories()
  const { data, isLoading, isError } = usePublicPosts({
    page,
    search: search || undefined,
    category: category === ALL_CATEGORIES ? undefined : category,
  })

  function updateParams(next: { search?: string; category?: string; page?: number }) {
    const params = new URLSearchParams(searchParams)
    if (next.search !== undefined) {
      next.search ? params.set("search", next.search) : params.delete("search")
    }
    if (next.category !== undefined) {
      next.category === ALL_CATEGORIES
        ? params.delete("category")
        : params.set("category", next.category)
    }
    params.set("page", String(next.page ?? 1))
    setSearchParams(params)
  }

  // Live search: update the URL a moment after the user stops typing,
  // so results filter automatically without needing to press Enter.
  useEffect(() => {
    if (debouncedSearchInput !== search) {
      updateParams({ search: debouncedSearchInput, page: 1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchInput])

  // Keep the input in sync if the URL changes another way (e.g. back/forward).
  useEffect(() => {
    setSearchInput(search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Simple CMS Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Bacaan singkat tentang hal-hal yang sedang kami bangun dan pelajari.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari postingan…"
            className="pl-9"
          />
        </div>
        <Select
          value={category}
          onValueChange={(value) => updateParams({ category: value, page: 1 })}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Semua kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>Semua kategori</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && (
        <p className="text-muted-foreground">Memuat postingan…</p>
      )}

      {isError && (
        <p className="text-muted-foreground">
          Terjadi kesalahan saat memuat postingan. Silakan muat ulang halaman.
        </p>
      )}

      {data && data.data.length === 0 && (
        <p className="text-muted-foreground">
          {search
            ? `Postingan tidak ditemukan untuk "${search}". Silakan coba kata kunci lain atau lihat semua postingan.`
            : "Belum ada postingan yang dipublikasikan. Silakan periksa kembali nanti."}
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
          onPageChange={(p) => updateParams({ page: p })}
        />
      )}
    </div>
  )
}
