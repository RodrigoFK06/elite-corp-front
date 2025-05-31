"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
}

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart.items

  return (
  <div className="flex flex-col gap-4">
    {items
      ? items
          .sort((a, b) => {
            return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
          })
          .map((item) => {
            return (
              <Item
                key={item.id}
                item={item}
                type="preview-card"
                currencyCode={cart.currency_code}
              />
            )
          })
      : repeat(3).map((i) => {
          return <SkeletonLineItem key={i} />
        })}
  </div>
)

}

export default ItemsPreviewTemplate
