import type { Metadata } from "next"
import { AdminLink } from "@/components/admin-link"
import { db, contactMessages } from "@workspace/db"
import { eq, and, desc } from "drizzle-orm"
import { formatDateTime } from "@workspace/shared/utils"
import { MessageActions } from "@/components/messages/message-actions"

export const metadata: Metadata = { title: "Messages" }

const TABS = [
  { label: "Inbox", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Archived", value: "archived" },
]

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const f = (filter ?? "all") as "all" | "unread" | "archived"

  const messages =
    f === "unread"
      ? await db
          .select()
          .from(contactMessages)
          .where(
            and(
              eq(contactMessages.isRead, false),
              eq(contactMessages.isArchived, false)
            )
          )
          .orderBy(desc(contactMessages.createdAt))
          .limit(100)
      : f === "archived"
        ? await db
            .select()
            .from(contactMessages)
            .where(eq(contactMessages.isArchived, true))
            .orderBy(desc(contactMessages.createdAt))
          .limit(100)
        : await db
            .select()
            .from(contactMessages)
            .where(eq(contactMessages.isArchived, false))
            .orderBy(desc(contactMessages.createdAt))
          .limit(100)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-light">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {messages.length} message{messages.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex gap-2">
        {TABS.map((tab) => {
          const active = (filter ?? "all") === tab.value
          return (
            <AdminLink
              key={tab.value}
              href={`/messages?filter=${tab.value}`}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}
            >
              {tab.label}
            </AdminLink>
          )
        })}
      </div>

      <div className="flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="rounded-lg border border-border bg-card px-6 py-12 text-center text-muted-foreground">
            No messages found.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg border bg-card p-5 transition-colors ${!msg.isRead ? "border-primary/30" : "border-border"}`}
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{msg.name}</p>
                    {!msg.isRead && (
                      <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] text-primary">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{msg.email}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(msg.createdAt)}
                </span>
                <MessageActions
                  messageId={msg.id}
                  isRead={msg.isRead}
                  isArchived={msg.isArchived}
                />
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {msg.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
