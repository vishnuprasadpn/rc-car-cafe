"use client"

import { useEffect } from "react"
import { logVersionInfo } from "@/lib/version"

/**
 * Client component that logs version info to browser console
 * This runs on the client side to show version info in browser console
 */
export function VersionLogger() {
  useEffect(() => {
    // Log version info when component mounts (page loads)
    logVersionInfo()
  }, [])

  // This component doesn't render anything
  return null
}

