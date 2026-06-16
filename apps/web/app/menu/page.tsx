import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MenuBook } from "@/components/menu/menu-book"
import { getMenuWithCategories } from "@/lib/actions/menu"

export const dynamic = "force-dynamic"

export const metadata: Metadata = { title: "Menu" }

export default async function MenuPage() {
  const categories = await getMenuWithCategories()

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        {/* Page header */}
        <section className="relative flex flex-col items-center justify-center gap-4 overflow-hidden py-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
          <div className="relative z-10">
            <p className="mb-3 text-xs tracking-[0.4em] text-primary uppercase">
              Crafted with precision
            </p>
            <h1 className="font-heading text-5xl font-light tracking-wide md:text-7xl">
              Our Menu
            </h1>
            <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </section>

        <MenuBook
          categories={categories.map((cat) => ({
            ...cat,
            items: cat.items.map((item) => ({
              ...item,
              price: parseFloat(item.price),
            })),
          }))}
        />
      </main>
      <Footer />
    </>
  )
}
