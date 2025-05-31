"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text, useToggleState } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address")
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
<div className="bg-[#1a1a1a] text-white px-6 py-8 rounded-md shadow-md w-full border border-[#D8A400]">
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-3 mb-6">
  <div className="flex items-center gap-x-2">
    <Heading
      level="h2"
     className="text-3xl font-bold text-[#FFD700]"
    >
      Dirección de envío
    </Heading>
    {!isOpen && <CheckCircleSolid className="text-green-600 mt-1" />}
  </div>

  {!isOpen && cart?.shipping_address && (
    <button
      onClick={handleEdit}
    className="text-[#FFD700] hover:underline font-medium self-start sm:self-center"
      data-testid="edit-address-button"
    >
      Editar
    </button>
  )}
</div>


  {isOpen ? (
    <form action={formAction}>
      <div className="pb-8">
        <ShippingAddress
          customer={customer}
          checked={sameAsBilling}
          onChange={toggleSameAsBilling}
          cart={cart}
        />

        {!sameAsBilling && (
          <div>
            <Heading
              level="h2"
            className="text-2xl font-semibold text-[#FFD700] pb-4 pt-8"
            >
              Dirección de facturación
            </Heading>

            <BillingAddress cart={cart} />
          </div>
        )}

        <SubmitButton
      className="mt-6 transition-transform transform hover:scale-[1.02] bg-[#8B3A15] text-white hover:bg-[#A65F00]"
            data-testid="submit-address-button"
        >
          Continuar a envío
        </SubmitButton>

        <ErrorMessage error={message} data-testid="address-error-message" />
      </div>
    </form>
  ) : (
    <div className="text-sm text-white">
      {cart && cart.shipping_address ? (
        <div className="flex flex-wrap gap-y-6">
          {/* Dirección de envío */}
          <div className="flex flex-col w-full sm:w-1/3 pr-4" data-testid="shipping-address-summary">
            <Text className="font-semibold mb-1 text-[#FFD700]">Dirección de envío</Text>
            <Text>{cart.shipping_address.first_name} {cart.shipping_address.last_name}</Text>
            <Text>{cart.shipping_address.address_1} {cart.shipping_address.address_2}</Text>
            <Text>{cart.shipping_address.postal_code}, {cart.shipping_address.city}</Text>
            <Text>{cart.shipping_address.country_code?.toUpperCase()}</Text>
          </div>

          {/* Contacto */}
          <div className="flex flex-col w-full sm:w-1/3 pr-4" data-testid="shipping-contact-summary">
            <Text className="font-semibold mb-1  text-[#FFD700]">Contacto</Text>
            <Text>{cart.shipping_address.phone}</Text>
            <Text>{cart.email}</Text>
          </div>

          {/* Dirección de facturación */}
          <div className="flex flex-col w-full sm:w-1/3" data-testid="billing-address-summary">
            <Text className="font-semibold mb-1 text-[#FFD700]">Dirección de facturación</Text>
            {sameAsBilling ? (
              <Text>La dirección de facturación es la misma.</Text>
            ) : (
              <>
                <Text>{cart.billing_address?.first_name} {cart.billing_address?.last_name}</Text>
                <Text>{cart.billing_address?.address_1} {cart.billing_address?.address_2}</Text>
                <Text>{cart.billing_address?.postal_code}, {cart.billing_address?.city}</Text>
                <Text>{cart.billing_address?.country_code?.toUpperCase()}</Text>
              </>
            )}
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  )}

  <Divider className="mt-8" />
  
</div>

  )
}

export default Addresses
