import type { Metadata } from "next"
import { MapPin, Phone, Mail, Clock, Globe, Share2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact/contact-form"

export const metadata: Metadata = { title: "Contact" }

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16">
        <section className="relative flex flex-col items-center justify-center gap-4 overflow-hidden py-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-card to-background" />
          <div className="relative z-10">
            <p className="mb-3 text-xs tracking-[0.4em] text-primary uppercase">
              Get in touch
            </p>
            <h1 className="font-heading text-5xl font-light tracking-wide md:text-7xl">
              Contact Us
            </h1>
            <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Form */}
            <div>
              <h2 className="mb-8 font-heading text-2xl font-light">
                Send us a message
              </h2>
              <ContactForm />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-10">
              <div>
                <h2 className="mb-8 font-heading text-2xl font-light">
                  Find us
                </h2>
                <ul className="flex flex-col gap-5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="mb-0.5 font-medium text-foreground">
                        Address
                      </p>
                      <p>123 Sakura Street, Downtown</p>
                      <p>New York, NY 10001</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="mb-0.5 font-medium text-foreground">
                        Phone
                      </p>
                      <p>+1 (212) 555-0198</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="mb-0.5 font-medium text-foreground">
                        Email
                      </p>
                      <p>hello@oceansushi.com</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div>
                      <p className="mb-0.5 font-medium text-foreground">
                        Hours
                      </p>
                      <p>Mon – Thu: 11:30 – 22:00</p>
                      <p>Fri – Sat: 11:30 – 23:00</p>
                      <p>Sun: 12:00 – 21:00</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Social */}
              <div>
                <p className="mb-4 text-xs tracking-[0.2em] text-primary uppercase">
                  Follow us
                </p>
                <div className="flex gap-4">
                  {[
                    { icon: Globe, label: "Instagram" },
                    { icon: Share2, label: "Facebook" },
                  ].map(({ icon: Icon, label }) => (
                    <a
                      key={label}
                      href="#"
                      aria-label={label}
                      className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      <Icon className="size-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="flex h-56 items-center justify-center bg-card text-muted-foreground">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 size-8 text-primary" />
                    <p className="text-sm">123 Sakura Street, New York</p>
                    <p className="mt-1 text-xs">
                      Replace with Google Maps embed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
