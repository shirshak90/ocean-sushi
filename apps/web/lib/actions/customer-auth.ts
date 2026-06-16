"use server"

import bcrypt from "bcryptjs"
import { db, customers, orders, reservations } from "@workspace/db"
import { eq, desc, and, sql } from "drizzle-orm"
import { CustomerRegisterSchema } from "@workspace/shared/schemas"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export type RegisterResult =
  | { success: true; email: string; password: string }
  | { success: false; error: string }

export async function registerCustomer(raw: unknown): Promise<RegisterResult> {
  const parsed = CustomerRegisterSchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { success: false, error: first?.message ?? "Invalid data" }
  }
  const { firstName, lastName, email, phone, password } = parsed.data

  const existing = await db.query.customers.findFirst({
    where: eq(customers.email, email),
  })

  if (existing?.password) {
    return {
      success: false,
      error: "An account with this email already exists. Please sign in.",
    }
  }

  const hashed = await bcrypt.hash(password, 12)

  if (existing) {
    // claim existing record (created via order flow)
    await db
      .update(customers)
      .set({ password: hashed, firstName, lastName, phone })
      .where(eq(customers.email, email))
  } else {
    await db
      .insert(customers)
      .values({ firstName, lastName, email, phone, password: hashed })
  }

  revalidatePath("/profile")
  return { success: true, email, password }
}

const CANCELLABLE = ["PENDING", "CONFIRMED", "PREPARING"] as const

export async function cancelCustomerOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, error: "Not authenticated" }

  const order = await db.query.orders.findFirst({
    where: and(eq(orders.id, orderId), eq(orders.customerId, session.user.id)),
    columns: { id: true, status: true },
  })

  if (!order) return { success: false, error: "Order not found" }
  if (!(CANCELLABLE as readonly string[]).includes(order.status)) {
    return { success: false, error: "This order can no longer be cancelled" }
  }

  await db
    .update(orders)
    .set({ status: "CANCELLED" })
    .where(eq(orders.id, orderId))

  revalidatePath("/profile")
  return { success: true }
}

const PAGE_SIZE = 10

export async function getCustomerProfile(
  customerId: string,
  { orderPage = 1, resPage = 1 }: { orderPage?: number; resPage?: number } = {}
) {
  const customer = await db.query.customers.findFirst({
    where: eq(customers.id, customerId),
  })
  if (!customer) return null

  const orderOffset = (orderPage - 1) * PAGE_SIZE
  const resOffset = (resPage - 1) * PAGE_SIZE

  const [[orderCountRow], [resCountRow], customerOrders, customerReservations] =
    await Promise.all([
      db
        .select({ value: sql<number>`count(*)` })
        .from(orders)
        .where(eq(orders.customerId, customerId)),
      db
        .select({ value: sql<number>`count(*)` })
        .from(reservations)
        .where(eq(reservations.email, customer.email)),
      db.query.orders.findMany({
        where: eq(orders.customerId, customerId),
        orderBy: (t, { desc }) => [desc(t.createdAt)],
        limit: PAGE_SIZE,
        offset: orderOffset,
        with: {
          orderItems: { with: { menuItem: { columns: { name: true } } } },
        },
      }),
      db
        .select()
        .from(reservations)
        .where(eq(reservations.email, customer.email))
        .orderBy(desc(reservations.createdAt))
        .limit(PAGE_SIZE)
        .offset(resOffset),
    ])

  return {
    customer,
    orders: customerOrders,
    reservations: customerReservations,
    orderCount: Number(orderCountRow?.value ?? 0),
    resCount: Number(resCountRow?.value ?? 0),
    pageSize: PAGE_SIZE,
  }
}
