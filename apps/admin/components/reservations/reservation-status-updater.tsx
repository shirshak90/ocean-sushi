"use client"

import { useTransition } from "react"
import type { ReservationStatus } from "@workspace/shared/types"
import { updateReservationStatus } from "@/lib/actions/reservations"

export function ReservationStatusUpdater({
  reservationId,
  currentStatus,
}: {
  reservationId: string
  currentStatus: ReservationStatus
}) {
  const [isPending, startTransition] = useTransition()

  if (currentStatus !== "PENDING") return null

  return (
    <div className="flex gap-1.5">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await updateReservationStatus({
              reservationId,
              status: "CONFIRMED",
            })
          })
        }
        className="rounded border border-emerald-500/30 px-2 py-1 text-xs text-emerald-400 transition-colors hover:bg-emerald-500/10 disabled:opacity-50"
      >
        Confirm
      </button>
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            await updateReservationStatus({ reservationId, status: "REJECTED" })
          })
        }
        className="rounded border border-red-500/30 px-2 py-1 text-xs text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}
