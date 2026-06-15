"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"
import { MenuItemSchema } from "@workspace/shared/schemas"
import type { MenuItemInput } from "@workspace/shared/schemas"
import type { DietaryTag } from "@workspace/shared/types"
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/lib/actions/menu"

interface Category {
  id: string
  name: string
}
interface Item {
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  image: string | null
  available: boolean
  featured: boolean
  tags: DietaryTag[]
}

const TAGS: DietaryTag[] = ["VEGETARIAN", "VEGAN", "GLUTEN_FREE", "SPICY"]
const TAG_LABELS: Record<DietaryTag, string> = {
  VEGETARIAN: "Vegetarian",
  VEGAN: "Vegan",
  GLUTEN_FREE: "Gluten Free",
  SPICY: "Spicy",
}

export function MenuItemActions({
  mode,
  item,
  categories,
}: {
  mode: "create" | "edit"
  item?: Item
  categories: Category[]
}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function onDelete() {
    if (!item) return
    startTransition(async () => {
      await deleteMenuItem(item.id)
    })
  }

  return (
    <div className="flex items-center gap-1">
      {mode === "create" ? (
        <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Add Item
        </Button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded border border-border p-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary"
        >
          <Pencil className="size-3.5" />
        </button>
      )}

      {open && (
        <MenuItemDialog
          mode={mode}
          item={item}
          categories={categories}
          open={open}
          onOpenChange={setOpen}
        />
      )}

      {mode === "edit" && (
        <button
          type="button"
          onClick={onDelete}
          disabled={isPending}
          className="rounded border border-border p-1.5 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive disabled:opacity-50"
          aria-label="Delete item"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  )
}

function MenuItemDialog({
  mode,
  item,
  categories,
  open,
  onOpenChange,
}: {
  mode: "create" | "edit"
  item?: Item
  categories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<MenuItemInput>({
    resolver: zodResolver(MenuItemSchema),
    defaultValues: item
      ? {
          name: item.name,
          description: item.description,
          price: item.price,
          categoryId: item.categoryId,
          image: item.image ?? "",
          available: item.available,
          featured: item.featured,
          tags: item.tags,
        }
      : {
          name: "",
          description: "",
          price: 0,
          categoryId: categories[0]?.id ?? "",
          available: true,
          featured: false,
          tags: [],
        },
  })

  function onSubmit(data: MenuItemInput) {
    startTransition(async () => {
      if (mode === "create") await createMenuItem(data)
      else if (item) await updateMenuItem(item.id, data)
      onOpenChange(false)
      form.reset()
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading font-light">
            {mode === "create" ? "Add Menu Item" : "Edit Menu Item"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 pt-2"
        >
          <F label="Name *" error={form.formState.errors.name?.message}>
            <Input {...form.register("name")} placeholder="Dragon Roll" />
          </F>
          <F
            label="Description *"
            error={form.formState.errors.description?.message}
          >
            <Textarea
              {...form.register("description")}
              rows={2}
              placeholder="Fresh ingredients…"
            />
          </F>
          <div className="grid grid-cols-2 gap-4">
            <F label="Price *" error={form.formState.errors.price?.message}>
              <Input
                {...form.register("price", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                placeholder="12.00"
              />
            </F>
            <F
              label="Category *"
              error={form.formState.errors.categoryId?.message}
            >
              <select
                {...form.register("categoryId")}
                className="flex h-10 w-full rounded-md border border-input bg-input px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </F>
          </div>
          <F label="Image URL (optional)">
            <Input {...form.register("image")} placeholder="https://…" />
          </F>
          <div>
            <p className="mb-2 text-xs tracking-wide text-muted-foreground">
              Dietary Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {TAGS.map((tag) => {
                const selected = (form.watch("tags") ?? []).includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const current = form.getValues("tags") ?? []
                      form.setValue(
                        "tags",
                        selected
                          ? current.filter((t) => t !== tag)
                          : [...current, tag]
                      )
                    }}
                    className={cn(
                      "rounded border px-2.5 py-1 text-xs transition-colors",
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-border/80"
                    )}
                  >
                    {TAG_LABELS[tag]}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...form.register("available")}
                className="accent-primary"
              />
              Available
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...form.register("featured")}
                className="accent-primary"
              />
              Featured
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function F({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
