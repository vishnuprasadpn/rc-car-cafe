"use client"

import { usePathname } from "next/navigation"
import { trackButtonClick } from "@/lib/analytics"
import { ReactNode } from "react"

interface TrackedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  buttonName?: string
  location?: string
}

export function TrackedButton({
  children,
  buttonName,
  location,
  onClick,
  ...props
}: TrackedButtonProps) {
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttonLabel = buttonName || (typeof children === "string" ? children : "Button")
    const buttonLocation = location || pathname || "unknown"
    
    trackButtonClick(buttonLabel, buttonLocation)
    
    if (onClick) {
      onClick(e)
    }
  }

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

