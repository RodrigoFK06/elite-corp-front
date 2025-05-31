"use client"

import { isManual, isStripe } from "@lib/constants"
import {
  initiatePaymentSession,
  placeOrder,
  retrieveCart,
} from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import { useRouter } from "next/navigation"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripe(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton
          cart={cart}
          notReady={notReady}
          data-testid={dataTestId}
        />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("card")

  const session = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  const disabled = !stripe || !elements

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    try {
      const result = await stripe.confirmCardPayment(
        session?.data.client_secret as string,
        {
          payment_method: {
            card,
            billing_details: {
              name:
                cart.billing_address?.first_name +
                " " +
                cart.billing_address?.last_name,
              address: {
                city: cart.billing_address?.city ?? undefined,
                country: cart.billing_address?.country_code ?? undefined,
                line1: cart.billing_address?.address_1 ?? undefined,
                line2: cart.billing_address?.address_2 ?? undefined,
                postal_code: cart.billing_address?.postal_code ?? undefined,
                state: cart.billing_address?.province ?? undefined,
              },
              email: cart.email,
              phone: cart.billing_address?.phone ?? undefined,
            },
          },
        }
      )

      const pi = result.paymentIntent || result.error?.payment_intent

      if (
        pi?.status === "requires_capture" ||
        pi?.status === "succeeded"
      ) {
        await placeOrder()
      }

      if (result.error) {
        setErrorMessage(result.error.message || null)
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error al procesar el pago.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={disabled || notReady}
        onClick={handlePayment}
        size="large"
        isLoading={submitting}
        data-testid={dataTestId}
      >
        Place order
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="stripe-payment-error-message"
      />
    </>
  )
}

const ManualTestPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  const handlePayment = async () => {
    setSubmitting(true)
    try {
      const provider_id =
        cart?.payment_collection?.payment_sessions?.[0]?.provider_id

      if (!provider_id) {
        throw new Error("No se ha seleccionado un método de pago.")
      }

      // 🔁 Siempre crear una nueva sesión válida
      await initiatePaymentSession(cart, { provider_id })

      // ⏳ Espera corta opcional en local
      await new Promise((r) => setTimeout(r, 250))

      const updatedCart = await retrieveCart()
      if (!updatedCart) {
        throw new Error("No se pudo recuperar el carrito actualizado.")
      }

      const session = updatedCart.payment_collection?.payment_sessions?.find(
        (s) => s.status === "pending" && s.provider_id === provider_id
      )

      if (!session) {
        throw new Error("La sesión de pago aún no está disponible.")
      }

      await placeOrder(updatedCart.id)
      router.push("/app/order")
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || "Error al confirmar el pedido.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Button
        disabled={notReady}
        isLoading={submitting}
        onClick={handlePayment}
        size="large"
        data-testid={dataTestId}
      >
        Confirmar pedido
      </Button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default PaymentButton
