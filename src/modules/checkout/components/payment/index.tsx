"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession,retrieveCart } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const safeSearchParams = searchParams ?? new URLSearchParams()

   const isOpen = safeSearchParams.get("step") === "payment"

  const isStripe = isStripeFunc(selectedPaymentMethod)

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)

    const provider_id = method.startsWith("pp_system_default")
      ? "pp_system_default"
      : method

    if (isStripeFunc(method)) {
      await initiatePaymentSession(cart, {
        provider_id,
      })
    } else {
      await initiatePaymentSession(cart, { provider_id })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

 const createQueryString = useCallback(
  (name: string, value: string) => {
    const params = new URLSearchParams(safeSearchParams)

      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
  setIsLoading(true)
  try {
    const shouldInputCard =
      isStripeFunc(selectedPaymentMethod) && !activeSession

    const checkActiveSession =
      activeSession?.provider_id === selectedPaymentMethod

    if (!checkActiveSession) {
      const provider_id = selectedPaymentMethod.startsWith("pp_system_default")
        ? "pp_system_default"
        : selectedPaymentMethod

      await initiatePaymentSession(cart, { provider_id })
    }

    // 🔄 Refrescar carrito para asegurar que tenga sesión válida antes de redirigir
    const refreshedCart = await retrieveCart(cart.id)
    const refreshedSession = refreshedCart?.payment_collection?.payment_sessions?.find(
      (session) => session.status === "pending"
    )

    if (!refreshedSession) {
      setError("Error: No se pudo establecer una sesión de pago válida.")
      return
    }

    if (!shouldInputCard) {
      return router.push(
        pathname + "?" + createQueryString("step", "review"),
        {
          scroll: false,
        }
      )
    }
  } catch (err: any) {
    setError(err.message || "Error al procesar el pago.")
  } finally {
    setIsLoading(false)
  }
}
useEffect(() => {
  if (selectedPaymentMethod?.startsWith("pp_system_default")) {
    const timerElement = document.getElementById("timer")
    let secondsLeft = 15 * 60
    const interval = setInterval(() => {
      const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0")
      const secs = String(secondsLeft % 60).padStart(2, "0")
      if (timerElement) timerElement.innerText = `${mins}:${secs}`
      secondsLeft -= 1
      if (secondsLeft < 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }
}, [selectedPaymentMethod])

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
<div className="bg-[#1a1a1a] text-white p-6 rounded-md shadow-md w-full border border-[#D8A400]">
   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
  <Heading
    level="h2"
    className={clx(
      "flex flex-row text-3xl font-bold text-[#FFD700] gap-x-2 items-baseline",
      {
        "opacity-50 pointer-events-none select-none":
          !isOpen && !paymentReady,
      }
    )}
  >
    Metodo de Pago
    {!isOpen && paymentReady && <CheckCircleSolid />}
  </Heading>

  {!isOpen && paymentReady && (
    <Text>
      <button
        onClick={handleEdit}
        className="text-[#8B3A15] hover:underline font-medium"
        data-testid="edit-payment-button"
      >
        Editar
      </button>
    </Text>
  )}
</div>

      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && (
            <>
           <RadioGroup
  value={selectedPaymentMethod}
  onChange={(value: string) => setPaymentMethod(value)}
>
  {["pp_system_default_yape", "pp_system_default_transfer"].map((paymentMethod) => (
    <div key={paymentMethod}>
      <div
        onClick={() => setPaymentMethod(paymentMethod)}
        className={clx(
          "border rounded-md p-4 mb-4 cursor-pointer transition-all duration-300",
          {
            "bg-[#FFF9EF] border-[#8B3A15] shadow-lg":
              selectedPaymentMethod === paymentMethod,
            "bg-white border-gray-300": selectedPaymentMethod !== paymentMethod,
          }
        )}
      >
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium text-[#1a1a1a]">
            {paymentMethod === "pp_system_default_yape" && "Yape / Plin"}
            {paymentMethod === "pp_system_default_transfer" && "Transferencia Bancaria"}
          </div>
          {selectedPaymentMethod === paymentMethod && (
            <CheckCircleSolid className="text-green-600" />
          )}
        </div>

        {selectedPaymentMethod === paymentMethod && (
          <div className="mt-4 text-sm text-[#1a1a1a]">
           {paymentMethod === "pp_system_default_yape" && (
  <div className="mt-4 text-sm text-[#1a1a1a]">
    <p>Realiza el pago al número <strong>960-481-012</strong> y envía la captura por WhatsApp.</p>
    <p className="mt-1">Luego de eso, ya puedes presionar el botón <strong>“Continuar a revisión”</strong>.</p>
  </div>
          )}

          {paymentMethod === "pp_system_default_transfer" && (
  <div className="mt-4 text-sm text-[#1a1a1a]">
    <p>Transfiere al número de cuenta <strong>123-456-789</strong> y envía la captura al mismo número por WhatsApp.</p>
    <p className="mt-1">Luego de eso, ya puedes presionar el botón <strong>“Continuar a revisión”</strong>.</p>
  </div>
          )}

          </div>
        )}
      </div>
    </div>
  ))}
</RadioGroup>

            </>
          )}

  
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
  <Button
    size="large"
    onClick={handleSubmit}
    isLoading={isLoading}
    disabled={
      (isStripe && !cardComplete) ||
      (!selectedPaymentMethod && !paidByGiftcard)
    }
    className="px-6 py-2 bg-[#191817] text-white hover:bg-[#6a2a0f] transition rounded"
  >
    {!activeSession && isStripeFunc(selectedPaymentMethod)
      ? "Ingresar detalles de tarjeta"
      : "Continuar a revisión"}
  </Button>

  {/* Temporizador siempre visible con Yape o Transferencia */}
  {(selectedPaymentMethod === "pp_system_default_yape" ||
    selectedPaymentMethod === "pp_system_default_transfer") && (
    <div className="mt-4 sm:mt-0 sm:ml-4 w-full sm:w-auto">
  <div className="text-sm font-medium text-[#FFD700] bg-[#1a1a1a] border-[#FFD700]border border-[#8B3A15] px-4 py-2 rounded shadow-sm w-full text-center sm:text-left">
    ⏳ Tiempo restante para confirmar tu pago:
    <span id="timer" className="ml-1 font-semibold text-[#8B3A15]">15:00</span>
  </div>
</div>

  )}
</div>
       <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />
          
        </div>

        <div className={isOpen ? "hidden" : "block"}>
       {cart && paymentReady && activeSession ? (
  <div className="flex items-start gap-x-1 w-full">
    <div className="flex flex-col w-1/3">
      <Text className="txt-medium-plus text-ui-fg-base mb-1">
        Método de Pago
      </Text>
      <Text className="txt-medium text-ui-fg-subtle">
        {activeSession.provider_id === "pp_system_default_yape"
          ? "Yape / Plin"
          : activeSession.provider_id === "pp_system_default_transfer"
          ? "Transferencia Bancaria"
          : paymentInfoMap[activeSession?.provider_id]?.title ||
            activeSession?.provider_id}
      </Text>
    </div>
    <div className="flex flex-col w-1/3">
      <Text className="txt-medium-plus text-ui-fg-base mb-1">
        Detalles de Pago
      </Text>
      <div className="flex gap-2 txt-medium text-ui-fg-subtle items-center">
        <span className="text-sm">
          {activeSession.provider_id === "pp_system_default_yape"
            ? "Enviar captura al WhatsApp 960-481-012"
            : activeSession.provider_id === "pp_system_default_transfer"
            ? "Transferir a la cuenta 123-456-789 y enviar captura"
            : "Another step will appear"}
        </span>
      </div>
    </div>
  </div>
) : paidByGiftcard ? (
  <div className="flex flex-col w-1/3">
    <Text className="txt-medium-plus text-ui-fg-base mb-1">
      Método de Pago
    </Text>
    <Text className="txt-medium text-ui-fg-subtle">
      Gift card
    </Text>
  </div>
) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default Payment