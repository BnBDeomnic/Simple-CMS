import { useState } from "react"
import { toast } from "sonner"
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  type UserPayload,
} from "@/hooks/use-users"
import { useAuth } from "@/lib/auth-context"
import { extractErrorMessage } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import type { User, Role } from "@/types"

const emptyForm: UserPayload = { name: "", email: "", password: "", role: "author" }

export function UsersPage() {
  const { user: currentUser } = useAuth()
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useUsers(page)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [form, setForm] = useState<UserPayload>(emptyForm)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  function openCreate() {
    setEditingUser(null)
    setForm(emptyForm)
    setFormOpen(true)
  }

  function openEdit(user: User) {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, password: "", role: user.role })
    setFormOpen(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required.")
      return
    }
    if (!editingUser && (!form.password || form.password.length < 8)) {
      toast.error("Password must be at least 8 characters.")
      return
    }
    setIsSaving(true)
    try {
      if (editingUser) {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        await updateUser.mutateAsync({ id: editingUser.id, ...payload })
        toast.success("User updated.")
      } else {
        await createUser.mutateAsync(form)
        toast.success("User created.")
      }
      setFormOpen(false)
    } catch (error) {
      toast.error(extractErrorMessage(error, "Could not save this user."))
    } finally {
      setIsSaving(false)
    }
  }

  async function confirmDelete() {
    if (!userToDelete) return
    try {
      await deleteUser.mutateAsync(userToDelete.id)
      toast.success(`"${userToDelete.name}" was deleted.`)
      setUserToDelete(null)
    } catch (error) {
      toast.error(extractErrorMessage(error, "This user can't be deleted right now."))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage who can access the admin panel.
          </p>
        </div>
        <Button onClick={openCreate}>New User</Button>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading users…</p>}

      {isError && (
        <p className="text-muted-foreground">
          Something went wrong loading users. Please try refreshing the page.
        </p>
      )}

      {data && data.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(user)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    disabled={user.id === currentUser?.id}
                    title={
                      user.id === currentUser?.id
                        ? "You can't delete your own account."
                        : undefined
                    }
                    onClick={() => setUserToDelete(user)}
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "New User"}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Leave the password blank to keep the current password."
                : "Create a login for a new admin or author."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="user-name">Name</Label>
              <Input
                id="user-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="user-password">
                Password{" "}
                {editingUser && <span className="text-muted-foreground">(optional)</span>}
              </Label>
              <Input
                id="user-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={
                  editingUser ? "Leave blank to keep current password" : "At least 8 characters"
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(value: Role) => setForm({ ...form, role: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin — full access</SelectItem>
                  <SelectItem value="author">Author — manages their own posts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving…" : editingUser ? "Save Changes" : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete "{userToDelete?.name}"?</DialogTitle>
            <DialogDescription>
              This can't be undone. Users who still have posts assigned to them can't be
              deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteUser.isPending}>
              {deleteUser.isPending ? "Deleting…" : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
