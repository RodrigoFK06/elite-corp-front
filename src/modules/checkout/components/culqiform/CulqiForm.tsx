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
    console.log("🔄 useEffect iniciado - verificando Culqi")

    // Ya está cargado el script → continuar
    if ((window as any).Culqi) {
      console.log("🟢 Culqi ya estaba en window")
      initCulqi()
      return
    }

    console.log("📦 Cargando script Culqi v4...")

    const script = document.createElement('script')
    script.src = 'https://checkout.culqi.com/js/v4'
    script.async = true

    script.onload = () => {
      console.log("✅ Script Culqi cargado correctamente.")
      initCulqi()
    }

    script.onerror = () => {
      console.error("❌ Error al cargar script Culqi.")
    }

    document.body.appendChild(script)

    // No eliminamos window.culqi para evitar romper callbacks posteriores
    return () => {
      console.log("🧼 Limpieza: sin eliminar window.culqi.")
    }
  }, [])

  const initCulqi = () => {
    console.log("⚙️ INICIANDO configuración de Culqi...")

    const { Culqi } = window as any

    // ⬇️ Fallback hardcodeado (opción A). REEMPLAZA tu clave pública aquí:
    const FALLBACK_PUBLIC_KEY = "pk_test_OSVfraWJSy2YxtNC"

    // Usa la env si existe; si no, usa la hardcodeada:
    const envKey = process.env.NEXT_PUBLIC_CULQI_PK as string | undefined
    const publicKey = envKey ?? FALLBACK_PUBLIC_KEY

    console.log("🔐 NEXT_PUBLIC_CULQI_PK:", envKey)
    console.log("🔐 Usando publicKey para Culqi:", publicKey)

    if (!Culqi) {
      console.error("❌ Culqi no está definido después de cargar el script.")
      return
    }

    if (!publicKey || typeof publicKey !== 'string') {
      console.error("❌ Clave pública de Culqi no definida o inválida.")
      return
    }

    try {
      Culqi.publicKey = publicKey
      console.log("✅ Culqi.publicKey asignado correctamente.")
    } catch (err) {
      console.error("🚨 Error al asignar Culqi.publicKey:", err)
      return
    }

    Culqi.settings({
      title: 'Perfumes Elite',
      currency: 'PEN',
      amount, // Asegúrate que sea en céntimos
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

    console.log("✅ Culqi configurado con settings y options.")

    ;(window as any).culqi = () => {
      const { Culqi } = window as any
      if (Culqi?.token) {
        console.log("💳 Token recibido:", Culqi.token.id)
        onToken(Culqi.token.id)
      } else {
        console.warn("❗ Error de Culqi:", Culqi?.error)
        alert(Culqi?.error?.user_message || "Error desconocido en el pago")
      }
    }

    setCulqiReady(true)
    console.log("🟩 Culqi listo para usar")
  }

  const handleOpenCulqi = () => {
    console.log("🟡 Intentando abrir Culqi...")

    if (!culqiReady) {
      alert("Aún se está cargando Culqi. Espera unos segundos.")
      console.warn("⏳ Culqi aún no está listo.")
      return
    }

    if (!sessionStorage.getItem('culqi_reloaded')) {
      sessionStorage.setItem('culqi_reloaded', 'true')
      console.log("🔁 Recargando por primera vez para asegurar sesión limpia.")
      window.location.reload()
      return
    }

    console.log("🟢 Abriendo Culqi modal...")
    ;(window as any).Culqi?.open()
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
