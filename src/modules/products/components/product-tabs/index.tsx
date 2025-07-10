"use client"

import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Información del producto",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Envíos y reembolsos",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full text-[var(--color-text-primary)]">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
      <div className="text-sm py-4 text-white">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-[var(--color-accent)]">Material</span>
            <p>{product.material || "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <span className="font-semibold text-[var(--color-accent)]">Mililitros</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
  <div className="text-sm py-4 text-white">
      <div className="grid grid-cols-1 gap-y-8">
        <div className="flex items-start gap-x-3">
          <FastDelivery />
          <div>
            <span className="font-semibold text-[var(--color-accent)]">Envío rápido</span>
            <p className="max-w-sm">
              Su pedido se enviará el mismo día después de confirmar su compra.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-3">
          <Refresh />
          <div>
            <span className="font-semibold text-[var(--color-accent)]">Reembolsos sencillos</span>
            <p className="max-w-sm">
              ¿Le llegó algo que no pidió? No se preocupe, nos aseguraremos de cambiarlo en caso de error.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
