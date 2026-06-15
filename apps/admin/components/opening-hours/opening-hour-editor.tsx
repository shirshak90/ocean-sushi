"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import { Clock } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { Switch } from "@workspace/ui/components/switch"
import type { DayOfWeek } from "@workspace/shared/types"
import { upsertOpeningHour } from "@/lib/actions/opening-hours"

interface Props {
  day: DayOfWeek
  label: string
  current: { openTime: string; closeTime: string; isClosed: boolean } | null
}

export function OpeningHourEditor({ day, label, current }: Props) {
  const [isClosed, setIsClosed] = useState(current?.isClosed ?? false)
  const [openTime, setOpenTime] = useState(current?.openTime ?? "11:00")
  const [closeTime, setCloseTime] = useState(current?.closeTime ?? "22:00")
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  const valuesRef = useRef({ isClosed, openTime, closeTime })
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  valuesRef.current = { isClosed, openTime, closeTime }

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    }
  }, [])

  function scheduleSave(overrides?: Partial<typeof valuesRef.current>) {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)

    saveTimerRef.current = setTimeout(() => {
      const next = { ...valuesRef.current, ...overrides }
      startTransition(async () => {
        await upsertOpeningHour({
          dayOfWeek: day,
          openTime: next.openTime,
          closeTime: next.closeTime,
          isClosed: next.isClosed,
        })
        setSaved(true)
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
        savedTimerRef.current = setTimeout(() => setSaved(false), 2000)
      })
    }, 600)
  }

  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <span className="w-28 shrink-0 text-sm font-medium">{label}</span>

      <Switch
        checked={!isClosed}
        onCheckedChange={(open) => {
          const nextClosed = !open
          setIsClosed(nextClosed)
          scheduleSave({ isClosed: nextClosed })
        }}
        aria-label={`Toggle ${label}`}
      />

      {!isClosed ? (
        <div className="flex flex-1 items-center gap-2">
          <InputGroup className="w-32">
            <InputGroupAddon>
              <Clock />
            </InputGroupAddon>
            <InputGroupInput
              type="time"
              value={openTime}
              onChange={(e) => setOpenTime(e.target.value)}
              onBlur={() => scheduleSave()}
            />
          </InputGroup>
          <span className="text-muted-foreground">–</span>
          <InputGroup className="w-32">
            <InputGroupAddon>
              <Clock />
            </InputGroupAddon>
            <InputGroupInput
              type="time"
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
              onBlur={() => scheduleSave()}
            />
          </InputGroup>
        </div>
      ) : (
        <span className="flex-1 text-sm text-muted-foreground">Closed</span>
      )}

      {isPending && (
        <span className="text-xs text-muted-foreground">Saving…</span>
      )}
      {saved && !isPending && (
        <span className="text-xs text-emerald-400">Saved</span>
      )}
    </div>
  )
}
