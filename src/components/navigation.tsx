"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { 
  Home, 
  Calendar, 
  Trophy, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronDown,
  Zap
} from "lucide-react"
import { useState } from "react"

export default function Navigation() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  if (status === "loading") {
    return null
  }

  if (!session) {
    return (
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/10 backdrop-blur-xl rounded-full shadow-lg border border-white/20 px-6 py-4">
          <div className="flex justify-center items-center gap-8">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <Image
                  src="/header_logo.png"
                  alt="Fury Road RC Club Logo"
                  width={90}
                  height={90}
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/tracks" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
                Tracks
              </Link>
              <Link href="/about" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
                Contact
              </Link>
            </div>
            
            {/* Sign In / Sign Up */}
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-white/90 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-white/30 shadow-sm transition-all flex items-center"
              >
                <Zap className="h-4 w-4 mr-2 text-white" />
                Join Club
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  const getNavigationItems = () => {
    if (!session?.user) return []
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
      ]
    } else {
      return [
        { name: "Home", href: "/", icon: Home },
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "My Bookings", href: "/dashboard", icon: Calendar },
      ]
    }
  }

  const navigationItems = getNavigationItems()

  // For authenticated users, return null (sidebar will handle navigation)
  return null
}

