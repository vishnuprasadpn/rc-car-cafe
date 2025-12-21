"use client"

import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Sidebar from "@/components/sidebar"
import Footer from "@/components/footer"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  
  // Define public routes where sidebar should NOT appear
  const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/book',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/verify-code',
    '/auth/reset-password',
  ]

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(route)
  })

  // Only apply margin when session exists and NOT on public routes
  const hasSession = status === "authenticated" && session && !isPublicRoute

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className={`flex-1 ${hasSession ? 'md:ml-64' : ''}`}>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

