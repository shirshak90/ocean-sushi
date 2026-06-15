"use client"

import { useTransition } from "react"
import { ORDER_STATUS_CONFIG } from "@workspace/shared/types"
import type { OrderStatus } from "@workspace/shared/types"
import { updateOrderStatus } from "@/lib/actions/orders"

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "CONFIRMED",
  CONFIRMED: "PREPARING",
  PREPARING: "READY",
  READY: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "COMPLETED",
}

export function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
}) {
  const [isPending, startTransition] = useTransition()
  const next = NEXT_STATUS[currentStatus]

  if (!next) return null

  const nextCfg = ORDER_STATUS_CONFIG[next]

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await updateOrderStatus({ orderId, status: next })
        })
      }
      className="rounded border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
    >
      {isPending ? "…" : `→ ${nextCfg.label}`}
    </button>
  )
}
