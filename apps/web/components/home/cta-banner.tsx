"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@workspace/ui/components/button"

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-stone-950 to-black" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(ellipse 70% 50% at 50% 50%, oklch(0.72 0.17 85 / 0.12) 0%, transparent 70%)`,
        }}
      />

      {/* Watermark text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden select-none">
        <p
          className="font-heading text-[18vw] leading-none font-light text-white/[0.02]"
          aria-hidden
        >
          OCEAN SUSHI
        </p>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-xs tracking-[0.5em] text-primary uppercase">
            An experience awaits
          </p>
          <h2 className="mb-6 font-heading text-5xl leading-tight font-light md:text-7xl">
            Begin Your
            <span className="block text-primary italic">Culinary Journey</span>
          </h2>
          <div className="mx-auto mb-8 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
          <p className="mx-auto mb-10 max-w-md text-muted-foreground">
            Reserve your table for a dining experience unlike any other, or
            place an order and bring the taste of Ocean Sushi to your home.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="min-w-[180px] tracking-widest" asChild>
              <Link href="/reservation">Book a Table</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-[180px] tracking-widest"
              asChild
            >
              <Link href="/order">Order Online</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
