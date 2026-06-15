"use client"

import { useState } from "react"
import { format, isValid, parseISO, startOfDay } from "date-fns"
import { CalendarDays } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Calendar } from "@workspace/ui/components/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { cn } from "@workspace/ui/lib/utils"

type DatePickerProps = {
  value?: string
  onChange: (value: string) => void
  minDate?: Date
  placeholder?: string
  className?: string
  "aria-invalid"?: boolean
}

export function DatePicker({
  value,
  onChange,
  minDate = startOfDay(new Date()),
  placeholder = "Pick a date",
  className,
  "aria-invalid": ariaInvalid,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected =
    value && isValid(parseISO(value)) ? parseISO(value) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-invalid={ariaInvalid}
          className={cn(
            "w-full justify-start font-normal",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarDays data-icon="inline-start" />
          {selected ? format(selected, "PPP") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? format(date, "yyyy-MM-dd") : "")
            setOpen(false)
          }}
          disabled={(date) => date < minDate}
        />
      </PopoverContent>
    </Popover>
  )
}
