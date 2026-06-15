"use server"

import { db, galleryImages } from "@workspace/db"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")
  return session
}

export async function addGalleryImage(data: {
  url: string
  category: string
  title: string
}) {
  await requireAdmin()
  await db.insert(galleryImages).values(data)
  revalidatePath("/gallery")
}

export async function deleteGalleryImage(id: string) {
  await requireAdmin()
  await db.delete(galleryImages).where(eq(galleryImages.id, id))
  revalidatePath("/gallery")
}
