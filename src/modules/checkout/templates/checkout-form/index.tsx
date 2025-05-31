import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { HttpTypes } from "@medusajs/types"
import Addresses from "@modules/checkout/components/addresses"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import Shipping from "@modules/checkout/components/shipping"
import Footer from "@modules/layout/templates/footer"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) {
  if (!cart) {
    return null
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  if (!shippingMethods || !paymentMethods) {
    return null
  }

  return (
  <div className="min-h-screen flex flex-col items-center bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] px-4 sm:px-6 py-10">
      <div className="w-full max-w-4xl space-y-6">
        {/* Dirección */}
        <Addresses cart={cart} customer={customer} />

        {/* Envío */}
          <Shipping cart={cart} availableShippingMethods={shippingMethods} />

        {/* Pago */}
          <Payment cart={cart} availablePaymentMethods={paymentMethods} />

        {/* Revisión */}
          <Review cart={cart} />
      </div>
    </div>
  )
}
