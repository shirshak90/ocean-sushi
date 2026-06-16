import type { Metadata } from "next"
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google"
import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"
import { Providers } from "@/components/providers"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: { default: "Ocean Sushi Admin", template: "%s | Admin" },
  description: "Ocean Sushi staff dashboard",
  robots: { index: false, follow: false },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased",
        geist.variable,
        fontMono.variable,
        cormorant.variable,
        "font-sans"
      )}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
