"use client"

import { Text } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  currencyCode: string
  type?: "full" | "preview-card" | "card"
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  // 📱 Vista en móvil o card (checkout)
  if (type === "card" || type === "preview-card") {
    return (
      <div className="flex flex-col gap-3 bg-[var(--color-card-bg)] text-[var(--color-text-primary)] rounded-lg border border-[var(--color-border)] p-4 shadow-md w-full">
        <div className="flex items-start gap-4">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="w-20 h-20 flex-shrink-0"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>

          <div className="flex flex-col min-w-0">
            <Text className="font-semibold text-[var(--color-text-primary)] text-sm truncate">
              {item.product_title}
            </Text>
            <Text className="text-xs text-[var(--color-text-secondary)] truncate">
              Variante: {item.variant?.title}
            </Text>
          </div>
        </div>

        {type !== "preview-card" && (
          <div className="flex justify-between items-center flex-wrap gap-y-2 mt-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
              <DeleteButton id={item.id} />
              <CartItemSelect
                value={item.quantity}
                onChange={(e) => changeQuantity(parseInt(e.target.value))}
                className="w-14 h-9 text-sm"
              >
                {Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => (
                  <option value={i + 1} key={i}>
                    {i + 1}
                  </option>
                ))}
              </CartItemSelect>
              {updating && <Spinner />}
            </div>
            <div className="text-right text-sm">
              <LineItemPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          </div>
        )}

        {type === "preview-card" && (
          <div className="text-right text-sm mt-2">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        )}

        {error && <ErrorMessage error={error} />}
      </div>
    )
  }

  // 🖥 Fallback para tabla en escritorio
  return (
    <tr className="bg-[var(--color-card-bg)] text-[var(--color-text-primary)]">
      <td className="p-4">
        <div className="flex gap-3 items-center">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="w-14 h-14 flex-shrink-0"
          >
            <Thumbnail
              thumbnail={item.thumbnail}
              images={item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>
          <div>
            <Text className="text-sm font-medium text-[var(--color-text-primary)]">
              {item.product_title}
            </Text>
            <Text className="text-xs text-[var(--color-text-secondary)]">
              {item.variant?.title}
            </Text>
          </div>
        </div>
      </td>
      <td className="text-center">
        <div className="flex justify-center items-center gap-2">
          <DeleteButton id={item.id} />
          <CartItemSelect
            value={item.quantity}
            onChange={(e) => changeQuantity(parseInt(e.target.value))}
            className="w-14 h-9 text-sm"
          >
            {Array.from({ length: Math.min(maxQuantity, 10) }, (_, i) => (
              <option value={i + 1} key={i}>
                {i + 1}
              </option>
            ))}
          </CartItemSelect>
          {updating && <Spinner />}
        </div>
        <ErrorMessage error={error} />
      </td>
<td className="text-right pr-4 text-white">
        <LineItemPrice
          item={item}
          style="tight"
          currencyCode={currencyCode}
        />
      </td>
    </tr>
  )
}

export default Item
