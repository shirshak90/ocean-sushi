"use server"

import { db, contactMessages } from "@workspace/db"
import { ContactSchema } from "@workspace/shared/schemas"

export type SendMessageResult =
  | { success: true }
  | { success: false; error: string }

export async function sendContactMessage(
  raw: unknown
): Promise<SendMessageResult> {
  const parsed = ContactSchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { success: false, error: first?.message ?? "Invalid form data." }
  }

  const { name, email, message } = parsed.data

  try {
    await db.insert(contactMessages).values({ name, email, message })
    return { success: true }
  } catch (err) {
    console.error("[sendContactMessage]", err)
    return {
      success: false,
      error: "Failed to send message. Please try again.",
    }
  }
}
