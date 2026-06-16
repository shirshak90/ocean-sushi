"use client"

import { useState } from "react"
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
import { LoginSchema, CustomerRegisterSchema } from "@workspace/shared/schemas"
import type {
  LoginInput,
  CustomerRegisterInput,
} from "@workspace/shared/schemas"
import { zodFormOptions } from "@workspace/shared/forms"
import { registerCustomer } from "@/lib/actions/customer-auth"

type Tab = "signin" | "register"

export function AuthGate() {
  const [tab, setTab] = useState<Tab>("signin")

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="mb-1 text-xs tracking-[0.3em] text-primary uppercase">
        Required for delivery
      </p>
      <h3 className="mb-4 font-heading text-lg">Sign in to continue</h3>

      {/* Tab switcher */}
      <div className="mb-6 flex rounded-lg border border-border p-1">
        <button
          type="button"
          onClick={() => setTab("signin")}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            tab === "signin"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            tab === "register"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Create Account
        </button>
      </div>

      {tab === "signin" ? <SignInForm /> : <RegisterForm />}

      <p className="mt-4 text-center text-xs text-muted-foreground">
        {tab === "signin" ? (
          <>
            No account?{" "}
            <button
              type="button"
              onClick={() => setTab("register")}
              className="text-primary underline-offset-4 hover:underline"
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setTab("signin")}
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  )
}

function SignInForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginInput>({
    ...zodFormOptions,
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  })

  const { errors } = form.formState

  async function onSubmit(data: LoginInput) {
    setLoading(true)
    setServerError(null)
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setServerError("Invalid email or password.")
    }
    // On success, useSession in the parent will react automatically
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {serverError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <Field label="Email" error={errors.email?.message}>
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

      <Field label="Password" error={errors.password?.message}>
        <div className="relative">
          <InputGroup>
            <InputGroupInput
              {...form.register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  )
}

function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
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

    // Auto sign-in
    await signIn("credentials", {
      email: result.email,
      password: result.password,
      redirect: false,
    })

    setLoading(false)
    setSuccess(true)
    // useSession in parent will pick up the new session automatically
  }

  if (success) {
    return (
      <div className="rounded-lg border border-primary/30 bg-primary/10 p-4 text-center text-sm text-primary">
        Account created! You are now signed in.
      </div>
    )
  }

  return (
    <form
      noValidate
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
    >
      {serverError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
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

      <Field label="Confirm Password *" error={errors.confirmPassword?.message}>
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

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account…" : "Create Account"}
      </Button>
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
    <FormFieldRoot data-invalid={!!error} className={cn(className)}>
      <FieldLabel className="text-xs tracking-wide text-muted-foreground">
        {label}
      </FieldLabel>
      {children}
      <FieldError>{error}</FieldError>
    </FormFieldRoot>
  )
}
