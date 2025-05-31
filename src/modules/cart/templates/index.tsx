import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
<div className="min-h-screen bg-gradient-to-b from-[#FFD700]/10 via-[#1a1a1a]/70 to-black">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-40">
            {/* 🛍 Columna izquierda: productos */}
            <div className="flex flex-col py-6 gap-y-6">
              {!customer && (
                <>
{/* <SignInPrompt /> */}              
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>

            {/* 📦 Columna derecha: resumen */}
            <div className="relative">
              <div className="flex flex-col gap-y-8">
                {cart && cart.region && (
                  <div className="py-6">
                    <Summary cart={cart as any} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-screen">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
