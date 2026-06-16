import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminSidebar } from "@/components/admin-sidebar"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user?.role) redirect("/login")

  return (
    <div className="flex h-screen overflow-hidden bg-background print:block print:h-auto print:overflow-visible">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6 print:hidden">
          <div />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">
                {session.user.name ?? session.user.email}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {session.user.role.toLowerCase()}
              </p>
            </div>
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
              {(session.user.name ?? session.user.email)
                .charAt(0)
                .toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 print:overflow-visible">
          {children}
        </main>
      </div>
    </div>
  )
}
