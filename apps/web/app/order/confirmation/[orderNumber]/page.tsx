import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata: Metadata = { title: "Order Confirmed" }

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { orderNumber } = await params

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-20 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
              <CheckCircle className="size-10 text-primary" />
            </div>
          </div>

          <p className="mb-2 text-xs tracking-[0.3em] text-primary uppercase">
            Thank you
          </p>
          <h1 className="mb-4 font-heading text-4xl font-light">
            Order Confirmed
          </h1>

          <div className="mb-8 rounded-lg border border-border bg-card p-6">
            <p className="mb-1 text-sm text-muted-foreground">
              Your order number
            </p>
            <p className="font-heading text-2xl tracking-widest text-primary">
              {orderNumber}
            </p>
          </div>

          <p className="mb-8 text-muted-foreground">
            We have received your order and will begin preparing it shortly. You
            will receive a confirmation once it is ready.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link href="/order">Place another order</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
