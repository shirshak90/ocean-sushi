import type { Metadata } from "next"
import { AdminLink } from "@/components/admin-link"
import {
  ShoppingBag,
  CalendarDays,
  TrendingUp,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
import { db, orders, reservations, contactMessages } from "@workspace/db"
import { eq, inArray, gte, count, sum, desc, and } from "drizzle-orm"
import { formatPrice, formatDateTime } from "@workspace/shared/utils"
import { ORDER_STATUS_CONFIG } from "@workspace/shared/types"

export const metadata: Metadata = { title: "Dashboard" }

async function getStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [
    [totalOrdersRow],
    [activeOrdersRow],
    [todayReservationsRow],
    [pendingMessagesRow],
    recentOrders,
    [revenueRow],
  ] = await Promise.all([
    db.select({ value: count() }).from(orders),
    db
      .select({ value: count() })
      .from(orders)
      .where(
        inArray(orders.status, ["PENDING", "CONFIRMED", "PREPARING", "READY"])
      ),
    db
      .select({ value: count() })
      .from(reservations)
      .where(
        and(
          gte(reservations.date, today),
          inArray(reservations.status, ["PENDING", "CONFIRMED"])
        )
      ),
    db
      .select({ value: count() })
      .from(contactMessages)
      .where(
        and(
          eq(contactMessages.isRead, false),
          eq(contactMessages.isArchived, false)
        )
      ),
    db.query.orders.findMany({
      limit: 8,
      orderBy: (t, { desc }) => [desc(t.createdAt)],
      with: {
        customer: { columns: { firstName: true, lastName: true } },
      },
    }),
    db
      .select({ total: sum(orders.total) })
      .from(orders)
      .where(eq(orders.status, "COMPLETED")),
  ])

  return {
    totalOrders: totalOrdersRow?.value ?? 0,
    activeOrders: activeOrdersRow?.value ?? 0,
    todayReservations: todayReservationsRow?.value ?? 0,
    pendingMessages: pendingMessagesRow?.value ?? 0,
    recentOrders,
    revenue: parseFloat(revenueRow?.total ?? "0"),
  }
}

export default async function DashboardPage() {
  const {
    totalOrders,
    activeOrders,
    todayReservations,
    pendingMessages,
    recentOrders,
    revenue,
  } = await getStats()

  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      href: "/orders",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Active Orders",
      value: activeOrders,
      icon: AlertCircle,
      href: "/orders?status=active",
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Today's Reservations",
      value: todayReservations,
      icon: CalendarDays,
      href: "/reservations",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Revenue",
      value: formatPrice(revenue),
      icon: TrendingUp,
      href: "/orders",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-light">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back. Here is what is happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href, color, bg }) => (
          <AdminLink
            key={label}
            href={href}
            className="group flex items-center gap-4 rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${bg}`}
            >
              <Icon className={`size-5 ${color}`} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-xl font-semibold">{value}</p>
            </div>
          </AdminLink>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent orders */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-medium">Recent Orders</h2>
              <AdminLink
                href="/orders"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View all <ArrowRight className="size-3" />
              </AdminLink>
            </div>
            <div className="divide-y divide-border">
              {recentOrders.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No orders yet.
                </p>
              )}
              {recentOrders.map((order) => {
                const cfg = ORDER_STATUS_CONFIG[order.status]
                return (
                  <AdminLink
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-muted/30"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-sm font-medium text-primary">
                        {formatPrice(parseFloat(order.total))}
                      </span>
                    </div>
                  </AdminLink>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 font-medium">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              {[
                {
                  href: "/orders?status=PENDING",
                  label: "View Pending Orders",
                  icon: ShoppingBag,
                },
                {
                  href: "/reservations?status=PENDING",
                  label: "Pending Reservations",
                  icon: CalendarDays,
                },
                {
                  href: "/messages",
                  label: `Unread Messages (${pendingMessages})`,
                  icon: Clock,
                },
              ].map(({ href, label, icon: Icon }) => (
                <AdminLink
                  key={href}
                  href={href}
                  className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Icon className="size-4 text-primary" />
                  {label}
                </AdminLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
