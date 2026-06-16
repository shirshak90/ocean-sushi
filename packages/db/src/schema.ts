import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  date,
} from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"

export const userRoleEnum = pgEnum("UserRole", ["ADMIN", "STAFF"])
export const fulfillmentTypeEnum = pgEnum("FulfillmentType", [
  "DELIVERY",
  "PICKUP",
])
export const orderStatusEnum = pgEnum("OrderStatus", [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "OUT_FOR_DELIVERY",
  "COMPLETED",
  "CANCELLED",
])
export const reservationStatusEnum = pgEnum("ReservationStatus", [
  "PENDING",
  "CONFIRMED",
  "REJECTED",
  "CANCELLED",
])
export const dietaryTagEnum = pgEnum("DietaryTag", [
  "VEGETARIAN",
  "VEGAN",
  "GLUTEN_FREE",
  "SPICY",
])
export const dayOfWeekEnum = pgEnum("DayOfWeek", [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
])

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("STAFF"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const customers = pgTable("customers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  companyName: text("companyName"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const addresses = pgTable("addresses", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  customerId: text("customerId")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  street: text("street").notNull(),
  number: text("number").notNull(),
  bus: text("bus"),
  postalCode: text("postalCode").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
})

export const menuCategories = pgTable("menu_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const menuItems = pgTable("menu_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  categoryId: text("categoryId")
    .notNull()
    .references(() => menuCategories.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  available: boolean("available").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  tags: dietaryTagEnum("tags")
    .array()
    .notNull()
    .default(sql`ARRAY[]::\"DietaryTag\"[]`),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const orders = pgTable("orders", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderNumber: text("orderNumber").notNull().unique(),
  customerId: text("customerId")
    .notNull()
    .references(() => customers.id),
  addressId: text("addressId").references(() => addresses.id),
  fulfillmentType: fulfillmentTypeEnum("fulfillmentType").notNull(),
  status: orderStatusEnum("status").notNull().default("PENDING"),
  notes: text("notes"),
  preferredTime: text("preferredTime"),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryFee: numeric("deliveryFee", { precision: 10, scale: 2 })
    .notNull()
    .default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const orderItems = pgTable("order_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  orderId: text("orderId")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: text("menuItemId")
    .notNull()
    .references(() => menuItems.id),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unitPrice", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
})

export const reservations = pgTable("reservations", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  date: date("date", { mode: "date" }).notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  notes: text("notes"),
  status: reservationStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const galleryImages = pgTable("gallery_images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  url: text("url").notNull(),
  category: text("category").notNull(),
  title: text("title"),
  sortOrder: integer("sortOrder").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

export const openingHours = pgTable("opening_hours", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  dayOfWeek: dayOfWeekEnum("dayOfWeek").notNull().unique(),
  openTime: text("openTime").notNull(),
  closeTime: text("closeTime").notNull(),
  isClosed: boolean("isClosed").notNull().default(false),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const contactMessages = pgTable("contact_messages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").notNull().default(false),
  isArchived: boolean("isArchived").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
})

// Relations
export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
  addresses: many(addresses),
}))

export const addressesRelations = relations(addresses, ({ one, many }) => ({
  customer: one(customers, {
    fields: [addresses.customerId],
    references: [customers.id],
  }),
  orders: many(orders),
}))

export const menuCategoriesRelations = relations(
  menuCategories,
  ({ many }) => ({
    items: many(menuItems),
  })
)

export const menuItemsRelations = relations(menuItems, ({ one, many }) => ({
  category: one(menuCategories, {
    fields: [menuItems.categoryId],
    references: [menuCategories.id],
  }),
  orderItems: many(orderItems),
}))

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  orderItems: many(orderItems),
}))

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  menuItem: one(menuItems, {
    fields: [orderItems.menuItemId],
    references: [menuItems.id],
  }),
}))
