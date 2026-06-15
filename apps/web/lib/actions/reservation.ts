"use server"

import { db, reservations, openingHours } from "@workspace/db"
import { eq, and, inArray, count, asc } from "drizzle-orm"
import { ReservationSchema } from "@workspace/shared/schemas"
import { revalidatePath } from "next/cache"

export type CreateReservationResult =
  | { success: true; id: string }
  | { success: false; error: string }

export async function createReservation(
  raw: unknown
): Promise<CreateReservationResult> {
  const parsed = ReservationSchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { success: false, error: first?.message ?? "Invalid form data." }
  }

  const { name, email, phone, date, time, guests, notes } = parsed.data

  try {
    const [row] = await db
      .select({ value: count() })
      .from(reservations)
      .where(
        and(
          eq(reservations.date, new Date(date)),
          eq(reservations.time, time),
          inArray(reservations.status, ["PENDING", "CONFIRMED"])
        )
      )

    if ((row?.value ?? 0) >= 8) {
      return {
        success: false,
        error:
          "This time slot is fully booked. Please choose a different time.",
      }
    }

    const [reservation] = await db
      .insert(reservations)
      .values({
        name,
        email,
        phone,
        date: new Date(date),
        time,
        guests,
        notes: notes ?? null,
        status: "PENDING",
      })
      .returning({ id: reservations.id })

    revalidatePath("/reservation")
    return { success: true, id: reservation!.id }
  } catch (err) {
    console.error("[createReservation]", err)
    return {
      success: false,
      error: "Failed to submit reservation. Please try again.",
    }
  }
}

export async function getOpeningHours() {
  return db.select().from(openingHours).orderBy(asc(openingHours.dayOfWeek))
}
