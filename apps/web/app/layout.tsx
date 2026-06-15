import type { Metadata } from "next"
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google"
import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: {
    default: "Ocean Sushi — Premium Japanese Cuisine",
    template: "%s | Ocean Sushi",
  },
  description:
    "Experience the finest authentic Japanese sushi in a setting of pure luxury. Crafted with tradition, served with artistry.",
  keywords: [
    "sushi",
    "Japanese restaurant",
    "omakase",
    "sashimi",
    "fine dining",
    "Ocean Sushi",
  ],
  authors: [{ name: "Ocean Sushi" }],
  openGraph: {
    title: "Ocean Sushi — Premium Japanese Cuisine",
    description:
      "Experience the finest authentic Japanese sushi in a setting of pure luxury.",
    type: "website",
    locale: "en_US",
    siteName: "Ocean Sushi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ocean Sushi",
    description:
      "Premium Japanese sushi. Crafted with tradition, served with artistry.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark antialiased",
        geist.variable,
        fontMono.variable,
        cormorant.variable,
        "font-sans"
      )}
    >
      <body>{children}</body>
    </html>
  )
}
