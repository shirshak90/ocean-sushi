import { config } from "dotenv"
import { resolve } from "node:path"
import bcrypt from "bcryptjs"
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { sql } from "drizzle-orm"
import * as schema from "./schema"
import {
  users,
  menuCategories,
  menuItems,
  openingHours,
  galleryImages,
} from "./schema"

config({ path: resolve(process.cwd(), "../../.env") })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool, { schema })

async function main() {
  console.log("🌱 Seeding database...")

  // Admin user
  const hashedPassword = await bcrypt.hash("admin123", 12)
  await db
    .insert(users)
    .values({
      name: "Admin User",
      email: "admin@oceansushi.com",
      password: hashedPassword,
      role: "ADMIN",
    })
    .onConflictDoNothing({ target: users.email })

  // Menu categories
  const [nigiri, sashimi, maki, signature, appetizers, desserts, drinks] =
    await db
      .insert(menuCategories)
      .values([
        { name: "Nigiri", slug: "nigiri", sortOrder: 1 },
        { name: "Sashimi", slug: "sashimi", sortOrder: 2 },
        { name: "Maki Rolls", slug: "maki-rolls", sortOrder: 3 },
        { name: "Signature Rolls", slug: "signature-rolls", sortOrder: 4 },
        { name: "Appetizers", slug: "appetizers", sortOrder: 5 },
        { name: "Desserts", slug: "desserts", sortOrder: 6 },
        { name: "Drinks", slug: "drinks", sortOrder: 7 },
      ])
      .onConflictDoUpdate({
        target: menuCategories.slug,
        set: { updatedAt: sql`now()` },
      })
      .returning()

  if (
    !nigiri ||
    !sashimi ||
    !maki ||
    !signature ||
    !appetizers ||
    !desserts ||
    !drinks
  ) {
    throw new Error("Failed to insert menu categories")
  }

  await db.insert(menuItems).values([
    // Nigiri
    {
      categoryId: nigiri.id,
      name: "Salmon Nigiri",
      description:
        "Fresh Atlantic salmon over hand-pressed seasoned sushi rice",
      price: "8.50",
      featured: true,
      tags: ["GLUTEN_FREE"],
      sortOrder: 1,
    },
    {
      categoryId: nigiri.id,
      name: "Bluefin Tuna Nigiri",
      description:
        "Premium bluefin tuna, lightly seasoned with sea salt and yuzu",
      price: "14.00",
      featured: true,
      tags: ["GLUTEN_FREE"],
      sortOrder: 2,
    },
    {
      categoryId: nigiri.id,
      name: "Yellow Tail Nigiri",
      description: "Delicate hamachi with a touch of jalapeño and ponzu",
      price: "10.00",
      tags: ["GLUTEN_FREE", "SPICY"],
      sortOrder: 3,
    },
    {
      categoryId: nigiri.id,
      name: "Scallop Nigiri",
      description: "Sweet Hokkaido scallop, torched with truffle salt",
      price: "11.00",
      tags: ["GLUTEN_FREE"],
      sortOrder: 4,
    },
    {
      categoryId: nigiri.id,
      name: "Uni Nigiri",
      description:
        "Sea urchin from the coast of Santa Barbara on warm sushi rice",
      price: "18.00",
      tags: ["GLUTEN_FREE"],
      sortOrder: 5,
    },
    // Sashimi
    {
      categoryId: sashimi.id,
      name: "Salmon Sashimi",
      description:
        "Five slices of premium Atlantic salmon, served with wasabi and pickled ginger",
      price: "16.00",
      featured: true,
      tags: ["GLUTEN_FREE"],
      sortOrder: 1,
    },
    {
      categoryId: sashimi.id,
      name: "Tuna Sashimi",
      description: "Silky bluefin tuna, hand-sliced to order",
      price: "22.00",
      tags: ["GLUTEN_FREE"],
      sortOrder: 2,
    },
    {
      categoryId: sashimi.id,
      name: "Sashimi Omakase",
      description:
        "Chef's selection of the finest seasonal sashimi — twelve pieces",
      price: "48.00",
      featured: true,
      tags: ["GLUTEN_FREE"],
      sortOrder: 3,
    },
    {
      categoryId: sashimi.id,
      name: "Octopus Sashimi",
      description: "Braised Spanish octopus, shaved thin with citrus oil",
      price: "18.00",
      tags: ["GLUTEN_FREE"],
      sortOrder: 4,
    },
    // Maki Rolls
    {
      categoryId: maki.id,
      name: "Spicy Tuna Roll",
      description: "Tuna, sriracha mayo, cucumber, sesame — 8 pieces",
      price: "14.00",
      tags: ["SPICY"],
      sortOrder: 1,
    },
    {
      categoryId: maki.id,
      name: "Avocado Roll",
      description: "Ripe avocado, cucumber, sesame — 8 pieces",
      price: "9.00",
      tags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"],
      sortOrder: 2,
    },
    {
      categoryId: maki.id,
      name: "California Roll",
      description: "Crab, avocado, cucumber — 8 pieces",
      price: "12.00",
      tags: [],
      sortOrder: 3,
    },
    {
      categoryId: maki.id,
      name: "Rainbow Roll",
      description: "California roll topped with assorted sashimi — 8 pieces",
      price: "18.00",
      featured: true,
      tags: ["GLUTEN_FREE"],
      sortOrder: 4,
    },
    // Signature Rolls
    {
      categoryId: signature.id,
      name: "Ocean Dragon Roll",
      description:
        "Shrimp tempura, spicy tuna, avocado, topped with unagi and tobiko",
      price: "22.00",
      featured: true,
      tags: ["SPICY"],
      sortOrder: 1,
    },
    {
      categoryId: signature.id,
      name: "Black Pearl Roll",
      description:
        "Truffle-infused crab, cucumber, topped with caviar and gold leaf",
      price: "36.00",
      featured: true,
      tags: [],
      sortOrder: 2,
    },
    {
      categoryId: signature.id,
      name: "Sakura Roll",
      description:
        "Salmon, cream cheese, mango, wrapped in pink soy paper with yuzu foam",
      price: "24.00",
      tags: [],
      sortOrder: 3,
    },
    {
      categoryId: signature.id,
      name: "Volcano Roll",
      description: "Baked scallop and crab, spicy mayo, masago — served hot",
      price: "20.00",
      tags: ["SPICY"],
      sortOrder: 4,
    },
    // Appetizers
    {
      categoryId: appetizers.id,
      name: "Edamame",
      description: "Steamed young soybeans with sea salt and sesame oil",
      price: "6.00",
      tags: ["VEGETARIAN", "VEGAN", "GLUTEN_FREE"],
      sortOrder: 1,
    },
    {
      categoryId: appetizers.id,
      name: "Miso Soup",
      description: "Traditional dashi broth with tofu, wakame and scallions",
      price: "5.00",
      tags: ["VEGETARIAN", "VEGAN"],
      sortOrder: 2,
    },
    {
      categoryId: appetizers.id,
      name: "Gyoza",
      description:
        "Pan-fried pork and cabbage dumplings with ponzu dipping sauce — 6 pieces",
      price: "10.00",
      tags: [],
      sortOrder: 3,
    },
    {
      categoryId: appetizers.id,
      name: "Agedashi Tofu",
      description:
        "Lightly fried silken tofu in a dashi broth with grated daikon and ginger",
      price: "9.00",
      tags: ["VEGETARIAN", "VEGAN"],
      sortOrder: 4,
    },
    {
      categoryId: appetizers.id,
      name: "Wagyu Tataki",
      description: "Seared A5 Wagyu beef, ponzu, crispy garlic, micro greens",
      price: "28.00",
      tags: ["GLUTEN_FREE"],
      sortOrder: 5,
    },
    // Desserts
    {
      categoryId: desserts.id,
      name: "Matcha Crème Brûlée",
      description: "Classic crème brûlée infused with ceremonial-grade matcha",
      price: "9.00",
      tags: ["VEGETARIAN"],
      sortOrder: 1,
    },
    {
      categoryId: desserts.id,
      name: "Mochi Ice Cream",
      description: "Three-piece assortment — matcha, mango, and black sesame",
      price: "8.00",
      tags: ["VEGETARIAN"],
      sortOrder: 2,
    },
    {
      categoryId: desserts.id,
      name: "Black Sesame Panna Cotta",
      description: "Silky panna cotta with black sesame caramel and honeycomb",
      price: "10.00",
      tags: ["VEGETARIAN"],
      sortOrder: 3,
    },
    // Drinks
    {
      categoryId: drinks.id,
      name: "Sake — Junmai Daiginjo",
      description: "Premium cold sake with floral, fruity notes — 180ml carafe",
      price: "18.00",
      tags: ["VEGAN"],
      sortOrder: 1,
    },
    {
      categoryId: drinks.id,
      name: "Japanese Whisky",
      description: "Suntory Toki, neat or on the rocks",
      price: "16.00",
      tags: [],
      sortOrder: 2,
    },
    {
      categoryId: drinks.id,
      name: "Matcha Latte",
      description: "Ceremonial-grade matcha with steamed oat milk",
      price: "6.50",
      tags: ["VEGETARIAN", "VEGAN"],
      sortOrder: 3,
    },
    {
      categoryId: drinks.id,
      name: "Sparkling Water",
      description: "San Pellegrino — 500ml bottle",
      price: "4.00",
      tags: ["VEGAN"],
      sortOrder: 4,
    },
    {
      categoryId: drinks.id,
      name: "Yuzu Lemonade",
      description: "Fresh-pressed yuzu citrus with sparkling water and mint",
      price: "7.00",
      tags: ["VEGETARIAN", "VEGAN"],
      sortOrder: 5,
    },
  ])

  // Opening hours
  await db
    .insert(openingHours)
    .values([
      { dayOfWeek: "MONDAY", openTime: "11:30", closeTime: "22:00" },
      { dayOfWeek: "TUESDAY", openTime: "11:30", closeTime: "22:00" },
      { dayOfWeek: "WEDNESDAY", openTime: "11:30", closeTime: "22:00" },
      { dayOfWeek: "THURSDAY", openTime: "11:30", closeTime: "22:00" },
      { dayOfWeek: "FRIDAY", openTime: "11:30", closeTime: "23:00" },
      { dayOfWeek: "SATURDAY", openTime: "12:00", closeTime: "23:00" },
      { dayOfWeek: "SUNDAY", openTime: "12:00", closeTime: "21:00" },
    ])
    .onConflictDoUpdate({
      target: openingHours.dayOfWeek,
      set: {
        openTime: sql`excluded."openTime"`,
        closeTime: sql`excluded."closeTime"`,
        isClosed: sql`excluded."isClosed"`,
      },
    })

  // Sample gallery images
  await db.insert(galleryImages).values([
    {
      url: "/gallery/sushi-bar.jpg",
      category: "Restaurant",
      title: "Our Sushi Bar",
    },
    { url: "/gallery/dragon-roll.jpg", category: "Food", title: "Dragon Roll" },
    {
      url: "/gallery/interior.jpg",
      category: "Restaurant",
      title: "Main Dining Room",
    },
    {
      url: "/gallery/omakase.jpg",
      category: "Food",
      title: "Omakase Experience",
    },
    { url: "/gallery/sake.jpg", category: "Drinks", title: "Sake Selection" },
    { url: "/gallery/chef.jpg", category: "Team", title: "Chef at Work" },
  ])

  console.log("✅ Seed complete")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => pool.end())
