"use server"

import { db, reservations } from "@workspace/db"
import { eq, asc } from "drizzle-orm"
import { UpdateReservationStatusSchema } from "@workspace/shared/schemas"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ReservationStatus } from "@workspace/shared/types"

export async function getReservations(status?: string) {
  if (status && status !== "all") {
    return db
      .select()
      .from(reservations)
      .where(eq(reservations.status, status as ReservationStatus))
      .orderBy(asc(reservations.date), asc(reservations.time))
  }
  return db
    .select()
    .from(reservations)
    .orderBy(asc(reservations.date), asc(reservations.time))
}

export async function updateReservationStatus(raw: unknown) {
  const session = await auth()
  if (!session) return { success: false, error: "Unauthorized" }

  const parsed = UpdateReservationStatusSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: "Invalid data" }

  const { reservationId, status } = parsed.data
  await db
    .update(reservations)
    .set({ status: status as ReservationStatus })
    .where(eq(reservations.id, reservationId))
  revalidatePath("/reservations")
  return { success: true }
}
