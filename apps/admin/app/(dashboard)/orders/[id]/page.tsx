import type { Metadata } from "next"
import { AdminLink } from "@/components/admin-link"
import { notFound } from "next/navigation"
import { ArrowLeft, Printer } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { getOrderById } from "@/lib/actions/orders"
import { formatPrice, formatDateTime } from "@workspace/shared/utils"
import { ORDER_STATUS_CONFIG } from "@workspace/shared/types"
import type { OrderStatus } from "@workspace/shared/types"
import { OrderStatusUpdater } from "@/components/orders/order-status-updater"

export const metadata: Metadata = { title: "Order Detail" }

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) notFound()

  const cfg = ORDER_STATUS_CONFIG[order.status as OrderStatus]

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Button variant="outline" size="sm" asChild>
          <AdminLink href="/orders" className="gap-2">
            <ArrowLeft className="size-4" /> Orders
          </AdminLink>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => window.print()}
        >
          <Printer className="size-4" /> Print Ticket
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border bg-card p-6">
          <div>
            <p className="text-xs text-muted-foreground">Order Number</p>
            <p className="font-mono text-xl text-primary">
              {order.orderNumber}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`rounded px-3 py-1 text-sm ${cfg.color}`}>
              {cfg.label}
            </span>
            <OrderStatusUpdater
              orderId={order.id}
              currentStatus={order.status as OrderStatus}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Customer */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-3 text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Customer
            </h3>
            <p className="font-medium">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.customer.email}
            </p>
            <p className="text-sm text-muted-foreground">
              {order.customer.phone}
            </p>
            {order.customer.companyName && (
              <p className="text-sm text-muted-foreground">
                {order.customer.companyName}
              </p>
            )}
          </div>

          {/* Fulfillment */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-3 text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Fulfillment
            </h3>
            <p className="font-medium">
              {order.fulfillmentType === "DELIVERY"
                ? "Delivery"
                : "Pickup (To Go)"}
            </p>
            {order.address && (
              <div className="mt-2 text-sm text-muted-foreground">
                <p>
                  {order.address.street} {order.address.number}
                  {order.address.bus ? `, ${order.address.bus}` : ""}
                </p>
                <p>
                  {order.address.postalCode} {order.address.city}
                </p>
                <p>{order.address.country}</p>
              </div>
            )}
            {order.preferredTime && (
              <p className="mt-2 text-sm">
                Preferred time:{" "}
                <span className="text-foreground">{order.preferredTime}</span>
              </p>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Order Items
            </h3>
          </div>
          <div className="divide-y divide-border">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 px-5 py-3"
              >
                <div>
                  <p className="font-medium">{item.menuItem.name}</p>
                  {item.notes && (
                    <p className="text-xs text-muted-foreground">
                      {item.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    ×{item.quantity}
                  </span>
                  <span>{formatPrice(parseFloat(item.unitPrice))}</span>
                  <span className="w-16 text-right font-medium text-primary">
                    {formatPrice(parseFloat(item.unitPrice) * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border px-5 py-4">
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(parseFloat(order.subtotal))}</span>
              </div>
              {parseFloat(order.deliveryFee) > 0 && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(parseFloat(order.deliveryFee))}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-1.5 font-semibold">
                <span>Total</span>
                <span className="text-primary">
                  {formatPrice(parseFloat(order.total))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="mb-2 text-xs tracking-[0.2em] text-muted-foreground uppercase">
              Special Instructions
            </h3>
            <p className="text-sm">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
