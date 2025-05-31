import { Heading } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="py-6 min-h-[calc(100vh-64px)] bg-[#1A1A1A] text-white">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-[#1A1A1A] w-full py-10 border border-[#8B3A15] rounded-md shadow-lg px-6"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="flex flex-col gap-y-3 text-[#FFD700] text-3xl mb-4"
          >
            <span>Gracias!</span>
            <span>Tu orden fue apropiadamente procesada.</span>
          </Heading>

          <OrderDetails order={order} />

          <Heading
            level="h2"
            className="flex flex-row text-2xl font-semibold text-[#FFD700] mt-6"
          >
            Resumen
          </Heading>

          <Items order={order} />
          <CartTotals totals={order} />

          <Heading
            level="h2"
            className="flex flex-row text-2xl font-semibold text-[#FFD700] mt-6"
          >
            Delivery
          </Heading>
          <ShippingDetails order={order} />

          <Heading
            level="h2"
            className="flex flex-row text-2xl font-semibold text-[#FFD700] mt-6"
          >
            Pago
          </Heading>
          <PaymentDetails order={order} />

          <Help />
        </div>
      </div>
    </div>
  )
}
