"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { Eye, EyeOff } from "lucide-react"
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
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { LoginSchema } from "@workspace/shared/schemas"
import type { LoginInput } from "@workspace/shared/schemas"

export default function LoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(data: LoginInput) {
    setServerError(null)
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      setServerError("Invalid email or password.")
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-heading text-3xl font-light tracking-widest text-primary">
            海 OCEAN
          </p>
          <p className="mt-1 text-xs tracking-[0.4em] text-muted-foreground">
            ADMIN DASHBOARD
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-8">
          <h1 className="mb-6 font-heading text-xl font-light">Sign in</h1>

          {serverError && (
            <div className="mb-4 rounded border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {serverError}
            </div>
          )}

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <Field data-invalid={!!form.formState.errors.email}>
                <FieldLabel className="text-xs tracking-wide text-muted-foreground">
                  Email
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...form.register("email")}
                    type="email"
                    placeholder="admin@oceansushi.com"
                    autoComplete="email"
                    aria-invalid={!!form.formState.errors.email}
                  />
                </InputGroup>
                <FieldError>{form.formState.errors.email?.message}</FieldError>
              </Field>

              <Field data-invalid={!!form.formState.errors.password}>
                <FieldLabel className="text-xs tracking-wide text-muted-foreground">
                  Password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...form.register("password")}
                    type={showPw ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={!!form.formState.errors.password}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? <EyeOff /> : <Eye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError>
                  {form.formState.errors.password?.message}
                </FieldError>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="mt-2 w-full tracking-widest"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Staff access only. Contact your administrator to reset your password.
        </p>
      </div>
    </div>
  )
}
