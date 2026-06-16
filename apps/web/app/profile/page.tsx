import type { Metadata } from "next"
import { redirect } from "next/navigation"
import {
  User,
  Package,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { getCustomerProfile } from "@/lib/actions/customer-auth"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { CancelOrderButton } from "@/components/auth/cancel-order-button"
import {
  formatDate,
  formatDateTime,
  formatPrice,
} from "@workspace/shared/utils"
import {
  ORDER_STATUS_CONFIG,
  RESERVATION_STATUS_CONFIG,
} from "@workspace/shared/types"
import type { OrderStatus, ReservationStatus } from "@workspace/shared/types"

export const metadata: Metadata = { title: "My Profile" }

const CANCELLABLE_STATUSES = new Set(["PENDING", "CONFIRMED", "PREPARING"])

function buildHref(
  base: Record<string, string>,
  key: string,
  page: number
): string {
  const params = new URLSearchParams({ ...base, [key]: String(page) })
  return `/profile?${params.toString()}`
}

function Pagination({
  currentPage,
  totalPages,
  paramKey,
  otherParams,
}: {
  currentPage: number
  totalPages: number
  paramKey: string
  otherParams: Record<string, string>
}) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <span className="text-xs text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={buildHref(otherParams, paramKey, currentPage - 1)}
            className="flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            <ChevronLeft className="size-3" /> Prev
          </Link>
        ) : (
          <span className="flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs text-muted-foreground/40">
            <ChevronLeft className="size-3" /> Prev
          </span>
        )}
        {currentPage < totalPages ? (
          <Link
            href={buildHref(otherParams, paramKey, currentPage + 1)}
            className="flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            Next <ChevronRight className="size-3" />
          </Link>
        ) : (
          <span className="flex items-center gap-1 rounded border border-border px-2.5 py-1 text-xs text-muted-foreground/40">
            Next <ChevronRight className="size-3" />
          </span>
        )}
      </div>
    </div>
  )
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const session = await auth()
  if (!session?.user) redirect("/login?from=/profile")

  const params = await searchParams
  const orderPage = Math.max(1, parseInt(params.orderPage ?? "1", 10))
  const resPage = Math.max(1, parseInt(params.resPage ?? "1", 10))

  const data = await getCustomerProfile(session.user.id, { orderPage, resPage })
  if (!data) redirect("/login?from=/profile")

  const { customer, orders, reservations, orderCount, resCount, pageSize } =
    data
  const orderTotalPages = Math.ceil(orderCount / pageSize)
  const resTotalPages = Math.ceil(resCount / pageSize)

  // Shared params for building pagination hrefs (explicit type avoids union inference)
  const orderPaginationBase: Record<string, string> = {}
  if (resPage > 1) orderPaginationBase.resPage = String(resPage)
  const resPaginationBase: Record<string, string> = {}
  if (orderPage > 1) resPaginationBase.orderPage = String(orderPage)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Hero */}
        <section className="relative flex flex-col items-center justify-center gap-4 overflow-hidden py-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
          <div className="relative z-10">
            <p className="mb-3 text-xs tracking-[0.4em] text-primary uppercase">
              Member
            </p>
            <h1 className="font-heading text-5xl font-light tracking-wide md:text-6xl">
              My Profile
            </h1>
            <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </section>

        <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-24">
          {/* Account info */}
          <section className="rounded-xl border border-border bg-card p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
                  <User className="size-4 text-primary" />
                </div>
                <h2 className="font-heading text-lg">Account Details</h2>
              </div>
              <SignOutButton />
            </div>
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-xs tracking-wide text-muted-foreground uppercase">
                  Name
                </span>
                <span className="text-foreground">
                  {customer.firstName} {customer.lastName}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs tracking-wide text-muted-foreground uppercase">
                  Email
                </span>
                <span className="text-foreground">{customer.email}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs tracking-wide text-muted-foreground uppercase">
                  Phone
                </span>
                <span className="text-foreground">{customer.phone}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs tracking-wide text-muted-foreground uppercase">
                  Member Since
                </span>
                <span className="text-foreground">
                  {formatDate(customer.createdAt)}
                </span>
              </div>
            </div>
          </section>

          {/* Orders */}
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <Package className="size-4 text-primary" />
              </div>
              <h2 className="font-heading text-xl">Order History</h2>
              {orderCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {orderCount} total
                </span>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
                No orders yet.{" "}
                <Link
                  href="/order"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Browse the menu
                </Link>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Order #
                        </th>
                        <th className="px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Date
                        </th>
                        <th className="hidden px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:table-cell">
                          Items
                        </th>
                        <th className="px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Total
                        </th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, i) => {
                        const statusCfg =
                          ORDER_STATUS_CONFIG[order.status as OrderStatus]
                        const canCancel = CANCELLABLE_STATUSES.has(order.status)
                        return (
                          <tr
                            key={order.id}
                            className={
                              i < orders.length - 1
                                ? "border-b border-border"
                                : ""
                            }
                          >
                            <td className="px-4 py-3 font-mono text-xs text-primary">
                              {order.orderNumber}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {formatDateTime(order.createdAt)}
                            </td>
                            <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                              {order.orderItems
                                .map(
                                  (oi) => `${oi.menuItem.name} ×${oi.quantity}`
                                )
                                .join(", ")}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg?.color ?? ""}`}
                              >
                                {statusCfg?.label ?? order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-primary">
                              {formatPrice(order.total)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {canCancel && (
                                <CancelOrderButton orderId={order.id} />
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={orderPage}
                  totalPages={orderTotalPages}
                  paramKey="orderPage"
                  otherParams={orderPaginationBase}
                />
              </div>
            )}
          </section>

          {/* Reservations */}
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                <CalendarDays className="size-4 text-primary" />
              </div>
              <h2 className="font-heading text-xl">Reservations</h2>
              {resCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {resCount} total
                </span>
              )}
            </div>

            {reservations.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground">
                No reservations yet.{" "}
                <Link
                  href="/reservation"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Book a table
                </Link>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-left">
                        <th className="px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Time
                        </th>
                        <th className="px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Guests
                        </th>
                        <th className="px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                          Status
                        </th>
                        <th className="hidden px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:table-cell">
                          Booked On
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((res, i) => {
                        const statusCfg =
                          RESERVATION_STATUS_CONFIG[
                            res.status as ReservationStatus
                          ]
                        return (
                          <tr
                            key={res.id}
                            className={
                              i < reservations.length - 1
                                ? "border-b border-border"
                                : ""
                            }
                          >
                            <td className="px-4 py-3 text-foreground">
                              {formatDate(res.date)}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {res.time}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {res.guests}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg?.color ?? ""}`}
                              >
                                {statusCfg?.label ?? res.status}
                              </span>
                            </td>
                            <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                              {formatDateTime(res.createdAt)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  currentPage={resPage}
                  totalPages={resTotalPages}
                  paramKey="resPage"
                  otherParams={resPaginationBase}
                />
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
