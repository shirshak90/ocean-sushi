"use client"

import { useState, useTransition } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@workspace/ui/components/toggle-group"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
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
          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.name}>
              <FieldLabel className="text-xs tracking-wide text-muted-foreground">
                Name *
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...form.register("name")}
                  placeholder="Dragon Roll"
                  aria-invalid={!!form.formState.errors.name}
                />
              </InputGroup>
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

            <Field data-invalid={!!form.formState.errors.description}>
              <FieldLabel className="text-xs tracking-wide text-muted-foreground">
                Description *
              </FieldLabel>
              <Textarea
                {...form.register("description")}
                rows={2}
                placeholder="Fresh ingredients…"
                aria-invalid={!!form.formState.errors.description}
              />
              <FieldError>
                {form.formState.errors.description?.message}
              </FieldError>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!form.formState.errors.price}>
                <FieldLabel className="text-xs tracking-wide text-muted-foreground">
                  Price *
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...form.register("price", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="12.00"
                    aria-invalid={!!form.formState.errors.price}
                  />
                </InputGroup>
                <FieldError>{form.formState.errors.price?.message}</FieldError>
              </Field>

              <Field data-invalid={!!form.formState.errors.categoryId}>
                <FieldLabel className="text-xs tracking-wide text-muted-foreground">
                  Category *
                </FieldLabel>
                <Controller
                  name="categoryId"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={!!form.formState.errors.categoryId}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>
                  {form.formState.errors.categoryId?.message}
                </FieldError>
              </Field>
            </div>

            <Field>
              <FieldLabel className="text-xs tracking-wide text-muted-foreground">
                Image URL (optional)
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  {...form.register("image")}
                  type="url"
                  placeholder="https://…"
                />
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel className="text-xs tracking-wide text-muted-foreground">
                Dietary Tags
              </FieldLabel>
              <Controller
                name="tags"
                control={form.control}
                render={({ field }) => (
                  <ToggleGroup
                    type="multiple"
                    variant="outline"
                    className="flex flex-wrap"
                    value={field.value ?? []}
                    onValueChange={(value) =>
                      field.onChange(value as DietaryTag[])
                    }
                  >
                    {TAGS.map((tag) => (
                      <ToggleGroupItem key={tag} value={tag}>
                        {TAG_LABELS[tag]}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                )}
              />
            </Field>

            <FieldSet>
              <FieldLegend variant="label">Visibility</FieldLegend>
              <div className="flex gap-4">
                <Controller
                  name="available"
                  control={form.control}
                  render={({ field }) => (
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel>Available</FieldLabel>
                    </Field>
                  )}
                />
                <Controller
                  name="featured"
                  control={form.control}
                  render={({ field }) => (
                    <Field orientation="horizontal">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FieldLabel>Featured</FieldLabel>
                    </Field>
                  )}
                />
              </div>
            </FieldSet>
          </FieldGroup>

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
