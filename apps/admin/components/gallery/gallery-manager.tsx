"use client"

import { useState, useTransition } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
import { GalleryImageSchema } from "@workspace/shared/schemas"
import type { GalleryImageInput } from "@workspace/shared/schemas"
import { zodFormOptions } from "@workspace/shared/forms"
import {
  addGalleryImage,
  deleteGalleryImage,
} from "@/lib/actions/gallery"

interface GalleryImage {
  id: string
  url: string
  category: string
  title: string | null
}

const CATEGORIES = ["Food", "Restaurant", "Drinks", "Team"] as const

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<GalleryImageInput>({
    ...zodFormOptions,
    resolver: zodResolver(GalleryImageSchema),
    defaultValues: {
      url: "",
      category: "Food",
      title: "",
    },
  })

  const { errors, isSubmitting } = form.formState

  function onSubmit(data: GalleryImageInput) {
    startTransition(async () => {
      await addGalleryImage({
        url: data.url,
        category: data.category,
        title: data.title ?? "",
      })
      form.reset()
      setOpen(false)
    })
  }

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    items: images.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0)

  const uncategorised = images.filter((i) => !CATEGORIES.includes(i.category as (typeof CATEGORIES)[number]))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next)
            if (!next) form.reset()
          }}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="size-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="font-heading font-light">
                Add Image
              </DialogTitle>
            </DialogHeader>
            <form
              noValidate
              onSubmit={form.handleSubmit(onSubmit)}
              className="pt-2"
            >
              <FieldGroup>
                <Field data-invalid={!!errors.url}>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Image URL *
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...form.register("url")}
                      type="url"
                      placeholder="https://…"
                      aria-invalid={!!errors.url}
                    />
                  </InputGroup>
                  <FieldError>{errors.url?.message}</FieldError>
                </Field>
                <Field data-invalid={!!errors.category}>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Category
                  </FieldLabel>
                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-full"
                          aria-invalid={!!errors.category}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {CATEGORIES.map((c) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError>{errors.category?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Title (optional)
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      {...form.register("title")}
                      placeholder="Dragon Roll"
                    />
                  </InputGroup>
                </Field>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isPending || isSubmitting}
                  >
                    {isPending ? "Adding…" : "Add"}
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {[
        ...byCategory,
        ...(uncategorised.length > 0
          ? [{ cat: "Other", items: uncategorised }]
          : []),
      ].map(({ cat, items }) => (
        <div key={cat}>
          <div className="mb-3 flex items-center gap-3">
            <h2 className="font-heading text-lg">{cat}</h2>
            <div className="flex-1 border-t border-border" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {items.map((img) => (
              <div
                key={img.id}
                className="group relative overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="flex h-28 items-center justify-center bg-gradient-to-br from-stone-950 to-stone-900">
                  {img.url.startsWith("http") ? (
                    <img
                      src={img.url}
                      alt={img.title ?? img.category}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-heading text-3xl text-primary/20">
                      海
                    </span>
                  )}
                </div>
                {img.title && (
                  <p className="truncate px-2 py-1.5 text-xs text-muted-foreground">
                    {img.title}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteGalleryImage(img.id)
                    })
                  }
                  className="absolute top-1.5 right-1.5 hidden rounded bg-background/80 p-1 text-muted-foreground backdrop-blur-sm group-hover:flex hover:text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {images.length === 0 && (
        <div className="rounded-lg border border-border bg-card py-16 text-center text-muted-foreground">
          No images yet. Add your first image above.
        </div>
      )}
    </div>
  )
}
