"use client"

import { Printer } from "lucide-react"
import { Button } from "@workspace/ui/components/button"

export function PrintButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={() => window.print()}
    >
      <Printer className="size-4" /> Print Ticket
    </Button>
  )
}
