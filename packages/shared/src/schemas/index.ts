import { z } from "zod"

export const AddressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  number: z.string().min(1, "Number is required"),
  bus: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
})

export const CustomerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  companyName: z.string().optional(),
})

export const OrderItemSchema = z.object({
  menuItemId: z.string().min(1),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
})

export const CreateOrderSchema = z
  .object({
    customer: CustomerSchema,
    address: AddressSchema.optional(),
    items: z.array(OrderItemSchema).min(1, "Cart is empty"),
    fulfillmentType: z.enum(["DELIVERY", "PICKUP"]),
    notes: z.string().optional(),
    preferredTime: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fulfillmentType !== "DELIVERY") return

    const result = AddressSchema.safeParse(data.address ?? {})
    if (result.success) return

    for (const issue of result.error.issues) {
      ctx.addIssue({
        code: "custom",
        message: issue.message,
        path: ["address", ...issue.path],
      })
    }
  })

export const ReservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  guests: z
    .number()
    .int()
    .min(1, "At least 1 guest required")
    .max(20, "Maximum 20 guests"),
  notes: z.string().optional(),
})

export const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

export const MenuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string().optional(),
  available: z.boolean(),
  featured: z.boolean(),
  tags: z.array(z.enum(["VEGETARIAN", "VEGAN", "GLUTEN_FREE", "SPICY"])),
})

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "COMPLETED",
    "CANCELLED",
  ]),
})

export const UpdateReservationStatusSchema = z.object({
  reservationId: z.string().min(1),
  status: z.enum(["PENDING", "CONFIRMED", "REJECTED", "CANCELLED"]),
})

export const OpeningHourSchema = z.object({
  dayOfWeek: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  openTime: z.string().min(1),
  closeTime: z.string().min(1),
  isClosed: z.boolean().default(false),
})

export const GalleryImageSchema = z.object({
  url: z.string().min(1, "Image URL is required").url("Please enter a valid URL"),
  category: z.string().min(1, "Category is required"),
  title: z.string().optional(),
})

export type AddressInput = z.infer<typeof AddressSchema>
export type CustomerInput = z.infer<typeof CustomerSchema>
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>
export type ReservationInput = z.infer<typeof ReservationSchema>
export type ContactInput = z.infer<typeof ContactSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type MenuItemInput = z.infer<typeof MenuItemSchema>
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>
export type UpdateReservationStatusInput = z.infer<
  typeof UpdateReservationStatusSchema
>
export type OpeningHourInput = z.infer<typeof OpeningHourSchema>
export type GalleryImageInput = z.infer<typeof GalleryImageSchema>
