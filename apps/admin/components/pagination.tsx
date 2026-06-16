import { ChevronLeft, ChevronRight } from "lucide-react"
import { AdminLink } from "@/components/admin-link"

interface Props {
  currentPage: number
  totalPages: number
  baseHref: string
  params?: Record<string, string>
}

function buildHref(base: string, params: Record<string, string>, page: number) {
  const p = new URLSearchParams({ ...params, page: String(page) })
  return `${base}?${p.toString()}`
}

function pageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | "...")[] = [1]

  if (current > 3) pages.push("...")

  for (
    let p = Math.max(2, current - 1);
    p <= Math.min(total - 1, current + 1);
    p++
  ) {
    pages.push(p)
  }

  if (current < total - 2) pages.push("...")
  pages.push(total)

  return pages
}

export function Pagination({
  currentPage,
  totalPages,
  baseHref,
  params = {},
}: Props) {
  if (totalPages <= 1) return null

  const pages = pageNumbers(currentPage, totalPages)

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3">
      <p className="text-xs text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <AdminLink
          href={buildHref(baseHref, params, currentPage - 1)}
          aria-disabled={currentPage <= 1}
          className={`flex size-7 items-center justify-center rounded border border-border transition-colors ${currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:border-primary/40 hover:text-primary"}`}
        >
          <ChevronLeft className="size-3.5" />
        </AdminLink>

        {pages.map((p, i) =>
          p === "..." ? (
            <span
              key={`e-${i}`}
              className="flex size-7 items-center justify-center text-xs text-muted-foreground"
            >
              …
            </span>
          ) : (
            <AdminLink
              key={p}
              href={buildHref(baseHref, params, p)}
              className={`flex size-7 items-center justify-center rounded border text-xs transition-colors ${p === currentPage ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"}`}
            >
              {p}
            </AdminLink>
          )
        )}

        <AdminLink
          href={buildHref(baseHref, params, currentPage + 1)}
          aria-disabled={currentPage >= totalPages}
          className={`flex size-7 items-center justify-center rounded border border-border transition-colors ${currentPage >= totalPages ? "pointer-events-none opacity-40" : "hover:border-primary/40 hover:text-primary"}`}
        >
          <ChevronRight className="size-3.5" />
        </AdminLink>
      </div>
    </div>
  )
}
