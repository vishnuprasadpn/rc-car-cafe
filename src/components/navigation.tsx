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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-fury-black/20 backdrop-blur-xl border-b border-fury-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <div className="relative group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-white/10 rounded-lg blur-sm opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  <Image
                    src="/header_logo.png"
                    alt="Fury Road RC Club Logo"
                    width={90}
                    height={90}
                    className="object-contain relative z-10 drop-shadow-lg"
                    priority
                  />
                </div>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/" className="group relative px-6 py-3 text-fury-white hover:text-fury-orange text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-fury-white/10">
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-fury-orange/20 to-primary-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link href="/tracks" className="group relative px-6 py-3 text-fury-white hover:text-fury-orange text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-fury-white/10">
                <span className="relative z-10">Tracks</span>
                <div className="absolute inset-0 bg-gradient-to-r from-fury-orange/20 to-primary-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link href="/about" className="group relative px-6 py-3 text-fury-white hover:text-fury-orange text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-fury-white/10">
                <span className="relative z-10">About</span>
                <div className="absolute inset-0 bg-gradient-to-r from-fury-orange/20 to-primary-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link href="/contact" className="group relative px-6 py-3 text-fury-white hover:text-fury-orange text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-fury-white/10">
                <span className="relative z-10">Contact</span>
                <div className="absolute inset-0 bg-gradient-to-r from-fury-orange/20 to-primary-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-fury-white hover:text-fury-orange px-5 py-2.5 text-sm font-semibold transition-colors duration-300 rounded-lg hover:bg-fury-white/10"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="group relative bg-gradient-to-r from-fury-orange to-primary-600 text-fury-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25"
              >
                <span className="relative flex items-center">
                  <Zap className="h-4 w-4 mr-2 group-hover:animate-spin" />
                  JOIN CLUB
                </span>
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-fury-black/20 backdrop-blur-xl border-b border-fury-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-0 bg-white/10 rounded-lg blur-sm opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <Image
                  src="/header_logo.png"
                  alt="Fury Road RC Club Logo"
                  width={90}
                  height={90}
                  className="object-contain relative z-10 drop-shadow-lg"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative px-6 py-3 text-fury-white hover:text-fury-orange text-sm font-semibold transition-all duration-300 rounded-xl hover:bg-fury-white/10 flex items-center"
              >
                <item.icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-fury-orange/20 to-primary-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="group flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-fury-white/10 transition-all duration-300"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-fury-orange to-primary-600 rounded-full blur opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-fury-orange to-primary-700 rounded-full flex items-center justify-center shadow-2xl">
                    <span className="text-fury-white text-sm font-bold">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-fury-white">{session.user?.name || "User"}</div>
                  <div className="text-xs text-fury-lightGray capitalize">{(session.user as { role?: string }).role || "User"}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-fury-lightGray group-hover:text-fury-orange transition-colors" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-fury-black/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-fury-white/20 py-2 z-50">
                  <div className="px-4 py-3 border-b border-fury-white/10">
                    <div className="text-sm font-bold text-fury-white">{session.user?.name || "User"}</div>
                    <div className="text-xs text-fury-lightGray capitalize">{(session.user as { role?: string }).role || "User"}</div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-sm text-fury-lightGray hover:text-fury-orange hover:bg-fury-white/5 flex items-center transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-fury-white hover:text-fury-orange p-2 rounded-xl hover:bg-fury-white/10 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-fury-white/10 bg-fury-black/80 backdrop-blur-xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {/* Role-based Navigation for authenticated users */}
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-fury-white hover:text-fury-orange block px-4 py-3 rounded-xl text-base font-semibold hover:bg-fury-white/10 transition-all duration-300 flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-fury-white/10 pt-4 mt-4">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-3 text-base font-semibold text-fury-white hover:text-fury-orange hover:bg-fury-white/10 flex items-center rounded-xl transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
