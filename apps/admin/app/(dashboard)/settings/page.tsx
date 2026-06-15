import type { Metadata } from "next"
import { auth } from "@/lib/auth"

export const metadata: Metadata = { title: "Settings" }

export default async function SettingsPage() {
  const session = await auth()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-light">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and preferences.
        </p>
      </div>

      <div className="max-w-lg rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 font-heading text-lg font-light">Account</h2>
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-medium">{session?.user.name ?? "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-3">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-medium">{session?.user.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Role</dt>
            <dd>
              <span
                className={`rounded px-2 py-0.5 text-xs ${session?.user.role === "ADMIN" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
              >
                {session?.user.role}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="max-w-lg rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 font-heading text-lg font-light">Database</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Connection details are configured via environment variables.
        </p>
        <div className="rounded border border-border bg-muted/30 p-3 font-mono text-xs text-muted-foreground">
          DATABASE_URL=postgresql://...
        </div>
      </div>

      <div className="max-w-lg rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 font-heading text-lg font-light">
          Default Admin Credentials
        </h2>
        <p className="text-sm text-muted-foreground">
          After running the seed, sign in with:
        </p>
        <div className="mt-3 rounded border border-border bg-muted/30 p-3 font-mono text-xs">
          <p>Email: admin@oceansushi.com</p>
          <p>Password: admin123</p>
        </div>
        <p className="mt-3 text-xs text-destructive">
          ⚠ Change the password after first login in production.
        </p>
      </div>
    </div>
  )
}
