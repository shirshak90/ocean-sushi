import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OrderShell } from "@/components/order/order-shell"
import { getMenuItemsForOrder } from "@/lib/actions/order"

export const dynamic = "force-dynamic"

export const metadata: Metadata = { title: "Order Online" }

export default async function OrderPage() {
  const items = await getMenuItemsForOrder()

  const serialised = items.map((item) => ({
    ...item,
    price: parseFloat(item.price),
  }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="relative flex flex-col items-center justify-center gap-4 overflow-hidden py-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
          <div className="relative z-10">
            <p className="mb-3 text-xs tracking-[0.4em] text-primary uppercase">
              Delivered to your door
            </p>
            <h1 className="font-heading text-5xl font-light tracking-wide md:text-6xl">
              Order Online
            </h1>
            <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </section>
        <OrderShell items={serialised} />
      </main>
      <Footer />
    </>
  )
}
