"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { 
  Home, 
  Calendar, 
  Trophy, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  UserPlus
} from "lucide-react"
import { useState } from "react"

export default function Sidebar() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

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
  ]

  // Check if current path is a public route
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(route)
  })

  // Check if current path is a dashboard route
  const isDashboardRoute = dashboardRoutes.some(route => {
    return pathname?.startsWith(route)
  })

  // Only show sidebar if user is authenticated AND on a dashboard route
  if (!session || !isDashboardRoute || isPublicRoute) {
    return null
  }

  const getNavigationItems = () => {
    const userRole = (session.user as { role?: string }).role
    if (userRole === "ADMIN") {
      return [
        { name: "Home", href: "/", icon: Home },
        { name: "Dashboard", href: "/admin", icon: Home },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Bookings", href: "/admin/bookings", icon: Calendar },
        { name: "Games", href: "/admin/games", icon: Trophy },
        { name: "Points", href: "/admin/points", icon: Trophy },
        { name: "Reports", href: "/admin/reports", icon: Settings },
      ]
    } else if (userRole === "STAFF") {
      return [
        { name: "Home", href: "/", icon: Home },
        { name: "Dashboard", href: "/staff", icon: Home },
        { name: "Bookings", href: "/staff/bookings", icon: Calendar },
        { name: "Customers", href: "/staff/customers", icon: Users },
        { name: "Register Customer", href: "/staff/register-customer", icon: UserPlus },
      ]
    } else {
      return [
        { name: "Home", href: "/", icon: Home },
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "My Bookings", href: "/bookings", icon: Calendar },
        { name: "Points", href: "/points", icon: Trophy },
        { name: "Profile", href: "/profile", icon: Users },
      ]
    }
  }

  const navigationItems = getNavigationItems()

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-gray-950 via-black to-gray-900 border-r border-white/10 z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center space-x-3" onClick={() => setIsMobileOpen(false)}>
              <Image
                src="/header_logo.png"
                alt="Fury Road RC Club Logo"
                width={50}
                height={50}
                className="object-contain"
                priority
              />
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm">Fury Road</span>
                <span className="text-gray-400 text-xs">RC Club</span>
              </div>
            </Link>
          </div>

          {/* User Info Section */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-fury-orange to-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-white text-sm font-semibold truncate break-words">
                  {session.user?.name || "User"}
                </p>
                <p className="text-gray-400 text-xs capitalize truncate">
                  {(session.user as { role?: string }).role || "User"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigationItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      active
                        ? "bg-fury-orange/20 text-fury-orange border-l-4 border-fury-orange"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Spacer for Desktop - only show when sidebar is visible */}
      <div className="hidden md:block w-64 flex-shrink-0" />
    </>
  )
}

