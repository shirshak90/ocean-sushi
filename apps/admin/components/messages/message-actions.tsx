"use client"

import { useTransition } from "react"
import { MailOpen, Archive } from "lucide-react"
import { markMessageRead, archiveMessage } from "@/lib/actions/messages"

export function MessageActions({
  messageId,
  isRead,
  isArchived,
}: {
  messageId: string
  isRead: boolean
  isArchived: boolean
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex gap-1">
      {!isRead && (
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await markMessageRead(messageId)
            })
          }
          title="Mark as read"
          className="rounded border border-border p-1.5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          <MailOpen className="size-3.5" />
        </button>
      )}
      {!isArchived && (
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await archiveMessage(messageId)
            })
          }
          title="Archive"
          className="rounded border border-border p-1.5 text-muted-foreground transition-colors hover:border-border/80 disabled:opacity-50"
        >
          <Archive className="size-3.5" />
        </button>
      )}
    </div>
  )
}
