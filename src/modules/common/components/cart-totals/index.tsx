"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    shipping_total?: number | null
    discount_total?: number | null
    gift_card_total?: number | null
    currency_code: string
    shipping_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    subtotal,
    tax_total,
    discount_total,
    gift_card_total,
    shipping_subtotal,
  } = totals

  return (
    <div className="text-[var(--color-text-primary)]">
      <div className="flex flex-col gap-y-2 text-sm">
        <div className="flex items-center justify-between text-[var(--color-text-primary)]">
          <span className="text-[var(--color-text-accent)]">
            Subtotal (sin envío ni IGV)
          </span>
          <span data-testid="cart-subtotal" data-value={subtotal || 0}>
            {convertToLocale({ amount: subtotal ?? 0, currency_code })}
          </span>
        </div>

        {!!discount_total && (
          <div className="flex items-center justify-between text-red-400">
            <span>Descuento</span>
            <span data-testid="cart-discount" data-value={discount_total || 0}>
              -{" "}
              {convertToLocale({
                amount: discount_total ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span>Método de envío</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0}>
            {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span>IGV</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0}>
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>

        {!!gift_card_total && (
          <div className="flex items-center justify-between text-pink-300">
            <span>Tarjeta de regalo</span>
            <span
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              -{" "}
              {convertToLocale({
                amount: gift_card_total ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
      </div>

      <div className="h-px w-full border-b border-[var(--color-border)] my-4" />

      <div className="flex items-center justify-between text-lg font-semibold text-[var(--color-text-accent)] mb-2">
        <span>Total</span>
        <span data-testid="cart-total" data-value={total || 0}>
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>

      <div className="h-px w-full border-b border-[var(--color-border)] mt-4" />
    </div>
  )
}

export default CartTotals
