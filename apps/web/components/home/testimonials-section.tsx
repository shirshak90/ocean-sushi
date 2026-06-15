"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Alexandra Chen",
    role: "Food Critic, Gourmet NY",
    body: "Ocean Sushi delivers an omakase experience that rivals anything I have tasted in Tokyo. The precision, the freshness, and the sheer artistry of each piece is extraordinary.",
    stars: 5,
  },
  {
    name: "Marco Rossi",
    role: "Regular Guest",
    body: "I have dined here over thirty times and it never fails to impress. The Dragon Roll is the finest I have ever had — the balance of flavors is just perfect.",
    stars: 5,
  },
  {
    name: "Sarah Williams",
    role: "Food & Travel Blogger",
    body: "The atmosphere, the service, and above all the food — everything about Ocean Sushi is a masterclass in Japanese hospitality. Truly a once-in-a-lifetime experience.",
    stars: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-card py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-xs tracking-[0.4em] text-primary uppercase">
            Guest experiences
          </p>
          <h2 className="font-heading text-4xl font-light md:text-5xl">
            What Our Guests Say
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col gap-4 rounded-lg border border-border bg-background p-6"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="size-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{t.body}&rdquo;
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
