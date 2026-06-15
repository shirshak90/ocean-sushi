"use server"

import { db, openingHours } from "@workspace/db"
import { eq, asc } from "drizzle-orm"
import { OpeningHourSchema } from "@workspace/shared/schemas"
import { auth } from "@/lib/auth"
import type { DayOfWeek } from "@workspace/shared/types"

export async function getOpeningHours() {
  return db.select().from(openingHours).orderBy(asc(openingHours.dayOfWeek))
}

export async function upsertOpeningHour(raw: unknown) {
  const session = await auth()
  if (!session) return { success: false, error: "Unauthorized" }

  const parsed = OpeningHourSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: "Invalid data" }

  const { dayOfWeek, openTime, closeTime, isClosed } = parsed.data
  await db
    .insert(openingHours)
    .values({
      dayOfWeek: dayOfWeek as DayOfWeek,
      openTime,
      closeTime,
      isClosed,
    })
    .onConflictDoUpdate({
      target: openingHours.dayOfWeek,
      set: { openTime, closeTime, isClosed },
    })

  return { success: true }
}
