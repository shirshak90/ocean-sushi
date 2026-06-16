"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

const placeholders = [
  {
    label: "Dragon Roll",
    category: "Food",
    span: "lg:col-span-2 lg:row-span-2",
  },
  { label: "Sashimi Plate", category: "Food", span: "" },
  { label: "Our Bar", category: "Restaurant", span: "" },
  { label: "Sake Selection", category: "Drinks", span: "lg:col-span-2" },
]

export function GalleryPreview() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row"
        >
          <div>
            <p className="mb-2 text-xs tracking-[0.4em] text-primary uppercase">
              Visual journey
            </p>
            <h2 className="font-heading text-4xl font-light">Gallery</h2>
            <div className="mt-3 h-px w-16 bg-gradient-to-r from-primary to-transparent" />
          </div>
          <Button variant="outline" asChild>
            <Link href="/gallery" className="gap-2">
              View All Photos <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {placeholders.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden rounded-lg border border-border bg-card ${item.span}`}
            >
              <div className="flex h-full min-h-40 items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100 transition-transform duration-500 group-hover:scale-105">
                <div className="text-center">
                  <p className="font-heading text-3xl text-primary/20">海</p>
                  <p className="mt-1 text-xs tracking-widest text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute bottom-3 left-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="rounded bg-background/80 px-2 py-0.5 text-xs text-muted-foreground backdrop-blur-sm">
                  {item.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
