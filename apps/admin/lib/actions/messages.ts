"use server"

import { db, contactMessages } from "@workspace/db"
import { eq, and, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function getMessages(filter?: "unread" | "archived" | "all") {
  if (filter === "unread") {
    return db
      .select()
      .from(contactMessages)
      .where(
        and(
          eq(contactMessages.isRead, false),
          eq(contactMessages.isArchived, false)
        )
      )
      .orderBy(desc(contactMessages.createdAt))
  }
  if (filter === "archived") {
    return db
      .select()
      .from(contactMessages)
      .where(eq(contactMessages.isArchived, true))
      .orderBy(desc(contactMessages.createdAt))
  }
  return db
    .select()
    .from(contactMessages)
    .where(eq(contactMessages.isArchived, false))
    .orderBy(desc(contactMessages.createdAt))
}

export async function markMessageRead(id: string) {
  const session = await auth()
  if (!session) return { success: false }
  await db
    .update(contactMessages)
    .set({ isRead: true })
    .where(eq(contactMessages.id, id))
  revalidatePath("/messages")
  return { success: true }
}

export async function archiveMessage(id: string) {
  const session = await auth()
  if (!session) return { success: false }
  await db
    .update(contactMessages)
    .set({ isArchived: true })
    .where(eq(contactMessages.id, id))
  revalidatePath("/messages")
  return { success: true }
}
