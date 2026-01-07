"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { trackButtonClick, trackNavigation } from "@/lib/analytics"
import type { LinkProps } from "next/link"
import { ReactNode } from "react"

interface TrackedLinkProps extends LinkProps {
  children: ReactNode
  className?: string
  buttonName?: string
  location?: string
  onClick?: () => void
}

export function TrackedLink({
  children,
  href,
  className,
  buttonName,
  location,
  onClick,
  ...props
}: TrackedLinkProps) {
  const pathname = usePathname()
  const destination = typeof href === "string" ? href : href.pathname || ""

  const handleClick = () => {
    const buttonLabel = buttonName || (typeof children === "string" ? children : destination)
    const buttonLocation = location || pathname || "unknown"
    
    trackButtonClick(buttonLabel, buttonLocation, { destination })
    trackNavigation(destination, pathname || "")
    
    if (onClick) {
      onClick()
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

