"use server"

import { db, menuCategories, menuItems, galleryImages } from "@workspace/db"
import { eq, and, asc } from "drizzle-orm"

export async function getMenuWithCategories() {
  return db.query.menuCategories.findMany({
    orderBy: (t, { asc }) => [asc(t.sortOrder)],
    with: {
      items: {
        where: eq(menuItems.available, true),
        orderBy: (t, { asc }) => [asc(t.sortOrder)],
      },
    },
  })
}

export async function getFeaturedItems() {
  return db.query.menuItems.findMany({
    where: and(eq(menuItems.featured, true), eq(menuItems.available, true)),
    with: {
      category: { columns: { name: true, slug: true } },
    },
    orderBy: (t, { asc }) => [asc(t.sortOrder)],
    limit: 6,
  })
}

export async function getGalleryImages() {
  return db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.category), asc(galleryImages.sortOrder))
}
