"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@workspace/ui/lib/utils"
import { formatPrice } from "@workspace/shared/utils"
import { DIETARY_TAG_CONFIG } from "@workspace/shared/types"
import type { DietaryTag } from "@workspace/shared/types"
import { ShoppingBag, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { useCartStore } from "@/stores/cart"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  available: boolean
  tags: DietaryTag[]
  sortOrder: number
}

interface Category {
  id: string
  name: string
  slug: string
  sortOrder: number
  items: MenuItem[]
}

export function MenuBook({ categories }: { categories: Category[] }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "")
  const [direction, setDirection] = useState(1)
  const addItem = useCartStore((s) => s.addItem)

  const active = categories.find((c) => c.slug === activeSlug)

  function switchCategory(slug: string) {
    const currentIdx = categories.findIndex((c) => c.slug === activeSlug)
    const nextIdx = categories.findIndex((c) => c.slug === slug)
    setDirection(nextIdx > currentIdx ? 1 : -1)
    setActiveSlug(slug)
  }

  const variants = {
    enter: (d: number) => ({
      rotateY: d > 0 ? 25 : -25,
      opacity: 0,
      x: d > 0 ? 60 : -60,
      transformPerspective: 1200,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      x: 0,
      transformPerspective: 1200,
    },
    exit: (d: number) => ({
      rotateY: d > 0 ? -25 : 25,
      opacity: 0,
      x: d > 0 ? -60 : 60,
      transformPerspective: 1200,
    }),
  }

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Category sidebar — "book spine" */}
        <aside className="shrink-0 lg:w-56">
          <div className="sticky top-24 overflow-hidden rounded-lg border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                Menu
              </p>
            </div>
            <nav className="flex flex-row flex-wrap gap-1 p-2 lg:flex-col lg:gap-0 lg:p-0">
              {categories.map((cat, i) => (
                <button
                  key={cat.slug}
                  onClick={() => switchCategory(cat.slug)}
                  className={cn(
                    "group flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors",
                    "rounded lg:rounded-none",
                    i < categories.length - 1
                      ? "lg:border-b lg:border-border"
                      : "",
                    activeSlug === cat.slug
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                  )}
                >
                  <span className="tracking-wide">{cat.name}</span>
                  <ChevronRight
                    className={cn(
                      "hidden size-3.5 transition-transform lg:block",
                      activeSlug === cat.slug
                        ? "translate-x-0.5 text-primary"
                        : "opacity-0"
                    )}
                  />
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Page content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeSlug}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {active && (
                <>
                  <div className="mb-8 flex items-end justify-between border-b border-border pb-6">
                    <div>
                      <h2 className="font-heading text-3xl font-light md:text-4xl">
                        {active.name}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {active.items.length}{" "}
                        {active.items.length === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <Button size="sm" asChild>
                      <Link href="/order" className="gap-2">
                        <ShoppingBag className="size-4" />
                        Order Now
                      </Link>
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {active.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onAdd={() =>
                          addItem({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                          })
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd: () => void }) {
  return (
    <div className="group flex gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/30">
      {/* Image */}
      <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-900 to-stone-800">
            <span className="font-heading text-2xl text-primary/20">海</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-1.5 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <h3 className="leading-snug font-medium">{item.name}</h3>
          <span className="shrink-0 text-sm font-medium text-primary">
            {formatPrice(item.price)}
          </span>
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.slice(0, 2).map((tag) => {
                const cfg = DIETARY_TAG_CONFIG[tag]
                return (
                  <span
                    key={tag}
                    className={`rounded border px-1.5 py-0.5 text-[9px] tracking-wide ${cfg.color}`}
                  >
                    {cfg.label}
                  </span>
                )
              })}
            </div>
          )}
          <button
            onClick={onAdd}
            disabled={!item.available}
            className={cn(
              "ml-auto shrink-0 rounded border px-2.5 py-1 text-xs tracking-wide transition-colors",
              item.available
                ? "border-primary/40 text-primary hover:bg-primary/10"
                : "cursor-not-allowed border-border text-muted-foreground"
            )}
          >
            {item.available ? "+ Add" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  )
}
