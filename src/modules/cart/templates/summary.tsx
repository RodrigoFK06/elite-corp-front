"use client"

import { Button, Heading } from "@medusajs/ui"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4 bg-[var(--color-card-bg)] p-6 rounded-md shadow-md border border-[var(--color-accent)]">
      <Heading level="h2" className="text-[2rem] leading-[2.75rem] text-[var(--color-text-accent)]">
        Resumen
      </Heading>

      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals totals={cart} />

      <LocalizedClientLink
        href={`/checkout?step=${step}`}
        data-testid="checkout-button"
      >
        <Button className="w-full h-10 bg-[var(--color-text-accent)] text-black hover:bg-[var(--color-accent)] transition-colors">
          Ir al pago
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
