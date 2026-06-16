"use server"

import { db, menuItems, menuCategories } from "@workspace/db"
import { eq, asc, max } from "drizzle-orm"
import { MenuItemSchema, MenuCategorySchema } from "@workspace/shared/schemas"
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

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export async function createCategory(raw: unknown) {
  await requireAdmin()
  const parsed = MenuCategorySchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: "Invalid data" }

  const slug = slugify(parsed.data.name)
  const existing = await db
    .select({ id: menuCategories.id })
    .from(menuCategories)
    .where(eq(menuCategories.slug, slug))
  if (existing.length > 0)
    return { success: false, error: "A category with this name already exists" }

  const [rows] = await db
    .select({ max: max(menuCategories.sortOrder) })
    .from(menuCategories)
  const nextOrder = (rows?.max ?? 0) + 1

  await db.insert(menuCategories).values({
    name: parsed.data.name,
    slug,
    sortOrder: parsed.data.sortOrder ?? nextOrder,
  })
  revalidatePath("/menu")
  return { success: true }
}

export async function updateCategory(id: string, raw: unknown) {
  await requireAdmin()
  const parsed = MenuCategorySchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: "Invalid data" }

  const slug = slugify(parsed.data.name)
  const conflict = await db
    .select({ id: menuCategories.id })
    .from(menuCategories)
    .where(eq(menuCategories.slug, slug))
  if (conflict.length > 0 && conflict[0]?.id !== id)
    return { success: false, error: "A category with this name already exists" }

  await db
    .update(menuCategories)
    .set({ name: parsed.data.name, slug })
    .where(eq(menuCategories.id, id))
  revalidatePath("/menu")
  return { success: true }
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  const items = await db
    .select({ id: menuItems.id })
    .from(menuItems)
    .where(eq(menuItems.categoryId, id))
  if (items.length > 0)
    return {
      success: false,
      error: `Cannot delete — ${items.length} item(s) still use this category`,
    }

  await db.delete(menuCategories).where(eq(menuCategories.id, id))
  revalidatePath("/menu")
  return { success: true }
}
