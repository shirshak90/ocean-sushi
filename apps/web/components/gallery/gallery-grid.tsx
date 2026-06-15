"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ZoomIn } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

interface GalleryImage {
  id: string
  url: string
  category: string
  title: string | null
}

const CATEGORIES = ["All", "Food", "Restaurant", "Drinks", "Team"]

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null)

  const filtered =
    activeCategory === "All"
      ? images
      : images.filter((i) => i.category === activeCategory)

  // Use placeholder items if no DB images yet
  const displayItems =
    filtered.length > 0
      ? filtered
      : PLACEHOLDER_IMAGES.filter(
          (i) => activeCategory === "All" || i.category === activeCategory
        )

  return (
    <>
      {/* Category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs tracking-[0.15em] uppercase transition-colors",
              activeCategory === cat
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <motion.div
        layout
        className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
      >
        <AnimatePresence mode="popLayout">
          {displayItems.map((image, i) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group mb-4 break-inside-avoid overflow-hidden rounded-lg border border-border bg-card"
            >
              <button
                className="relative block w-full overflow-hidden"
                onClick={() => setLightbox(image)}
                aria-label={`View ${image.title ?? image.category}`}
              >
                {image.url.startsWith("/") ? (
                  <div
                    className={cn(
                      "flex items-center justify-center bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800",
                      i % 3 === 0 ? "h-64" : i % 3 === 1 ? "h-48" : "h-56"
                    )}
                  >
                    <div className="text-center">
                      <p className="font-heading text-4xl text-primary/20">
                        海
                      </p>
                      <p className="mt-1 text-xs tracking-widest text-muted-foreground">
                        {image.title ?? image.category}
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={image.url}
                    alt={image.title ?? image.category}
                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <ZoomIn className="size-8 text-white" />
                </div>
              </button>

              {image.title && (
                <div className="px-3 py-2">
                  <p className="text-xs text-muted-foreground">{image.title}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-h-[85vh] max-w-4xl overflow-hidden rounded-lg border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm hover:bg-black/80"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>

              {lightbox.url.startsWith("/") ? (
                <div className="flex h-96 w-full items-center justify-center bg-gradient-to-br from-stone-950 to-stone-900">
                  <div className="text-center">
                    <p className="font-heading text-8xl text-primary/20">海</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {lightbox.title ?? lightbox.category}
                    </p>
                  </div>
                </div>
              ) : (
                <img
                  src={lightbox.url}
                  alt={lightbox.title ?? lightbox.category}
                  className="max-h-[85vh] w-full object-contain"
                />
              )}

              {lightbox.title && (
                <div className="bg-card px-4 py-3">
                  <p className="text-sm font-medium">{lightbox.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {lightbox.category}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const PLACEHOLDER_IMAGES: GalleryImage[] = [
  {
    id: "p1",
    url: "/gallery/sushi-bar.jpg",
    category: "Restaurant",
    title: "Our Sushi Bar",
  },
  {
    id: "p2",
    url: "/gallery/dragon-roll.jpg",
    category: "Food",
    title: "Dragon Roll",
  },
  {
    id: "p3",
    url: "/gallery/interior.jpg",
    category: "Restaurant",
    title: "Main Dining Room",
  },
  {
    id: "p4",
    url: "/gallery/omakase.jpg",
    category: "Food",
    title: "Omakase Experience",
  },
  {
    id: "p5",
    url: "/gallery/sake.jpg",
    category: "Drinks",
    title: "Sake Selection",
  },
  {
    id: "p6",
    url: "/gallery/chef.jpg",
    category: "Team",
    title: "Chef at Work",
  },
  {
    id: "p7",
    url: "/gallery/nigiri.jpg",
    category: "Food",
    title: "Nigiri Platter",
  },
  {
    id: "p8",
    url: "/gallery/bar.jpg",
    category: "Drinks",
    title: "Cocktail Bar",
  },
]
