export type UserRole = "ADMIN" | "STAFF"

export type FulfillmentType = "DELIVERY" | "PICKUP"

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "COMPLETED"
  | "CANCELLED"

export type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"

export type DietaryTag = "VEGETARIAN" | "VEGAN" | "GLUTEN_FREE" | "SPICY"

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY"

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  notes?: string
  image?: string | null
}

export interface MenuItemPublic {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  available: boolean
  featured: boolean
  tags: DietaryTag[]
  categoryId: string
  categoryName: string
  categorySlug: string
}

export interface OrderStatusConfig {
  label: string
  color: string
}

export const ORDER_STATUS_CONFIG: Record<OrderStatus, OrderStatusConfig> = {
  PENDING: { label: "Pending", color: "bg-yellow-500/20 text-yellow-400" },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500/20 text-blue-400" },
  PREPARING: { label: "Preparing", color: "bg-orange-500/20 text-orange-400" },
  READY: { label: "Ready", color: "bg-green-500/20 text-green-400" },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    color: "bg-purple-500/20 text-purple-400",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-500/20 text-emerald-400",
  },
  CANCELLED: { label: "Cancelled", color: "bg-red-500/20 text-red-400" },
}

export const RESERVATION_STATUS_CONFIG: Record<
  ReservationStatus,
  OrderStatusConfig
> = {
  PENDING: { label: "Pending", color: "bg-yellow-500/20 text-yellow-400" },
  CONFIRMED: { label: "Confirmed", color: "bg-green-500/20 text-green-400" },
  REJECTED: { label: "Rejected", color: "bg-red-500/20 text-red-400" },
  CANCELLED: { label: "Cancelled", color: "bg-stone-500/20 text-stone-400" },
}

export const DIETARY_TAG_CONFIG: Record<
  DietaryTag,
  { label: string; color: string }
> = {
  VEGETARIAN: {
    label: "Vegetarian",
    color: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  VEGAN: {
    label: "Vegan",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  GLUTEN_FREE: {
    label: "Gluten Free",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  SPICY: {
    label: "Spicy",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
}

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
}

export const MENU_CATEGORIES = [
  { name: "Nigiri", slug: "nigiri" },
  { name: "Sashimi", slug: "sashimi" },
  { name: "Maki Rolls", slug: "maki-rolls" },
  { name: "Signature Rolls", slug: "signature-rolls" },
  { name: "Appetizers", slug: "appetizers" },
  { name: "Desserts", slug: "desserts" },
  { name: "Drinks", slug: "drinks" },
] as const

export const DELIVERY_FEE = 5.0
export const MAX_RESERVATION_GUESTS = 20
export const RESERVATION_TIME_SLOTS = [
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
]
