"use client"

import { AdminLink } from "@/components/admin-link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  ImageIcon,
  Clock,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/orders", label: "Orders", icon: ShoppingBag },
  { href: "/reservations", label: "Reservations", icon: CalendarDays },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/opening-hours", label: "Opening Hours", icon: Clock },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar print:hidden">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <span className="font-heading text-lg tracking-widest text-primary">
          海 OCEAN
        </span>
        <span className="ml-2 text-[10px] tracking-[0.3em] text-muted-foreground">
          ADMIN
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <AdminLink
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              )}
            >
              <Icon
                className={cn("size-4 shrink-0", active ? "text-primary" : "")}
              />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="size-3 text-primary" />}
            </AdminLink>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-destructive"
        >
          <LogOut className="size-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
