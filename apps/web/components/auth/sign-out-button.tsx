"use client"

import { signOut } from "next-auth/react"
import { Button } from "@workspace/ui/components/button"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex items-center gap-2"
    >
      <LogOut className="size-4" />
      Sign Out
    </Button>
  )
}
