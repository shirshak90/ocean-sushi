"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ShoppingBag, User, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@workspace/ui/lib/utils"
import { useCartStore } from "@/stores/cart"

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/order", label: "Order" },
  { href: "/reservation", label: "Reservation" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [atTop, setAtTop] = useState(true)
  const lastScrollY = useRef(0)
  const totalItems = useCartStore((s) => s.totalItems())
  const { data: session, status } = useSession()

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setAtTop(y < 20)
      setVisible(y < lastScrollY.current || y < 80)
      lastScrollY.current = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isAuthenticated = status === "authenticated"
  const firstName = session?.user?.firstName

  function handleSignOut() {
    setOpen(false)
    void signOut({ callbackUrl: "/" })
  }

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: visible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          atTop
            ? "bg-transparent"
            : "border-b border-border/50 bg-background/90 backdrop-blur-md"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-xl font-semibold tracking-widest text-primary">
              海 OCEAN
            </span>
            <span className="hidden text-xs tracking-[0.35em] text-muted-foreground sm:block">
              SUSHI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {links.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "relative text-sm tracking-widest transition-colors duration-200",
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {label.toUpperCase()}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute right-0 -bottom-0.5 left-0 h-px bg-primary"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/order"
              className="relative rounded-full p-2 text-muted-foreground transition-colors hover:text-primary"
              aria-label="Cart"
            >
              <ShoppingBag className="size-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Auth — desktop */}
            <div className="hidden items-center gap-3 md:flex">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className={cn(
                      "flex items-center gap-1.5 text-sm tracking-widest transition-colors duration-200",
                      pathname.startsWith("/profile")
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <User className="size-4" />
                    {firstName ? firstName.toUpperCase() : "PROFILE"}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="rounded p-1.5 text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Sign out"
                  >
                    <LogOut className="size-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-sm tracking-widest text-muted-foreground transition-colors hover:text-foreground"
                  >
                    LOGIN
                  </Link>
                  <Link
                    href="/register"
                    className="rounded border border-primary/40 px-3 py-1 text-xs tracking-widest text-primary transition-colors hover:bg-primary/10"
                  >
                    REGISTER
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="rounded p-1.5 text-muted-foreground transition-colors hover:text-foreground md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 flex w-72 flex-col border-l border-border bg-card px-8 py-20"
            >
              <div className="mb-8 border-b border-border pb-6">
                <span className="font-heading text-lg tracking-widest text-primary">
                  海 OCEAN SUSHI
                </span>
              </div>
              <div className="flex flex-col gap-6">
                {links.map(({ href, label }) => {
                  const active =
                    href === "/" ? pathname === "/" : pathname.startsWith(href)
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        "text-sm tracking-[0.2em] transition-colors",
                        active
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label.toUpperCase()}
                    </Link>
                  )
                })}

                {/* Auth links — mobile */}
                <div className="flex flex-col gap-4 border-t border-border pt-6">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/profile"
                        className={cn(
                          "flex items-center gap-2 text-sm tracking-[0.2em] transition-colors",
                          pathname.startsWith("/profile")
                            ? "text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <User className="size-4" />
                        {firstName
                          ? `${firstName.toUpperCase()} (PROFILE)`
                          : "PROFILE"}
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-sm tracking-[0.2em] text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <LogOut className="size-4" />
                        SIGN OUT
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-sm tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        LOGIN
                      </Link>
                      <Link
                        href="/register"
                        className="text-sm tracking-[0.2em] text-primary transition-colors hover:text-primary/80"
                      >
                        REGISTER
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
