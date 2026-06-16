"use client"

import { motion } from "framer-motion"

export function ChefSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-primary/20 bg-card">
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100">
                <div className="text-center">
                  <p className="font-heading text-7xl text-primary/20">職人</p>
                  <p className="mt-2 text-xs tracking-[0.3em] text-muted-foreground">
                    ARTISAN
                  </p>
                </div>
              </div>
              {/* Gold frame accent */}
              <div className="absolute inset-0 border border-primary/10" />
            </div>
            {/* Offset accent block */}
            <div className="absolute -right-4 -bottom-4 -z-10 h-full w-full rounded-lg border border-primary/10 bg-card" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-xs tracking-[0.4em] text-primary uppercase">
              Meet the chef
            </p>
            <h2 className="mb-6 font-heading text-4xl font-light md:text-5xl">
              Mastery Through
              <span className="block text-primary italic">
                Decades of Craft
              </span>
            </h2>
            <div className="mb-6 h-px w-16 bg-gradient-to-r from-primary to-transparent" />
            <p className="mb-4 leading-relaxed text-muted-foreground">
              Chef Kenji Tanaka brings over twenty years of training from Osaka
              and Tokyo to every plate. Apprenticed under a three-Michelin-star
              master, he combines strict Japanese tradition with a deep respect
              for the finest seasonal ingredients.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              &ldquo;Every piece of sushi is a conversation between the fish,
              the rice, and the hands that shaped them. We do not rush that
              conversation.&rdquo;
            </p>
            <p className="mt-4 font-heading text-sm text-primary italic">
              — Chef Kenji Tanaka
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {[
                { value: "20+", label: "Years Experience" },
                { value: "3", label: "Michelin Stars" },
                { value: "200+", label: "Seasonal Dishes" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-heading text-3xl text-primary">{value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
