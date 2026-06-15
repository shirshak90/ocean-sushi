import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GalleryGrid } from "@/components/gallery/gallery-grid"
import { getGalleryImages } from "@/lib/actions/menu"

export const metadata: Metadata = { title: "Gallery" }

export default async function GalleryPage() {
  const images = await getGalleryImages()

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="relative flex flex-col items-center justify-center gap-4 overflow-hidden py-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
          <div className="relative z-10">
            <p className="mb-3 text-xs tracking-[0.4em] text-primary uppercase">
              Visual journey
            </p>
            <h1 className="font-heading text-5xl font-light tracking-wide md:text-7xl">
              Gallery
            </h1>
            <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <GalleryGrid images={images} />
        </section>
      </main>
      <Footer />
    </>
  )
}
