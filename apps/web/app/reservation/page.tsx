import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReservationForm } from "@/components/reservation/reservation-form"

export const metadata: Metadata = { title: "Reservation" }

export default function ReservationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="relative flex flex-col items-center justify-center gap-4 overflow-hidden py-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
          <div className="relative z-10">
            <p className="mb-3 text-xs tracking-[0.4em] text-primary uppercase">
              Join us
            </p>
            <h1 className="font-heading text-5xl font-light tracking-wide md:text-7xl">
              Reserve a Table
            </h1>
            <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="mx-auto mt-6 max-w-md text-muted-foreground">
              We welcome you to experience Japanese cuisine at its finest. Book
              your table and we will take care of the rest.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-2xl px-6 pb-24">
          <ReservationForm />
        </section>
      </main>
      <Footer />
    </>
  )
}
