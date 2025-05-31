"use client"

import { Badge, Heading, Input, Text } from "@medusajs/ui"
import React, { useActionState } from "react"

import { applyPromotions, submitPromotionForm } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { promotions = [] } = cart

  const removePromotionCode = async (code: string) => {
    const validPromotions = promotions.filter((p) => p.code !== code)

    await applyPromotions(
      validPromotions.filter((p) => p.code === undefined).map((p) => p.code!)
    )
  }

  const addPromotionCode = async (formData: FormData) => {
    const code = formData.get("code")
    if (!code) return

    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code === undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    await applyPromotions(codes)
    if (input) input.value = ""
  }

  const [message, formAction] = useActionState(submitPromotionForm, null)

  return (
    <div className="w-full flex flex-col bg-[var(--color-card-bg)] px-2 pb-2 pt-0 rounded-md border border-[var(--color-border)]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-medium text-[var(--color-text-accent)] hover:underline w-fit mb-2"
        data-testid="add-discount-button"
      >
        Agregar código de promoción
      </button>

      {isOpen && (
        <form
          action={(a) => addPromotionCode(a)}
          className="flex items-center gap-2 mb-2"
        >
          <Input
            id="promotion-input"
            name="code"
            type="text"
            placeholder="Código"
            className="w-full max-w-[200px] text-black"
            data-testid="discount-input"
          />
          <SubmitButton
            variant="secondary"
            data-testid="discount-apply-button"
            className="text-sm bg-[var(--color-text-accent)] text-black hover:bg-[var(--color-accent)]"
          >
            Aplicar
          </SubmitButton>
        </form>
      )}

      {message && (
        <ErrorMessage
          error={message}
          data-testid="discount-error-message"
          className="mb-2"
        />
      )}

      {promotions.length > 0 && (
        <div className="flex flex-col gap-1 mt-1">
          <Heading className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
            Promociones aplicadas:
          </Heading>
          {promotions.map((promotion) => (
            <div
              key={promotion.id}
              className="flex justify-between items-center text-sm bg-[#262626] px-3 py-2 rounded shadow-sm"
            >
              <Text className="truncate max-w-[70%] text-[var(--color-text-primary)]">
                <Badge
                  color={promotion.is_automatic ? "green" : "grey"}
                  size="small"
                >
                  {promotion.code}
                </Badge>{" "}
                (
                {promotion.application_method?.value !== undefined &&
                  promotion.application_method.currency_code !== undefined && (
                    <>
                      {promotion.application_method.type === "percentage"
                        ? `${promotion.application_method.value}%`
                        : convertToLocale({
                            amount: promotion.application_method.value,
                            currency_code:
                              promotion.application_method.currency_code,
                          })}
                    </>
                  )}
                )
              </Text>
              {!promotion.is_automatic && (
                <button
                  onClick={() =>
                    promotion.code && removePromotionCode(promotion.code)
                  }
                  className="text-red-400 hover:text-red-600"
                  data-testid="remove-discount-button"
                >
                  <Trash size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DiscountCode
