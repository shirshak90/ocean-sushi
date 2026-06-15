"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Minus, Plus, Trash2, ShoppingBag, Truck, Store } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Field as FormFieldRoot,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field"
import {
  InputGroup,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import { Textarea } from "@workspace/ui/components/textarea"
import { Separator } from "@workspace/ui/components/separator"
import { cn } from "@workspace/ui/lib/utils"
import { CreateOrderSchema } from "@workspace/shared/schemas"
import type { CreateOrderInput } from "@workspace/shared/schemas"
import { zodFormOptions } from "@workspace/shared/forms"
import { formatPrice } from "@workspace/shared/utils"
import { DIETARY_TAG_CONFIG, DELIVERY_FEE } from "@workspace/shared/types"
import type { DietaryTag } from "@workspace/shared/types"
import { useCartStore } from "@/stores/cart"
import { createOrder } from "@/lib/actions/order"

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  tags: DietaryTag[]
  featured: boolean
  category: { name: string; slug: string }
}

export function OrderShell({ items }: { items: MenuItem[] }) {
  const [step, setStep] = useState<"browse" | "checkout">("browse")
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const {
    items: cartItems,
    fulfillmentType,
    addItem,
    removeItem,
    updateQuantity,
    updateNotes,
    setFulfillmentType,
    clearCart,
    subtotal,
  } = useCartStore()

  const sub = subtotal()
  const delivery = fulfillmentType === "DELIVERY" ? DELIVERY_FEE : 0
  const total = sub + delivery

  const form = useForm<CreateOrderInput>({
    ...zodFormOptions,
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: {
      fulfillmentType: "PICKUP",
      items: [],
      customer: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        companyName: "",
      },
      address: {
        street: "",
        number: "",
        bus: "",
        postalCode: "",
        city: "",
        country: "",
      },
    },
  })

  const { errors } = form.formState

  function handleCheckoutSubmit(e: React.FormEvent<HTMLFormElement>) {
    form.setValue(
      "items",
      cartItems.map((i) => ({
        menuItemId: i.id,
        quantity: i.quantity,
        notes: i.notes,
      }))
    )
    form.setValue("fulfillmentType", fulfillmentType)
    void form.handleSubmit(onSubmit)(e)
  }

  async function onSubmit(data: CreateOrderInput) {
    setLoading(true)
    setServerError(null)

    const result = await createOrder(data)
    setLoading(false)

    if (!result.success) {
      setServerError(result.error)
      return
    }

    clearCart()
    router.push(`/order/confirmation/${result.orderNumber}`)
  }

  const byCategory = items.reduce<
    Record<string, { categoryName: string; items: MenuItem[] }>
  >((acc, item) => {
    const key = item.category.slug
    if (!acc[key]) acc[key] = { categoryName: item.category.name, items: [] }
    acc[key]!.items.push(item)
    return acc
  }, {})

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* LEFT — menu browser */}
        <div className="flex-1">
          {step === "browse" ? (
            <div className="flex flex-col gap-10">
              {Object.entries(byCategory).map(
                ([slug, { categoryName, items: catItems }]) => (
                  <div key={slug}>
                    <div className="mb-4 flex items-center gap-3">
                      <h2 className="font-heading text-xl">{categoryName}</h2>
                      <div className="flex-1 border-t border-border" />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {catItems.map((item) => {
                        const cartItem = cartItems.find((c) => c.id === item.id)
                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "group flex gap-3 rounded-lg border bg-card p-4 transition-colors",
                              cartItem
                                ? "border-primary/40"
                                : "border-border hover:border-border/80"
                            )}
                          >
                            <div className="relative size-16 shrink-0 overflow-hidden rounded bg-muted">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center bg-gradient-to-br from-stone-900 to-stone-800">
                                  <span className="font-heading text-xl text-primary/20">
                                    海
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                              <div className="flex items-start justify-between gap-1">
                                <h3 className="text-sm leading-snug font-medium">
                                  {item.name}
                                </h3>
                                <span className="shrink-0 text-sm text-primary">
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {item.description}
                              </p>
                              {item.tags.length > 0 && (
                                <div className="flex gap-1">
                                  {item.tags.slice(0, 2).map((tag) => (
                                    <span
                                      key={tag}
                                      className={`rounded border px-1.5 py-0.5 text-[9px] ${DIETARY_TAG_CONFIG[tag].color}`}
                                    >
                                      {DIETARY_TAG_CONFIG[tag].label}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="mt-auto flex items-center justify-end">
                                {cartItem ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          cartItem.quantity - 1
                                        )
                                      }
                                      className="flex size-6 items-center justify-center rounded border border-border text-muted-foreground hover:border-primary hover:text-primary"
                                    >
                                      <Minus className="size-3" />
                                    </button>
                                    <span className="w-4 text-center text-sm">
                                      {cartItem.quantity}
                                    </span>
                                    <button
                                      onClick={() =>
                                        updateQuantity(
                                          item.id,
                                          cartItem.quantity + 1
                                        )
                                      }
                                      className="flex size-6 items-center justify-center rounded border border-border text-muted-foreground hover:border-primary hover:text-primary"
                                    >
                                      <Plus className="size-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() =>
                                      addItem({
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        image: item.image,
                                      })
                                    }
                                    className="rounded border border-primary/40 px-2.5 py-1 text-xs text-primary transition-colors hover:bg-primary/10"
                                  >
                                    + Add
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form
              noValidate
              onSubmit={handleCheckoutSubmit}
              className="flex flex-col gap-8"
            >
              {serverError && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  {serverError}
                </div>
              )}

              {errors.items?.message && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                  {errors.items.message}
                </div>
              )}

              {/* Fulfillment */}
              <section>
                <h3 className="mb-4 font-heading text-lg">Fulfillment</h3>
                <div className="grid grid-cols-2 gap-3">
                  {(["PICKUP", "DELIVERY"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setFulfillmentType(type)
                        form.setValue("fulfillmentType", type)
                      }}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-4 text-left transition-colors",
                        fulfillmentType === type
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-border/80"
                      )}
                    >
                      {type === "PICKUP" ? (
                        <Store className="size-5 shrink-0" />
                      ) : (
                        <Truck className="size-5 shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {type === "PICKUP" ? "Pickup (To Go)" : "Delivery"}
                        </p>
                        <p className="text-xs">
                          {type === "PICKUP"
                            ? "Free"
                            : `+${formatPrice(DELIVERY_FEE)}`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Personal data */}
              <section>
                <h3 className="mb-4 font-heading text-lg">
                  Personal Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="First Name *"
                    error={errors.customer?.firstName?.message}
                  >
                    <InputGroup>
                      <InputGroupInput
                        {...form.register("customer.firstName")}
                        placeholder="Kenji"
                        aria-invalid={
                          !!errors.customer?.firstName
                        }
                      />
                    </InputGroup>
                  </Field>
                  <Field
                    label="Last Name *"
                    error={errors.customer?.lastName?.message}
                  >
                    <InputGroup>
                      <InputGroupInput
                        {...form.register("customer.lastName")}
                        placeholder="Tanaka"
                        aria-invalid={!!errors.customer?.lastName}
                      />
                    </InputGroup>
                  </Field>
                  <Field
                    label="Email *"
                    error={errors.customer?.email?.message}
                  >
                    <InputGroup>
                      <InputGroupInput
                        {...form.register("customer.email")}
                        type="email"
                        placeholder="you@example.com"
                        aria-invalid={!!errors.customer?.email}
                      />
                    </InputGroup>
                  </Field>
                  <Field
                    label="Phone *"
                    error={errors.customer?.phone?.message}
                  >
                    <InputGroup>
                      <InputGroupInput
                        {...form.register("customer.phone")}
                        type="tel"
                        placeholder="+1 (212) 555-0198"
                        aria-invalid={!!errors.customer?.phone}
                      />
                    </InputGroup>
                  </Field>
                  <Field
                    label="Company / Team (optional)"
                    className="sm:col-span-2"
                  >
                    <InputGroup>
                      <InputGroupInput
                        {...form.register("customer.companyName")}
                        placeholder="Optional"
                      />
                    </InputGroup>
                  </Field>
                </div>
              </section>

              {/* Address — only for delivery */}
              <AnimatePresence>
                {fulfillmentType === "DELIVERY" && (
                  <motion.section
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="mb-4 font-heading text-lg">
                      Delivery Address
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        label="Street *"
                        error={errors.address?.street?.message}
                        className="sm:col-span-2"
                      >
                        <InputGroup>
                          <InputGroupInput
                            {...form.register("address.street")}
                            placeholder="Sakura Street"
                            aria-invalid={!!errors.address?.street}
                          />
                        </InputGroup>
                      </Field>
                      <Field
                        label="Number *"
                        error={errors.address?.number?.message}
                      >
                        <InputGroup>
                          <InputGroupInput
                            {...form.register("address.number")}
                            placeholder="123"
                            aria-invalid={!!errors.address?.number}
                          />
                        </InputGroup>
                      </Field>
                      <Field label="Bus / Apt (optional)">
                        <InputGroup>
                          <InputGroupInput
                            {...form.register("address.bus")}
                            placeholder="Apt 4B"
                          />
                        </InputGroup>
                      </Field>
                      <Field
                        label="Postal Code *"
                        error={
                          errors.address?.postalCode?.message
                        }
                      >
                        <InputGroup>
                          <InputGroupInput
                            {...form.register("address.postalCode")}
                            placeholder="10001"
                            aria-invalid={
                              !!errors.address?.postalCode
                            }
                          />
                        </InputGroup>
                      </Field>
                      <Field
                        label="City *"
                        error={errors.address?.city?.message}
                      >
                        <InputGroup>
                          <InputGroupInput
                            {...form.register("address.city")}
                            placeholder="New York"
                            aria-invalid={!!errors.address?.city}
                          />
                        </InputGroup>
                      </Field>
                      <Field
                        label="Country *"
                        error={errors.address?.country?.message}
                        className="sm:col-span-2"
                      >
                        <InputGroup>
                          <InputGroupInput
                            {...form.register("address.country")}
                            placeholder="United States"
                            aria-invalid={
                              !!errors.address?.country
                            }
                          />
                        </InputGroup>
                      </Field>
                    </div>
                  </motion.section>
                )}
              </AnimatePresence>

              {/* Order details */}
              <section>
                <h3 className="mb-4 font-heading text-lg">Order Details</h3>
                <div className="flex flex-col gap-4">
                  <Field label="Special Instructions (optional)">
                    <Textarea
                      {...form.register("notes")}
                      placeholder="Allergies, preferences, spice level…"
                      rows={3}
                    />
                  </Field>
                  <Field label="Preferred Time (optional)">
                    <InputGroup>
                      <InputGroupInput
                        {...form.register("preferredTime")}
                        placeholder="e.g. 7:30 PM"
                      />
                    </InputGroup>
                  </Field>
                </div>
              </section>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("browse")}
                  className="flex-1"
                >
                  Back to Menu
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading || cartItems.length === 0}
                >
                  {loading
                    ? "Placing order…"
                    : `Place Order · ${formatPrice(total)}`}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT — cart */}
        <aside className="lg:w-80">
          <div className="sticky top-24 overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-primary" />
                <h3 className="font-medium">Your Cart</h3>
              </div>
              {cartItems.length > 0 && (
                <button
                  onClick={() => useCartStore.getState().clearCart()}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <ShoppingBag className="size-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Your cart is empty
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="max-h-80 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 border-b border-border px-4 py-3"
                    >
                      <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-medium">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="flex size-5 items-center justify-center rounded border border-border text-muted-foreground hover:border-primary hover:text-primary"
                        >
                          <Minus className="size-2.5" />
                        </button>
                        <span className="w-4 text-center text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="flex size-5 items-center justify-center rounded border border-border text-muted-foreground hover:border-primary hover:text-primary"
                        >
                          <Plus className="size-2.5" />
                        </button>
                      </div>
                      <span className="w-14 text-right text-sm text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-4">
                  <div className="mb-3 flex flex-col gap-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{formatPrice(sub)}</span>
                    </div>
                    {fulfillmentType === "DELIVERY" && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Delivery fee</span>
                        <span>{formatPrice(delivery)}</span>
                      </div>
                    )}
                    <Separator className="my-1" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {step === "browse" ? (
                    <Button
                      className="w-full"
                      onClick={() => setStep("checkout")}
                    >
                      Checkout
                    </Button>
                  ) : (
                    <p className="text-center text-xs text-muted-foreground">
                      Fill in the form to place your order
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <FormFieldRoot data-invalid={!!error} className={cn(className)}>
      <FieldLabel className="text-xs tracking-wide text-muted-foreground">
        {label}
      </FieldLabel>
      {children}
      <FieldError>{error}</FieldError>
    </FormFieldRoot>
  )
}
