import type { Metadata } from "next"
import { getMenuItemsAdmin, getMenuCategories } from "@/lib/actions/menu"
import { formatPrice } from "@workspace/shared/utils"
import { DIETARY_TAG_CONFIG } from "@workspace/shared/types"
import type { DietaryTag } from "@workspace/shared/types"
import { MenuItemActions } from "@/components/menu/menu-item-actions"
import { CategoryActions } from "@/components/menu/category-actions"

export const metadata: Metadata = { title: "Menu Management" }

export default async function MenuPage() {
  const [items, categories] = await Promise.all([
    getMenuItemsAdmin(),
    getMenuCategories(),
  ])

  const byCategory = categories.map((cat) => ({
    ...cat,
    items: items.filter((i) => i.categoryId === cat.id),
  }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-light">Menu Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} items across {categories.length} categories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CategoryActions categories={categories} />
          <MenuItemActions mode="create" categories={categories} />
        </div>
      </div>

      {byCategory.map((cat) => (
        <div key={cat.id}>
          <div className="mb-3 flex items-center gap-3">
            <h2 className="font-heading text-lg">{cat.name}</h2>
            <span className="text-xs text-muted-foreground">
              ({cat.items.length})
            </span>
            <div className="flex-1 border-t border-border" />
          </div>

          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Tags</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Featured</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cat.items.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-muted-foreground"
                    >
                      No items in this category.
                    </td>
                  </tr>
                )}
                {cat.items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <p className="font-medium">{item.name}</p>
                      <p className="line-clamp-1 max-w-xs text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-medium text-primary">
                      {formatPrice(parseFloat(item.price))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(item.tags as DietaryTag[]).map((tag) => (
                          <span
                            key={tag}
                            className={`rounded border px-1.5 py-0.5 text-[9px] ${DIETARY_TAG_CONFIG[tag].color}`}
                          >
                            {DIETARY_TAG_CONFIG[tag].label}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${item.available ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {item.featured && (
                        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <MenuItemActions
                        mode="edit"
                        item={{
                          ...item,
                          price: parseFloat(item.price),
                          tags: item.tags as DietaryTag[],
                        }}
                        categories={categories}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
