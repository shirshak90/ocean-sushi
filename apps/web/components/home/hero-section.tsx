"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-stone-950 to-black" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.72 0.17 85 / 0.15) 0%, transparent 70%)`,
        }}
      />

      {/* Decorative gold lines */}
      <div className="absolute top-0 left-8 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-0 right-8 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

      {/* Japanese character watermark */}
      <div className="absolute top-1/2 right-12 -translate-y-1/2 select-none">
        <p
          className="font-heading text-[8rem] leading-none font-light text-white/[0.03] lg:text-[12rem]"
          aria-hidden
        >
          海
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-6 text-xs tracking-[0.5em] text-primary uppercase">
            Authentic Japanese Cuisine
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 font-heading text-6xl leading-none font-light tracking-wide md:text-8xl lg:text-9xl"
        >
          Ocean
          <span className="block text-primary italic">Sushi</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mx-auto mb-8 h-px w-32 origin-center bg-gradient-to-r from-transparent via-primary to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          Where tradition meets artistry. Experience the finest sushi crafted
          from seasonal ingredients in an atmosphere of pure luxury.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button size="lg" className="min-w-[160px] tracking-widest" asChild>
            <Link href="/reservation">Reserve a Table</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="min-w-[160px] tracking-widest"
            asChild
          >
            <Link href="/menu">Explore Menu</Link>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDown className="size-4" />
        </motion.div>
      </motion.div>
    </section>
  )
}
