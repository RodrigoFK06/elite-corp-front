"use client"
import { authorizeCulqiPayment } from "@lib/data/cart"
import { RadioGroup } from "@headlessui/react"
import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession, placeOrder } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import CulqiForm from "@modules/checkout/components/culqiform/CulqiForm"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

type PaymentMethod = {
  id: string
  name: string
}

interface Props {
  cart: any
  availablePaymentMethods: PaymentMethod[]
}

const Payment = ({ cart, availablePaymentMethods }: Props) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (s: any) => s.status === "pending"
  )

  const selectedPaymentMethodInitial = activeSession?.provider_id ?? ""
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isOpen = searchParams.get("step") === "payment"

  // 🔁 Recarga forzada si Culqi está activo la primera vez
  useEffect(() => {
    if (
      selectedPaymentMethodInitial === "pp_culqi_culqi" &&
      isOpen &&
      typeof window !== "undefined" &&
      !sessionStorage.getItem("culqi_hard_reload")
    ) {
      console.warn("🔁 Recargando página por Culqi...")
      sessionStorage.setItem("culqi_hard_reload", "true")
      window.location.href = window.location.href
    }
  }, [selectedPaymentMethodInitial, isOpen])

  // 🧹 Limpieza al desmontar
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("culqi_hard_reload")
    }
  }, [])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const isStripe = isStripeFunc(selectedPaymentMethod)

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
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

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    console.log("🧭 Método de pago seleccionado:", method)

    if (isStripeFunc(method) || method === "pp_culqi_culqi") {
      await initiatePaymentSession(cart, { provider_id: method })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const handleCulqiToken = async (tokenId: string) => {
    try {
      setIsLoading(true)

      const email = cart.customer?.email ?? "cliente@test.com"
      console.log("🪙 [Culqi] Token recibido:", tokenId)
      console.log("📧 [Culqi] Email del cliente:", email)

      const charge = await authorizeCulqiPayment({
        cartId: cart.id,
        email,
        source_id: tokenId,
      })

      console.log("💵 [Culqi] Cargo creado:", charge)

      await initiatePaymentSession(cart, {
        provider_id: "pp_culqi_culqi",
        data: {
          source_id: tokenId,
          email,
          charge_id: charge.id,
        },
      })

      router.refresh()

      setTimeout(() => {
        router.push(pathname + "?" + createQueryString("step", "review"), {
          scroll: false,
        })
      }, 200)

    } catch (err: any) {
      console.error("❌ [Culqi] Error en flujo de pago:", err)
      setError(err.message ?? "No se pudo completar el pago con Culqi")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      console.log("🧾 Enviando formulario de pago con método:", selectedPaymentMethod)

      const shouldInputCard =
        isStripeFunc(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        console.log("🔄 Reiniciando sesión de pago...")
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        router.push(pathname + "?" + createQueryString("step", "review"), {
          scroll: false,
        })
      }
    } catch (err: any) {
      console.error("❌ Error al enviar el formulario de pago:", err)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const filteredPaymentMethods = availablePaymentMethods.filter(
    (m) => ["manual", "pp_culqi_culqi"].includes(m.id) || isStripeFunc(m.id)
  )

  return (
    <div className="bg-[#121212] border border-[#FFD700] p-6 rounded-md">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline text-[#FFD700]",
            { "opacity-50 pointer-events-none select-none": !isOpen && !paymentReady }
          )}
        >
          Método de Pago
          {!isOpen && paymentReady && <CheckCircleSolid className="text-green-500" />}
        </Heading>

        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-[#FFD700] hover:text-yellow-300"
            >
              Editar
            </button>
          </Text>
        )}
      </div>

      <div>
        <div className={isOpen ? "block" : "hidden"}>
          {!paidByGiftcard && filteredPaymentMethods.length > 0 && (
            <RadioGroup
              value={selectedPaymentMethod}
              onChange={(val: string) => setPaymentMethod(val)}
            >
              {filteredPaymentMethods.map((method) => (
                <div key={method.id} className="py-4">
                  {isStripeFunc(method.id) ? (
                    <StripeCardContainer
                      paymentProviderId={method.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                      paymentInfoMap={paymentInfoMap}
                      setCardBrand={setCardBrand}
                      setError={setError}
                      setCardComplete={setCardComplete}
                    />
                  ) : method.id === "pp_culqi_culqi" ? (
                    <CulqiForm
                      amount={cart.total * 100}
                      email={cart.customer?.email ?? "cliente@test.com"}
                      onToken={handleCulqiToken}
                    />
                  ) : (
                    <PaymentContainer
                      paymentInfoMap={paymentInfoMap}
                      paymentProviderId={method.id}
                      selectedPaymentOptionId={selectedPaymentMethod}
                    />
                  )}
                </div>
              ))}
            </RadioGroup>
          )}

          {paidByGiftcard && (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-white mb-1">
                Método de Pago
              </Text>
              <Text className="txt-medium text-[#CCCCCC]">Tarjeta de regalo</Text>
            </div>
          )}

          <ErrorMessage error={error} />

          <Button
            size="large"
            className="mt-6 bg-[#FFD700] text-black hover:bg-[#8B3A15]"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripe && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
          >
            {!activeSession && isStripe ? "Ingresar datos de tarjeta" : "Continuar con la revisión"}
          </Button>
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-white mb-1">
                  Método de Pago
                </Text>
                <Text className="txt-medium text-[#CCCCCC]">
                  {paymentInfoMap[activeSession.provider_id]?.title ?? activeSession.provider_id}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                <Text className="txt-medium-plus text-white mb-1">
                  Detalles del Pago
                </Text>
                <div className="flex gap-2 txt-medium text-[#CCCCCC] items-center">
                  <div className="flex items-center h-7 w-fit p-2 bg-[#333] rounded">
                    {paymentInfoMap[selectedPaymentMethod]?.icon ?? <CreditCard />}
                  </div>
                  <Text>
                    {isStripe && cardBrand
                      ? cardBrand
                      : selectedPaymentMethod === "pp_culqi_culqi"
                      ? "Token Culqi enviado"
                      : ""}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              <Text className="txt-medium-plus text-white mb-1">
                Método de Pago
              </Text>
              <Text className="txt-medium text-[#CCCCCC]">Tarjeta de regalo</Text>
            </div>
          ) : null}
        </div>
      </div>

      <Divider className="mt-8 border-t border-[#FFD700]" />
    </div>
  )
}

export default Payment
