"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { formatPrice } from "@workspace/shared/utils"
import { DIETARY_TAG_CONFIG } from "@workspace/shared/types"
import type { DietaryTag } from "@workspace/shared/types"

interface Item {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  tags: DietaryTag[]
  featured: boolean
  category: { name: string; slug: string }
}

export function FeaturedDishes({ items }: { items: Item[] }) {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs tracking-[0.4em] text-primary uppercase">
            Chef&apos;s Selections
          </p>
          <h2 className="font-heading text-4xl font-light md:text-5xl">
            Featured Dishes
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <FeaturedCard item={item} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <Button variant="outline" asChild>
            <Link href="/menu" className="gap-2">
              View Full Menu <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

function FeaturedCard({ item }: { item: Item }) {
  const price = item.price

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-300 hover:border-primary/40">
      {/* Image area */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
            <span className="font-heading text-4xl text-primary/30">海</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              {item.category.name}
            </p>
            <h3 className="mt-0.5 font-heading text-xl font-medium">
              {item.name}
            </h3>
          </div>
          <span className="shrink-0 font-heading text-lg text-primary">
            {formatPrice(price)}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => {
              const cfg = DIETARY_TAG_CONFIG[tag]
              return (
                <span
                  key={tag}
                  className={`rounded border px-2 py-0.5 text-[10px] tracking-wide ${cfg.color}`}
                >
                  {cfg.label}
                </span>
              )
            })}
          </div>
        )}

        <div className="mt-auto pt-1">
          <Button size="sm" variant="outline" asChild className="w-full">
            <Link href="/order">Add to Order</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
