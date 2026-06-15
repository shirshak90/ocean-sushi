import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

const featured = [
  {
    name: "Salmon Nigiri",
    description: "Fresh Atlantic salmon over seasoned sushi rice",
    price: "$8",
    tag: "Chef's Pick",
  },
  {
    name: "Dragon Roll",
    description: "Shrimp tempura, avocado, cucumber, eel sauce",
    price: "$16",
    tag: "Popular",
  },
  {
    name: "Tuna Sashimi",
    description: "Premium bluefin tuna, thinly sliced, served with wasabi",
    price: "$18",
    tag: "Premium",
  },
]

export default function Page() {
  return (
    <main className="flex min-h-svh flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
        <Badge variant="secondary">Now open in downtown</Badge>
        <h1 className="max-w-lg text-4xl font-semibold tracking-tight">
          Fresh sushi, straight from the ocean
        </h1>
        <p className="max-w-sm text-muted-foreground">
          Ocean Sushi brings the finest cuts of fish and traditional Japanese
          craftsmanship to your table.
        </p>
        <div className="flex gap-3">
          <Button>Reserve a table</Button>
          <Button variant="outline">View full menu</Button>
        </div>
      </section>

      {/* Featured items */}
      <section className="px-6 pb-24">
        <h2 className="mb-6 text-center text-lg font-medium">
          Featured dishes
        </h2>
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {featured.map((item) => (
            <Card key={item.name}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {item.tag}
                  </Badge>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="font-medium">{item.price}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}
