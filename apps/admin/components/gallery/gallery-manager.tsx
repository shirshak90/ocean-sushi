"use client"

import { useState, useTransition } from "react"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"
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

const CATEGORIES = ["Food", "Restaurant", "Drinks", "Team"]

export function GalleryManager({ images }: { images: GalleryImage[] }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [category, setCategory] = useState("Food")
  const [title, setTitle] = useState("")
  const [isPending, startTransition] = useTransition()

  function onAdd() {
    if (!url) return
    startTransition(async () => {
      await addGalleryImage({ url, category, title })
      setUrl("")
      setTitle("")
      setOpen(false)
    })
  }

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    items: images.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0)

  const uncategorised = images.filter((i) => !CATEGORIES.includes(i.category))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
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
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  Image URL *
                </Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  Category
                </Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-input px-3 py-2 text-sm focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">
                  Title (optional)
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Dragon Roll"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={onAdd}
                  disabled={isPending || !url}
                >
                  {isPending ? "Adding…" : "Add"}
                </Button>
              </div>
            </div>
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
