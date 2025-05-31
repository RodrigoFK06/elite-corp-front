import { Label } from "@medusajs/ui"
import React, { useEffect, useImperativeHandle, useState } from "react"

import Eye from "@modules/common/icons/eye"
import EyeOff from "@modules/common/icons/eye-off"

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
  "placeholder"
> & {
  label: string
  errors?: Record<string, unknown>
  touched?: Record<string, unknown>
  name: string
  topLabel?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, touched, required, topLabel, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [inputType, setInputType] = useState(type)

    useEffect(() => {
      if (type === "password" && showPassword) {
        setInputType("text")
      }

      if (type === "password" && !showPassword) {
        setInputType("password")
      }
    }, [type, showPassword])

    useImperativeHandle(ref, () => inputRef.current!)

    return (
      <div className="flex flex-col w-full">
        {topLabel && (
          <Label className="mb-2 text-sm font-semibold text-[#1a1a1a]">
            {topLabel}
          </Label>
        )}
        <div className="relative w-full text-base text-[#1a1a1a]">
          <input
            type={inputType}
            name={name}
            placeholder=" "
            required={required}
      className="peer pt-4 pb-1 w-full h-11 px-4 rounded-md border border-[#CCC] bg-[#F0F0F0] text-[#1a1a1a] placeholder:text-[#666] appearance-none focus:outline-none focus:ring-0 focus:border-[#8B3A15] focus:bg-[#EAEAEA] transition"
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className="absolute left-4 top-2 text-sm text-[#8B3A15] peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#999] transition-all"
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>

          {type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 text-[#8B3A15] hover:text-[#6a2a0f] transition"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export default Input
