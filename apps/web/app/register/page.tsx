"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Field as FormFieldRoot,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { cn } from "@workspace/ui/lib/utils"
import { CustomerRegisterSchema } from "@workspace/shared/schemas"
import type { CustomerRegisterInput } from "@workspace/shared/schemas"
import { zodFormOptions } from "@workspace/shared/forms"
import { registerCustomer } from "@/lib/actions/customer-auth"

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const form = useForm<CustomerRegisterInput>({
    ...zodFormOptions,
    resolver: zodResolver(CustomerRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const { errors } = form.formState

  async function onSubmit(data: CustomerRegisterInput) {
    setLoading(true)
    setServerError(null)

    const result = await registerCustomer(data)
    if (!result.success) {
      setLoading(false)
      setServerError(result.error)
      return
    }

    // Auto sign-in after registration
    const signInResult = await signIn("credentials", {
      email: result.email,
      password: result.password,
      redirect: false,
    })

    setLoading(false)

    if (signInResult?.error) {
      // Registration succeeded but auto-login failed — redirect to login
      router.push("/login")
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block">
            <span className="font-heading text-2xl font-semibold tracking-widest text-primary">
              海 OCEAN SUSHI
            </span>
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your account
          </p>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-card p-8">
          {serverError && (
            <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name *" error={errors.firstName?.message}>
                <InputGroup>
                  <InputGroupInput
                    {...form.register("firstName")}
                    placeholder="Kenji"
                    autoComplete="given-name"
                    aria-invalid={!!errors.firstName}
                  />
                </InputGroup>
              </Field>
              <Field label="Last Name *" error={errors.lastName?.message}>
                <InputGroup>
                  <InputGroupInput
                    {...form.register("lastName")}
                    placeholder="Tanaka"
                    autoComplete="family-name"
                    aria-invalid={!!errors.lastName}
                  />
                </InputGroup>
              </Field>
            </div>

            <Field label="Email *" error={errors.email?.message}>
              <InputGroup>
                <InputGroupInput
                  {...form.register("email")}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                />
              </InputGroup>
            </Field>

            <Field label="Phone *" error={errors.phone?.message}>
              <InputGroup>
                <InputGroupInput
                  {...form.register("phone")}
                  type="tel"
                  placeholder="+1 (212) 555-0198"
                  autoComplete="tel"
                  aria-invalid={!!errors.phone}
                />
              </InputGroup>
            </Field>

            <Field label="Password *" error={errors.password?.message}>
              <div className="relative">
                <InputGroup>
                  <InputGroupInput
                    {...form.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                    className="pr-10"
                  />
                </InputGroup>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </Field>

            <Field
              label="Confirm Password *"
              error={errors.confirmPassword?.message}
            >
              <div className="relative">
                <InputGroup>
                  <InputGroupInput
                    {...form.register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirmPassword}
                    className="pr-10"
                  />
                </InputGroup>
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </Field>

            <Button type="submit" className="mt-1 w-full" disabled={loading}>
              {loading ? "Creating account…" : "Create Account"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
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
    <FormFieldRoot data-invalid={!!error} className={cn(className)}>
      <FieldLabel className="text-xs tracking-wide text-muted-foreground">
        {label}
      </FieldLabel>
      {children}
      <FieldError>{error}</FieldError>
    </FormFieldRoot>
  )
}
