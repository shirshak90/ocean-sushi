"use server"

import {
  db,
  menuItems,
  customers,
  addresses,
  orders,
  orderItems,
} from "@workspace/db"
import { eq, inArray, and, asc } from "drizzle-orm"
import { CreateOrderSchema } from "@workspace/shared/schemas"
import { generateOrderNumber } from "@workspace/shared/utils"
import { DELIVERY_FEE } from "@workspace/shared/types"
import { revalidatePath } from "next/cache"

export type CreateOrderResult =
  | { success: true; orderNumber: string }
  | { success: false; error: string }

export async function createOrder(raw: unknown): Promise<CreateOrderResult> {
  const parsed = CreateOrderSchema.safeParse(raw)
  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid order data. Please check the form.",
    }
  }

  const { customer, address, items, fulfillmentType, notes, preferredTime } =
    parsed.data

  try {
    const dbMenuItems = await db
      .select({ id: menuItems.id, price: menuItems.price })
      .from(menuItems)
      .where(
        and(
          inArray(
            menuItems.id,
            items.map((i) => i.menuItemId)
          ),
          eq(menuItems.available, true)
        )
      )

    if (dbMenuItems.length !== items.length) {
      return {
        success: false,
        error: "One or more items are no longer available.",
      }
    }

    const priceMap = new Map(
      dbMenuItems.map((m) => [m.id, parseFloat(m.price)])
    )

    const subtotal = items.reduce(
      (acc, item) => acc + (priceMap.get(item.menuItemId) ?? 0) * item.quantity,
      0
    )
    const deliveryFee = fulfillmentType === "DELIVERY" ? DELIVERY_FEE : 0
    const total = subtotal + deliveryFee

    let dbCustomer = await db.query.customers.findFirst({
      where: eq(customers.email, customer.email),
    })
    if (!dbCustomer) {
      const [created] = await db
        .insert(customers)
        .values({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          companyName: customer.companyName ?? null,
        })
        .returning()
      dbCustomer = created!
    }

    let addressId: string | null = null
    if (fulfillmentType === "DELIVERY" && address) {
      const [dbAddress] = await db
        .insert(addresses)
        .values({
          customerId: dbCustomer.id,
          street: address.street,
          number: address.number,
          bus: address.bus ?? null,
          postalCode: address.postalCode,
          city: address.city,
          country: address.country,
        })
        .returning({ id: addresses.id })
      addressId = dbAddress!.id
    }

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber: generateOrderNumber(),
        customerId: dbCustomer.id,
        addressId,
        fulfillmentType,
        status: "PENDING",
        notes: notes ?? null,
        preferredTime: preferredTime ?? null,
        subtotal: subtotal.toString(),
        deliveryFee: deliveryFee.toString(),
        total: total.toString(),
      })
      .returning({ id: orders.id, orderNumber: orders.orderNumber })

    await db.insert(orderItems).values(
      items.map((item) => ({
        orderId: order!.id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: (priceMap.get(item.menuItemId) ?? 0).toString(),
        notes: item.notes ?? null,
      }))
    )

    revalidatePath("/order")
    return { success: true, orderNumber: order!.orderNumber }
  } catch (err) {
    console.error("[createOrder]", err)
    return { success: false, error: "Failed to place order. Please try again." }
  }
}

export async function getMenuItemsForOrder() {
  return db.query.menuItems.findMany({
    where: eq(menuItems.available, true),
    columns: {
      id: true,
      name: true,
      description: true,
      price: true,
      image: true,
      tags: true,
      featured: true,
    },
    with: {
      category: { columns: { name: true, slug: true } },
    },
    orderBy: (t, { asc }) => [asc(t.sortOrder)],
  })
}
