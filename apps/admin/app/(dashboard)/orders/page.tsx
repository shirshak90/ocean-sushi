import type { Metadata } from "next"
import { AdminLink } from "@/components/admin-link"
import {
  db,
  orders as ordersTable,
  orderItems as orderItemsTable,
} from "@workspace/db"
import { eq, desc, sql, inArray } from "drizzle-orm"
import { formatPrice, formatDateTime } from "@workspace/shared/utils"
import { ORDER_STATUS_CONFIG } from "@workspace/shared/types"
import type { OrderStatus } from "@workspace/shared/types"
import { OrderStatusUpdater } from "@/components/orders/order-status-updater"
import { Pagination } from "@/components/pagination"

export const metadata: Metadata = { title: "Orders" }

const PAGE_SIZE = 20

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Preparing", value: "PREPARING" },
  { label: "Ready", value: "READY" },
  { label: "Out for Delivery", value: "OUT_FOR_DELIVERY" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
]

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>
}) {
  const { status, page: pageParam } = await searchParams
  const activeStatus = status && status !== "all" ? status : undefined
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)
  const offset = (page - 1) * PAGE_SIZE

  const whereClause = activeStatus
    ? eq(ordersTable.status, activeStatus as OrderStatus)
    : undefined

  const [[countRow], orders] = await Promise.all([
    whereClause
      ? db
          .select({ total: sql<number>`count(*)::int` })
          .from(ordersTable)
          .where(whereClause)
      : db.select({ total: sql<number>`count(*)::int` }).from(ordersTable),
    db.query.orders.findMany({
      where: whereClause,
      orderBy: (t, { desc }) => [desc(t.createdAt)],
      limit: PAGE_SIZE,
      offset,
      with: {
        customer: { columns: { firstName: true, lastName: true, email: true } },
      },
    }),
  ])

  const total = countRow?.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const paginationParams: Record<string, string> = activeStatus
    ? { status: activeStatus }
    : {}

  const orderIds = orders.map((o) => o.id)
  const itemCounts =
    orderIds.length > 0
      ? await db
          .select({
            orderId: orderItemsTable.orderId,
            count: sql<number>`count(*)::int`,
          })
          .from(orderItemsTable)
          .where(inArray(orderItemsTable.orderId, orderIds))
          .groupBy(orderItemsTable.orderId)
      : []

  const itemCountByOrderId = new Map(
    itemCounts.map((row) => [row.orderId, row.count])
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-light">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {total} order{total !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const current = status ?? "all"
          const active = tab.value === current
          return (
            <AdminLink
              key={tab.value}
              href={`/orders?status=${tab.value}`}
              className={`rounded-full border px-3 py-1 text-xs tracking-wide transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"}`}
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
                <th className="px-4 py-3 font-medium">Order #</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-muted-foreground"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
              {orders.map((order) => {
                const cfg = ORDER_STATUS_CONFIG[order.status as OrderStatus]
                return (
                  <tr key={order.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <AdminLink
                        href={`/orders/${order.id}`}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {order.orderNumber}
                      </AdminLink>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {itemCountByOrderId.get(order.id) ?? 0}
                    </td>
                    <td className="px-4 py-3 font-medium text-primary">
                      {formatPrice(parseFloat(order.total))}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {order.fulfillmentType === "DELIVERY"
                          ? "Delivery"
                          : "Pickup"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusUpdater
                        orderId={order.id}
                        currentStatus={order.status as OrderStatus}
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
          baseHref="/orders"
          params={paginationParams}
        />
      </div>
    </div>
  )
}
