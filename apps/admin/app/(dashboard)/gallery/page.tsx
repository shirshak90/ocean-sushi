import type { Metadata } from "next"
import { db, galleryImages } from "@workspace/db"
import { asc } from "drizzle-orm"
import { GalleryManager } from "@/components/gallery/gallery-manager"

export const metadata: Metadata = { title: "Gallery" }

export default async function GalleryPage() {
  const images = await db
    .select()
    .from(galleryImages)
    .orderBy(asc(galleryImages.category), asc(galleryImages.sortOrder))
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-light">Gallery</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {images.length} image{images.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <GalleryManager images={images} />
    </div>
  )
}
