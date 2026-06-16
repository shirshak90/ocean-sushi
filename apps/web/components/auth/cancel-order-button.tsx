"use client"

import { useTransition } from "react"
import { cancelCustomerOrder } from "@/lib/actions/customer-auth"

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const [pending, startTransition] = useTransition()

  function handleClick() {
    if (!window.confirm("Are you sure you want to cancel this order?")) return
    startTransition(async () => {
      const result = await cancelCustomerOrder(orderId)
      if (!result.success && result.error) {
        alert(result.error)
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="rounded border border-destructive/40 px-2 py-0.5 text-xs text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
    >
      {pending ? "Cancelling…" : "Cancel"}
    </button>
  )
}
