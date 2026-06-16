"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Settings2, Pencil, Trash2, Plus, Check, X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { MenuCategorySchema } from "@workspace/shared/schemas"
import type { MenuCategoryInput } from "@workspace/shared/schemas"
import { zodFormOptions } from "@workspace/shared/forms"
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/actions/menu"

interface Category {
  id: string
  name: string
  sortOrder: number
}

export function CategoryActions({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setOpen(true)}
      >
        <Settings2 className="size-4" />
        Manage Categories
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[80vh] max-w-md overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-light">
              Manage Categories
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-1 pt-1">
            {categories.map((cat) => (
              <CategoryRow key={cat.id} category={cat} />
            ))}
          </div>

          <div className="border-t border-border pt-4">
            <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Add Category
            </p>
            <AddCategoryForm />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CategoryRow({ category }: { category: Category }) {
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<MenuCategoryInput>({
    ...zodFormOptions,
    resolver: zodResolver(MenuCategorySchema),
    defaultValues: { name: category.name },
  })

  function onSave(data: MenuCategoryInput) {
    setError(null)
    startTransition(async () => {
      const result = await updateCategory(category.id, data)
      if (!result.success) {
        setError(result.error ?? "Failed to update")
      } else {
        setEditing(false)
      }
    })
  }

  function onDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteCategory(category.id)
      if (!result.success) setError(result.error ?? "Failed to delete")
    })
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-1 rounded-md border border-primary/30 bg-muted/30 p-2">
        <form
          noValidate
          onSubmit={form.handleSubmit(onSave)}
          className="flex items-center gap-2"
        >
          <InputGroup className="flex-1">
            <InputGroupInput
              {...form.register("name")}
              autoFocus
              placeholder="Category name"
              aria-invalid={!!form.formState.errors.name}
            />
          </InputGroup>
          <button
            type="submit"
            disabled={isPending}
            className="rounded border border-border p-1.5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
            aria-label="Save"
          >
            <Check className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false)
              setError(null)
              form.reset()
            }}
            className="rounded border border-border p-1.5 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
            aria-label="Cancel"
          >
            <X className="size-3.5" />
          </button>
        </form>
        {(form.formState.errors.name || error) && (
          <p className="px-1 text-xs text-destructive">
            {form.formState.errors.name?.message ?? error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-muted/30">
        <span className="text-sm">{category.name}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded border border-border p-1.5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            aria-label="Rename"
          >
            <Pencil className="size-3" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isPending}
            className="rounded border border-border p-1.5 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive disabled:opacity-50"
            aria-label="Delete"
          >
            <Trash2 className="size-3" />
          </button>
        </div>
      </div>
      {error && <p className="px-2 pb-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}

function AddCategoryForm() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<MenuCategoryInput>({
    ...zodFormOptions,
    resolver: zodResolver(MenuCategorySchema),
    defaultValues: { name: "" },
  })

  function onSubmit(data: MenuCategoryInput) {
    setError(null)
    startTransition(async () => {
      const result = await createCategory(data)
      if (!result.success) {
        setError(result.error ?? "Failed to create")
      } else {
        form.reset()
      }
    })
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-2"
    >
      <Field data-invalid={!!form.formState.errors.name || !!error}>
        <FieldLabel className="text-xs tracking-wide text-muted-foreground">
          Category Name *
        </FieldLabel>
        <div className="flex gap-2">
          <InputGroup className="flex-1">
            <InputGroupInput
              {...form.register("name")}
              placeholder="e.g. Omakase, Soups…"
              aria-invalid={!!form.formState.errors.name}
            />
          </InputGroup>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="shrink-0 gap-1.5"
          >
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
        <FieldError>{form.formState.errors.name?.message ?? error}</FieldError>
      </Field>
    </form>
  )
}
