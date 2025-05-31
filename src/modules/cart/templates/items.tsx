"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"
import { useEffect, useState } from "react"
import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items || []

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const sortedItems = [...items].sort((a, b) =>
    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
  )

  return (
    <div className="bg-[var(--color-card-bg)] p-6 rounded-md shadow-md border border-[var(--color-accent)]">
      <div className="pb-4">
        <Heading className="text-2xl font-semibold text-[var(--color-text-accent)]">
          Carrito
        </Heading>
      </div>

      {!isMobile ? (
        <Table className="text-[var(--color-text-primary)] border border-[var(--color-accent)] rounded-md overflow-hidden w-full">
      <Table.Header className="bg-[var(--color-bg-secondary)] text-sm uppercase text-black tracking-wide">
            <Table.Row>
              <Table.HeaderCell className="!pl-4 py-3">Producto</Table.HeaderCell>
              <Table.HeaderCell>Cantidad</Table.HeaderCell>
              <Table.HeaderCell className="text-right !pr-4">Total</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body className="bg-[var(--color-card-bg)] divide-y divide-[var(--color-accent)]">
            {sortedItems.length > 0
              ? sortedItems.map((item) => (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={cart?.currency_code ?? ""}
                    type="full"
                  />
                ))
              : repeat(3).map((i) => <SkeletonLineItem key={i} />)}
          </Table.Body>
        </Table>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedItems.length > 0
            ? sortedItems.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={cart?.currency_code ?? ""}
                  type="card"
                />
              ))
            : repeat(3).map((i) => <SkeletonLineItem key={i} />)}
        </div>
      )}
    </div>
  )
}

export default ItemsTemplate
