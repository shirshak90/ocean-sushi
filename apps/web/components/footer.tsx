import Link from "next/link"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-heading text-2xl font-semibold tracking-widest text-primary">
              海 OCEAN
            </p>
            <p className="mt-1 text-xs tracking-[0.35em] text-muted-foreground">
              SUSHI
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Where tradition meets artistry. Premium Japanese cuisine crafted
              with the finest seasonal ingredients.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 text-xs tracking-[0.2em] text-primary uppercase">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { href: "/menu", label: "Menu" },
                { href: "/order", label: "Order Online" },
                { href: "/reservation", label: "Reservation" },
                { href: "/gallery", label: "Gallery" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs tracking-[0.2em] text-primary uppercase">
              Contact
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>123 Sakura Street, Downtown, NY 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" />
                <span>+1 (212) 555-0198</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" />
                <span>hello@oceansushi.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="mb-4 text-xs tracking-[0.2em] text-primary uppercase">
              Hours
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {[
                { day: "Mon – Thu", time: "11:30 – 22:00" },
                { day: "Fri – Sat", time: "11:30 – 23:00" },
                { day: "Sunday", time: "12:00 – 21:00" },
              ].map(({ day, time }) => (
                <li key={day} className="flex items-center gap-2">
                  <Clock className="size-3.5 shrink-0 text-primary" />
                  <span>
                    <span className="text-foreground">{day}</span> &nbsp;{time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Ocean Sushi. All rights reserved.</p>
          <p className="tracking-widest">CRAFTED WITH 職人技 ARTISTRY</p>
        </div>
      </div>
    </footer>
  )
}
