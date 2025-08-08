'use client'

import { useEffect, useState } from 'react'

interface Props {
  amount: number
  email: string
  onToken: (tokenId: string) => void
}

export default function CulqiForm({ amount, email, onToken }: Props) {
  const [culqiReady, setCulqiReady] = useState(false)

  useEffect(() => {
    // Ya está cargado el script → continuar
    if ((window as any).Culqi) {
      initCulqi()
      return
    }

    // Cargar script manualmente
    const script = document.createElement('script')
    script.src = 'https://checkout.culqi.com/js/v4'
    script.async = true
    script.onload = () => {
      console.log("✅ Script Culqi cargado manualmente.")
      initCulqi()
    }
    script.onerror = () => {
      console.error("❌ Error al cargar script Culqi.")
    }
    document.body.appendChild(script)

    return () => {
      delete (window as any).culqi
      console.log("🧼 Limpieza: función global culqi eliminada.")
    }
  }, [])

  const initCulqi = () => {
    const { Culqi } = window as any
    if (!Culqi) {
      console.error("❌ Culqi no está definido después del script.")
      return
    }

    Culqi.publicKey = process.env.NEXT_PUBLIC_CULQI_PK

    Culqi.settings({
      title: 'Perfumes Elite',
      currency: 'PEN',
      amount,
      email,
      order: '',
      paymentMethods: { tarjeta: true, yape: true },
    })

    Culqi.options({
      lang: 'auto',
      style: {
        buttonBackground: '#8B3A15',
        buttonTextColor: '#ffffff',
        buttonText: 'Pagar con Culqi',
      },
    })

    ;(window as any).culqi = () => {
      const { Culqi } = window as any
      if (Culqi.token) {
        console.log("💳 Token recibido:", Culqi.token.id)
        onToken(Culqi.token.id)
      } else {
        alert(Culqi.error.user_message)
        console.warn("❗ Error de Culqi:", Culqi.error)
      }
    }

    setCulqiReady(true)
    console.log("✅ Culqi configurado y listo.")
  }

  const handleOpenCulqi = () => {
    if (!culqiReady) {
      alert("Aún se está cargando Culqi. Espera unos segundos.")
      return
    }

    if (!sessionStorage.getItem('culqi_reloaded')) {
      sessionStorage.setItem('culqi_reloaded', 'true')
      window.location.reload()
      return
    }

    console.log("🟢 Abriendo Culqi...")
    ;(window as any).Culqi?.open()
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpenCulqi}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
      >
        {culqiReady ? 'Pagar con Culqi' : 'Cargando Culqi...'}
      </button>
    </>
  )
}
