"use client"

import { Button } from "@medusajs/ui"
import React from "react"
import { useFormStatus } from "react-dom"

export function SubmitButton({
  children,
  variant = "primary",
  className,
  "data-testid": dataTestId,
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "transparent" | "danger" | null
  className?: string
  "data-testid"?: string
}) {
  const { pending } = useFormStatus()

  const customClass = `
    bg-[#D4AF37] hover:bg-[#b8992f] text-black 
    px-6 py-2 rounded-md shadow-md transition-all font-semibold
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  return (
    <Button
      size="large"
      className={`${customClass} ${className || ""}`}
      type="submit"
      isLoading={pending}
      variant="transparent"
      data-testid={dataTestId}
    >
      {children}
    </Button>
  )
}
