"use client"

import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import { formatTime } from "@workspace/shared/utils"
import { DAY_LABELS } from "@workspace/shared/types"
import type { DayOfWeek } from "@workspace/shared/types"

interface Hour {
  dayOfWeek: DayOfWeek
  openTime: string
  closeTime: string
  isClosed: boolean
}

export function OpeningHoursSection({ hours }: { hours: Hour[] }) {
  const sorted = [...hours].sort((a, b) => {
    const order: DayOfWeek[] = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ]
    return order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek)
  })

  const today = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase() as DayOfWeek

  return (
    <section className="relative overflow-hidden bg-card py-24">
      <div className="mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border border-primary/30">
            <Clock className="size-5 text-primary" />
          </div>
          <p className="mb-3 text-xs tracking-[0.4em] text-primary uppercase">
            When to visit
          </p>
          <h2 className="font-heading text-4xl font-light md:text-5xl">
            Opening Hours
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="overflow-hidden rounded-lg border border-border"
        >
          {sorted.length === 0
            ? fallbackHours.map((h, i) => (
                <HourRow
                  key={h.day}
                  day={h.day}
                  time={h.time}
                  isToday={false}
                  isLast={i === fallbackHours.length - 1}
                />
              ))
            : sorted.map((h, i) => (
                <HourRow
                  key={h.dayOfWeek}
                  day={DAY_LABELS[h.dayOfWeek]}
                  time={
                    h.isClosed
                      ? "Closed"
                      : `${formatTime(h.openTime)} – ${formatTime(h.closeTime)}`
                  }
                  isToday={h.dayOfWeek === today}
                  isLast={i === sorted.length - 1}
                />
              ))}
        </motion.div>
      </div>
    </section>
  )
}

function HourRow({
  day,
  time,
  isToday,
  isLast,
}: {
  day: string
  time: string
  isToday: boolean
  isLast: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-3.5 text-sm transition-colors ${isToday ? "bg-primary/10" : "hover:bg-muted/40"} ${!isLast ? "border-b border-border" : ""}`}
    >
      <span
        className={
          isToday ? "font-medium text-primary" : "text-muted-foreground"
        }
      >
        {day}
        {isToday && (
          <span className="ml-2 rounded bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
            Today
          </span>
        )}
      </span>
      <span className={isToday ? "text-foreground" : "text-muted-foreground"}>
        {time}
      </span>
    </div>
  )
}

const fallbackHours = [
  { day: "Monday", time: "11:30 AM – 10:00 PM" },
  { day: "Tuesday", time: "11:30 AM – 10:00 PM" },
  { day: "Wednesday", time: "11:30 AM – 10:00 PM" },
  { day: "Thursday", time: "11:30 AM – 10:00 PM" },
  { day: "Friday", time: "11:30 AM – 11:00 PM" },
  { day: "Saturday", time: "12:00 PM – 11:00 PM" },
  { day: "Sunday", time: "12:00 PM – 9:00 PM" },
]
