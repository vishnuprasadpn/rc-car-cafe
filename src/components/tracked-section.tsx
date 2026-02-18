"use client"

import { useEffect, useRef, ReactNode } from "react"
import { trackSectionView } from "@/lib/analytics"

interface TrackedSectionProps {
  children: ReactNode
  sectionName: string
  pageName: string
  className?: string
  threshold?: number
}

const trackedSections = new Set<string>()

export function TrackedSection({
  children,
  sectionName,
  pageName,
  className,
  threshold = 0.3,
}: TrackedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const key = `${pageName}:${sectionName}`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !trackedSections.has(key)) {
          trackedSections.add(key)
          trackSectionView(sectionName, pageName)
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [sectionName, pageName, threshold])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
