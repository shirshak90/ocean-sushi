import Link from "next/link"
import type { ComponentProps } from "react"

export function AdminLink({
  prefetch = false,
  ...props
}: ComponentProps<typeof Link>) {
  return <Link prefetch={prefetch} {...props} />
}
