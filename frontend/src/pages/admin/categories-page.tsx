import { useState } from "react"
import { toast } from "sonner"
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/use-categories"
import { extractErrorMessage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import type { Category } from "@/types"

export function CategoriesPage() {
  const { data: categories, isLoading, isError } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [name, setName] = useState("")
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  function openCreate() {
    setEditingCategory(null)
    setName("")
    setFormOpen(true)
  }

  function openEdit(category: Category) {
    setEditingCategory(category)
    setName(category.name)
    setFormOpen(true)
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Category name is required.")
      return
    }
    setIsSaving(true)
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, name })
        toast.success("Category updated.")
      } else {
        await createCategory.mutateAsync(name)
        toast.success("Category created.")
      }
      setFormOpen(false)
    } catch (error) {
      toast.error(extractErrorMessage(error, "Could not save this category."))
    } finally {
      setIsSaving(false)
    }
  }

  async function confirmDelete() {
    if (!categoryToDelete) return
    try {
      await deleteCategory.mutateAsync(categoryToDelete.id)
      toast.success(`"${categoryToDelete.name}" was deleted.`)
      setCategoryToDelete(null)
    } catch (error) {
      toast.error(extractErrorMessage(error, "This category can't be deleted right now."))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">Organize posts into topics.</p>
        </div>
        <Button onClick={openCreate}>New Category</Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading categories…</p>}

      {isError && (
        <p className="text-muted-foreground">
          Something went wrong loading categories. Please try refreshing the page.
        </p>
      )}

      {categories && categories.length === 0 && (
        <p className="text-muted-foreground">
          No categories yet. Create one so you can start assigning it to posts.
        </p>
      )}

      {categories && categories.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Slug</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {category.slug}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(category)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setCategoryToDelete(category)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category name below."
                : "Give your new category a name."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category-name">Name</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Technology"
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving…" : editingCategory ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete "{categoryToDelete?.name}"?</DialogTitle>
            <DialogDescription>
              This can't be undone. Categories that still have posts assigned to them can't be
              deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteCategory.isPending}
            >
              {deleteCategory.isPending ? "Deleting…" : "Delete Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
