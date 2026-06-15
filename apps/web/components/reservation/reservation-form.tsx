"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, CalendarDays, Clock, Users } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { cn } from "@workspace/ui/lib/utils"
import { ReservationSchema } from "@workspace/shared/schemas"
import type { ReservationInput } from "@workspace/shared/schemas"
import { RESERVATION_TIME_SLOTS } from "@workspace/shared/types"
import { createReservation } from "@/lib/actions/reservation"

export function ReservationForm() {
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ReservationInput>({
    resolver: zodResolver(ReservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      guests: 2,
      notes: "",
    },
  })

  async function onSubmit(data: ReservationInput) {
    setServerError(null)
    const result = await createReservation(data)
    if (!result.success) {
      setServerError(result.error)
      return
    }
    setDone(true)
  }

  const today = new Date().toISOString().split("T")[0]

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 rounded-lg border border-primary/30 bg-card p-10 text-center"
      >
        <div className="flex size-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
          <CheckCircle className="size-8 text-primary" />
        </div>
        <div>
          <h3 className="mb-2 font-heading text-2xl font-light">
            Reservation Received
          </h3>
          <p className="text-muted-foreground">
            Thank you! We have received your reservation request and will
            confirm it within 24 hours. We look forward to welcoming you.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setDone(false)
            form.reset()
          }}
        >
          Make another reservation
        </Button>
      </motion.div>
    )
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-lg border border-border bg-card p-8"
    >
      {serverError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full Name *" error={form.formState.errors.name?.message}>
          <Input {...form.register("name")} placeholder="Your full name" />
        </Field>
        <Field label="Email *" error={form.formState.errors.email?.message}>
          <Input
            {...form.register("email")}
            type="email"
            placeholder="you@example.com"
          />
        </Field>
        <Field
          label="Phone *"
          error={form.formState.errors.phone?.message}
          className="sm:col-span-2"
        >
          <Input {...form.register("phone")} placeholder="+1 (212) 555-0198" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Date *" error={form.formState.errors.date?.message}>
          <div className="relative">
            <CalendarDays className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...form.register("date")}
              type="date"
              min={today}
              className="pl-9"
            />
          </div>
        </Field>

        <Field label="Time *" error={form.formState.errors.time?.message}>
          <div className="relative">
            <Clock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <select
              {...form.register("time")}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-input px-9 py-2 text-sm",
                "placeholder:text-muted-foreground focus:ring-1 focus:ring-ring focus:outline-none",
                "appearance-none"
              )}
            >
              <option value="">Select time</option>
              {RESERVATION_TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </Field>

        <Field label="Guests *" error={form.formState.errors.guests?.message}>
          <div className="relative">
            <Users className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...form.register("guests", { valueAsNumber: true })}
              type="number"
              min={1}
              max={20}
              placeholder="2"
              className="pl-9"
            />
          </div>
        </Field>
      </div>

      <Field
        label="Special Requests (optional)"
        error={form.formState.errors.notes?.message}
      >
        <Textarea
          {...form.register("notes")}
          placeholder="Dietary requirements, special occasions, seating preferences…"
          rows={4}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={form.formState.isSubmitting}
        className="w-full tracking-widest"
      >
        {form.formState.isSubmitting ? "Sending…" : "Request Reservation"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Reservations are confirmed within 24 hours via email.
      </p>
    </form>
  )
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-xs tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
