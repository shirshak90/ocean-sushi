"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { Textarea } from "@workspace/ui/components/textarea"
import { ContactSchema } from "@workspace/shared/schemas"
import type { ContactInput } from "@workspace/shared/schemas"
import { zodFormOptions } from "@workspace/shared/forms"
import { sendContactMessage } from "@/lib/actions/contact"

export function ContactForm() {
  const [done, setDone] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<ContactInput>({
    ...zodFormOptions,
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", message: "" },
  })

  const { errors, isSubmitting } = form.formState

  async function onSubmit(data: ContactInput) {
    setServerError(null)
    const result = await sendContactMessage(data)
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
        <div className="flex size-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
          <CheckCircle className="size-7 text-primary" />
        </div>
        <div>
          <h3 className="mb-2 font-heading text-xl font-light">Message Sent</h3>
          <p className="text-sm text-muted-foreground">
            Thank you for reaching out. We will get back to you within 24 hours.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setDone(false)
            form.reset()
          }}
        >
          Send another message
        </Button>
      </motion.div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-5 rounded-lg border border-border bg-card p-8"
    >
      {serverError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel className="text-xs tracking-wide text-muted-foreground">
            Name *
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              {...form.register("name")}
              placeholder="Your full name"
              aria-invalid={!!errors.name}
            />
          </InputGroup>
          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel className="text-xs tracking-wide text-muted-foreground">
            Email *
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              {...form.register("email")}
              type="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
            />
          </InputGroup>
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field data-invalid={!!errors.message}>
          <FieldLabel className="text-xs tracking-wide text-muted-foreground">
            Message *
          </FieldLabel>
          <Textarea
            {...form.register("message")}
            placeholder="How can we help you?"
            rows={5}
            aria-invalid={!!errors.message}
          />
          <FieldError>{errors.message?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full tracking-widest"
      >
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  )
}
