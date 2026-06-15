import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedDishes } from "@/components/home/featured-dishes"
import { ChefSection } from "@/components/home/chef-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { GalleryPreview } from "@/components/home/gallery-preview"
import { OpeningHoursSection } from "@/components/home/opening-hours-section"
import { CtaBanner } from "@/components/home/cta-banner"
import { getFeaturedItems } from "@/lib/actions/menu"
import { getOpeningHours } from "@/lib/actions/reservation"

export const metadata: Metadata = {
  title: "Ocean Sushi — Premium Japanese Cuisine",
}

export default async function HomePage() {
  const [featuredItems, openingHours] = await Promise.all([
    getFeaturedItems(),
    getOpeningHours(),
  ])

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedDishes items={featuredItems} />
        <ChefSection />
        <TestimonialsSection />
        <GalleryPreview />
        <OpeningHoursSection hours={openingHours} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
