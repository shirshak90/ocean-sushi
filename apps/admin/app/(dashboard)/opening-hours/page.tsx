import type { Metadata } from "next"
import { db, openingHours } from "@workspace/db"
import { asc } from "drizzle-orm"
import { DAY_LABELS } from "@workspace/shared/types"
import type { DayOfWeek } from "@workspace/shared/types"
import { OpeningHourEditor } from "@/components/opening-hours/opening-hour-editor"

export const metadata: Metadata = { title: "Opening Hours" }

const ALL_DAYS: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]

export default async function OpeningHoursPage() {
  const hours = await db
    .select()
    .from(openingHours)
    .orderBy(asc(openingHours.dayOfWeek))
  const hoursMap = Object.fromEntries(hours.map((h) => [h.dayOfWeek, h]))

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-light">Opening Hours</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the restaurant schedule for each day of the week.
        </p>
      </div>

      <div className="max-w-xl overflow-hidden rounded-lg border border-border bg-card">
        {ALL_DAYS.map((day, i) => {
          const hour = hoursMap[day]
          return (
            <div
              key={day}
              className={
                i < ALL_DAYS.length - 1 ? "border-b border-border" : ""
              }
            >
              <OpeningHourEditor
                day={day}
                label={DAY_LABELS[day]}
                current={
                  hour
                    ? {
                        openTime: hour.openTime,
                        closeTime: hour.closeTime,
                        isClosed: hour.isClosed,
                      }
                    : null
                }
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
