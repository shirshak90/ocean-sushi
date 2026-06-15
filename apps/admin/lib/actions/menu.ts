"use server"

import { db, menuItems, menuCategories } from "@workspace/db"
import { eq, asc } from "drizzle-orm"
import { MenuItemSchema } from "@workspace/shared/schemas"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")
  return session
}

export async function getMenuItemsAdmin() {
  return db.query.menuItems.findMany({
    orderBy: (t, { asc }) => [asc(t.sortOrder)],
    with: { category: { columns: { name: true, slug: true } } },
  })
}

export async function getMenuCategories() {
  return db.select().from(menuCategories).orderBy(asc(menuCategories.sortOrder))
}

export async function createMenuItem(raw: unknown) {
  await requireAdmin()
  const parsed = MenuItemSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: "Invalid data" }

  await db.insert(menuItems).values(parsed.data as never)
  revalidatePath("/menu")
  return { success: true }
}

export async function updateMenuItem(id: string, raw: unknown) {
  await requireAdmin()
  const parsed = MenuItemSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: "Invalid data" }

  await db
    .update(menuItems)
    .set(parsed.data as never)
    .where(eq(menuItems.id, id))
  revalidatePath("/menu")
  return { success: true }
}

export async function deleteMenuItem(id: string) {
  await requireAdmin()
  await db.delete(menuItems).where(eq(menuItems.id, id))
  revalidatePath("/menu")
  return { success: true }
}

export async function toggleMenuItemAvailability(
  id: string,
  available: boolean
) {
  await requireAdmin()
  await db.update(menuItems).set({ available }).where(eq(menuItems.id, id))
  revalidatePath("/menu")
  return { success: true }
}
