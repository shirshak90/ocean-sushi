import type { Metadata } from "next"
import { AdminLink } from "@/components/admin-link"
import { db, reservations as reservationsTable } from "@workspace/db"
import { eq, asc, sql } from "drizzle-orm"
import { formatDate } from "@workspace/shared/utils"
import { RESERVATION_STATUS_CONFIG } from "@workspace/shared/types"
import type { ReservationStatus } from "@workspace/shared/types"
import { ReservationStatusUpdater } from "@/components/reservations/reservation-status-updater"
import { Pagination } from "@/components/pagination"

export const metadata: Metadata = { title: "Reservations" }

const PAGE_SIZE = 20

const TABS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
]

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { status, page: pageParam } = await searchParams
  const activeStatus = status && status !== "all" ? status : undefined
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const whereClause = activeStatus
    ? eq(reservationsTable.status, activeStatus as ReservationStatus)
    : undefined

  const [[countRow], reservations] = await Promise.all([
    whereClause
      ? db
          .select({ total: sql<number>`count(*)::int` })
          .from(reservationsTable)
          .where(whereClause)
      : db
          .select({ total: sql<number>`count(*)::int` })
          .from(reservationsTable),
    whereClause
      ? db
          .select()
          .from(reservationsTable)
          .where(whereClause)
          .orderBy(asc(reservationsTable.date), asc(reservationsTable.time))
          .limit(PAGE_SIZE)
          .offset(offset)
      : db
          .select()
          .from(reservationsTable)
          .orderBy(asc(reservationsTable.date), asc(reservationsTable.time))
          .limit(PAGE_SIZE)
          .offset(offset),
  ])

  const total = countRow?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const paginationParams: Record<string, string> = activeStatus
    ? { status: activeStatus }
    : {}

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-light">Reservations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} reservation{total !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const current = status ?? "all"
          const active = tab.value === current
          return (
            <AdminLink
              key={tab.value}
              href={`/reservations?status=${tab.value}`}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {tab.label}
            </AdminLink>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Guests</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reservations.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No reservations found.
                  </td>
                </tr>
              )}
              {reservations.map((r) => {
                const cfg =
                  RESERVATION_STATUS_CONFIG[r.status as ReservationStatus]
                return (
                  <tr key={r.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.email}</p>
                      <p className="text-xs text-muted-foreground">{r.phone}</p>
                    </td>
                    <td className="px-4 py-3">{formatDate(r.date)}</td>
                    <td className="px-4 py-3">{r.time}</td>
                    <td className="px-4 py-3">{r.guests}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="max-w-[180px] px-4 py-3">
                      <p className="truncate text-xs text-muted-foreground">
                        {r.notes ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <ReservationStatusUpdater
                        reservationId={r.id}
                        currentStatus={r.status as ReservationStatus}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          baseHref="/reservations"
          params={paginationParams}
        />
      </div>
    </div>
  )
}
