"use server"

import {
  db,
  orders,
  customers,
  addresses,
  orderItems,
  menuItems,
} from "@workspace/db"
import { eq, desc } from "drizzle-orm"
import { UpdateOrderStatusSchema } from "@workspace/shared/schemas"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { OrderStatus } from "@workspace/shared/types"

export async function updateOrderStatus(raw: unknown) {
  const session = await auth()
  if (!session) return { success: false, error: "Unauthorized" }

  const parsed = UpdateOrderStatusSchema.safeParse(raw)
  if (!parsed.success) return { success: false, error: "Invalid data" }

  const { orderId, status } = parsed.data
  await db
    .update(orders)
    .set({ status: status as OrderStatus })
    .where(eq(orders.id, orderId))
  revalidatePath("/orders")
  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

export async function getOrders(status?: string) {
  return db.query.orders.findMany({
    where:
      status && status !== "all"
        ? eq(orders.status, status as OrderStatus)
        : undefined,
    orderBy: (t, { desc }) => [desc(t.createdAt)],
    with: {
      customer: {
        columns: {
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
      address: true,
      orderItems: true,
    },
  })
}

export async function getOrderById(id: string) {
  return db.query.orders.findFirst({
    where: eq(orders.id, id),
    with: {
      customer: true,
      address: true,
      orderItems: {
        with: { menuItem: { columns: { name: true, image: true } } },
      },
    },
  })
}
