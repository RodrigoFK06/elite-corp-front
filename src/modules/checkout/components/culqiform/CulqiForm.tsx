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
    const loadScript = () => {
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
    }

    if (typeof window !== "undefined") {
      if ((window as any).Culqi) {
        initCulqi()
      } else {
        loadScript()
      }
    }

    // ⚠️ No eliminamos window.culqi en cleanup para evitar errores post-tokenización
    return () => {
      console.log("🧼 Limpieza: script Culqi listo, sin eliminar window.culqi.")
    }
  }, [])

  const initCulqi = () => {
    const { Culqi } = window as any
    const publicKey = process.env.NEXT_PUBLIC_CULQI_PK

    if (!Culqi) {
      console.error("❌ Culqi no está definido después de cargar el script.")
      return
    }

    if (!publicKey || typeof publicKey !== 'string') {
      console.error("❌ Clave pública de Culqi no definida. Revisa tu .env o variables en Vercel.")
      return
    }

    Culqi.publicKey = publicKey

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

    // Callback al recibir token
    window.Culqi = () => {
      const { Culqi } = window as any
      if (Culqi.token) {
        console.log("💳 Token recibido:", Culqi.token.id)
        onToken(Culqi.token.id)
      } else {
        alert(Culqi.error?.user_message || "Error desconocido en Culqi")
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
    window.Culqi?.open()
  }

  return (
    <button
      type="button"
      onClick={handleOpenCulqi}
      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded"
    >
      {culqiReady ? 'Pagar con Culqi' : 'Cargando Culqi...'}
    </button>
  )
}
