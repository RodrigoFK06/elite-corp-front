import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0">
    <div className="w-full bg-[#1A1A1A] text-white border border-[#D8A400] rounded-lg shadow-md p-6">   
        <Divider className="my-6 small:hidden" />
        <Heading
          level="h2"
           className="flex flex-row text-xl font-bold text-[#FFD700]"
        >
          En tu carrito
        </Heading>
        <Divider className="my-6" />
        <CartTotals totals={cart} />
      <div className="bg-[#2A2A2A] rounded-lg shadow-inner p-4 border border-[#A67C00]">
<div className="w-full bg-[#2A2A2A] rounded-lg shadow-md p-6 overflow-x-auto border border-[#A67C00]">

         <ItemsPreviewTemplate cart={cart} />
        </div>
        </div>

        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
