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
    '/tracks',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/verify-code',
    '/auth/reset-password',
  ]

  // Define authenticated dashboard routes where sidebar SHOULD appear
  const dashboardRoutes = [
    '/dashboard',
    '/admin',
    '/staff',
    '/bookings',
    '/points',
    '/profile',
    '/membership-dashboard',
  ]

  // Check if current path is a dashboard route (check this first)
  const isDashboardRoute = dashboardRoutes.some(route => {
    return pathname?.startsWith(route)
  })

  // Check if current path is a public route (but not if it's a dashboard route)
  const isPublicRoute = !isDashboardRoute && publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/'
    }
    // Use exact match or pathname starts with route + '/' to avoid /book matching /bookings
    return pathname === route || pathname?.startsWith(route + '/')
  })

  // Only apply margin when user is authenticated AND on a dashboard route
  const shouldShowSidebar = status === "authenticated" && session && isDashboardRoute && !isPublicRoute

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className={`flex-1 ${shouldShowSidebar ? 'md:ml-64' : ''}`}>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

