"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { CheckCircle, Users } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"
import { ReservationSchema } from "@workspace/shared/schemas"
import type { ReservationInput } from "@workspace/shared/schemas"
import { RESERVATION_TIME_SLOTS } from "@workspace/shared/types"
import { createReservation } from "@/lib/actions/reservation"
import { DatePicker } from "@workspace/ui/components/date-picker"

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

      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel className="text-xs tracking-wide text-muted-foreground">
              Full Name *
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                {...form.register("name")}
                placeholder="Your full name"
                aria-invalid={!!form.formState.errors.name}
              />
            </InputGroup>
            <FieldError>{form.formState.errors.name?.message}</FieldError>
          </Field>

          <Field data-invalid={!!form.formState.errors.email}>
            <FieldLabel className="text-xs tracking-wide text-muted-foreground">
              Email *
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                {...form.register("email")}
                type="email"
                placeholder="you@example.com"
                aria-invalid={!!form.formState.errors.email}
              />
            </InputGroup>
            <FieldError>{form.formState.errors.email?.message}</FieldError>
          </Field>

          <Field
            data-invalid={!!form.formState.errors.phone}
            className="sm:col-span-2"
          >
            <FieldLabel className="text-xs tracking-wide text-muted-foreground">
              Phone *
            </FieldLabel>
            <InputGroup>
              <InputGroupInput
                {...form.register("phone")}
                type="tel"
                placeholder="+1 (212) 555-0198"
                aria-invalid={!!form.formState.errors.phone}
              />
            </InputGroup>
            <FieldError>{form.formState.errors.phone?.message}</FieldError>
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field data-invalid={!!form.formState.errors.date}>
            <FieldLabel className="text-xs tracking-wide text-muted-foreground">
              Date *
            </FieldLabel>
            <Controller
              name="date"
              control={form.control}
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select date"
                  aria-invalid={!!form.formState.errors.date}
                />
              )}
            />
            <FieldError>{form.formState.errors.date?.message}</FieldError>
          </Field>

          <Field data-invalid={!!form.formState.errors.time}>
            <FieldLabel className="text-xs tracking-wide text-muted-foreground">
              Time *
            </FieldLabel>
            <Controller
              name="time"
              control={form.control}
              render={({ field }) => (
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!form.formState.errors.time}
                  >
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {RESERVATION_TIME_SLOTS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{form.formState.errors.time?.message}</FieldError>
          </Field>

          <Field data-invalid={!!form.formState.errors.guests}>
            <FieldLabel className="text-xs tracking-wide text-muted-foreground">
              Guests *
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <Users />
              </InputGroupAddon>
              <InputGroupInput
                {...form.register("guests", { valueAsNumber: true })}
                type="number"
                min={1}
                max={20}
                placeholder="2"
                aria-invalid={!!form.formState.errors.guests}
              />
            </InputGroup>
            <FieldError>{form.formState.errors.guests?.message}</FieldError>
          </Field>
        </div>

        <Field data-invalid={!!form.formState.errors.notes}>
          <FieldLabel className="text-xs tracking-wide text-muted-foreground">
            Special Requests (optional)
          </FieldLabel>
          <Textarea
            {...form.register("notes")}
            placeholder="Dietary requirements, special occasions, seating preferences…"
            rows={4}
            aria-invalid={!!form.formState.errors.notes}
          />
          <FieldError>{form.formState.errors.notes?.message}</FieldError>
        </Field>
      </FieldGroup>

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
