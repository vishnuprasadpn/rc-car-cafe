"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Zap, Home, Car, Info, Mail, LogIn, UserPlus } from "lucide-react"
import { trackNavigation, trackButtonClick } from "@/lib/analytics"

export default function Navigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  // Define public routes where navigation should always show
  const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/tracks',
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

  // Show navigation on public routes (regardless of auth status) or when loading/unauthenticated
  if (isPublicRoute || status === "loading" || !session) {
    return (
      <>
        {/* Mobile Navigation - Full Width, Sticky to Top */}
        <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/20 shadow-lg">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Logo - Smaller on mobile */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/header_logo.png"
                  alt="Fury Road RC Club Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                  priority
                />
              </Link>
              
              {/* Navigation Icons */}
              <div className="flex items-center space-x-4">
                <Link 
                  href="/" 
                  onClick={() => trackNavigation("/", pathname || "")}
                  className={`p-2 rounded-lg transition-colors ${
                    pathname === '/' 
                      ? 'bg-fury-orange/20 text-fury-orange' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="Home"
                >
                  <Home className="h-5 w-5" />
                </Link>
                <Link 
                  href="/tracks" 
                  onClick={() => trackNavigation("/tracks", pathname || "")}
                  className={`p-2 rounded-lg transition-colors ${
                    pathname?.startsWith('/tracks') 
                      ? 'bg-fury-orange/20 text-fury-orange' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="Tracks"
                >
                  <Car className="h-5 w-5" />
                </Link>
                <Link 
                  href="/about" 
                  onClick={() => trackNavigation("/about", pathname || "")}
                  className={`p-2 rounded-lg transition-colors ${
                    pathname?.startsWith('/about') 
                      ? 'bg-fury-orange/20 text-fury-orange' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="About"
                >
                  <Info className="h-5 w-5" />
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => trackNavigation("/contact", pathname || "")}
                  className={`p-2 rounded-lg transition-colors ${
                    pathname?.startsWith('/contact') 
                      ? 'bg-fury-orange/20 text-fury-orange' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  title="Contact"
                >
                  <Mail className="h-5 w-5" />
                </Link>
                {session ? (
                  <Link
                    href="/dashboard"
                    onClick={() => {
                      trackNavigation("/dashboard", pathname || "")
                      trackButtonClick("Dashboard", "navigation")
                    }}
                    className="p-2 rounded-lg bg-fury-orange/20 text-fury-orange hover:bg-fury-orange/30 transition-colors"
                    title="Dashboard"
                  >
                    <Zap className="h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      onClick={() => {
                        trackNavigation("/auth/signin", pathname || "")
                        trackButtonClick("Sign In", "navigation")
                      }}
                      className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                      title="Sign In"
                    >
                      <LogIn className="h-5 w-5" />
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => {
                        trackNavigation("/auth/signup", pathname || "")
                        trackButtonClick("Join Club", "navigation")
                      }}
                      className="p-2 rounded-lg bg-fury-orange/20 text-fury-orange hover:bg-fury-orange/30 transition-colors"
                      title="Join Club"
                    >
                      <UserPlus className="h-5 w-5" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop Navigation - Centered, Rounded */}
        <nav className="hidden md:block fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
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
              <div className="flex items-center space-x-8">
                <Link 
                  href="/" 
                  onClick={() => trackNavigation("/", pathname || "")}
                  className="text-white/90 hover:text-white text-sm font-medium transition-colors"
                >
                  Home
                </Link>
                <Link 
                  href="/tracks" 
                  onClick={() => trackNavigation("/tracks", pathname || "")}
                  className="text-white/90 hover:text-white text-sm font-medium transition-colors"
                >
                  Tracks
                </Link>
                <Link 
                  href="/about" 
                  onClick={() => trackNavigation("/about", pathname || "")}
                  className="text-white/90 hover:text-white text-sm font-medium transition-colors"
                >
                  About
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => trackNavigation("/contact", pathname || "")}
                  className="text-white/90 hover:text-white text-sm font-medium transition-colors"
                >
                  Contact
                </Link>
              </div>
              
              {/* Sign In / Sign Up or User Menu */}
              <div className="flex items-center space-x-4">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-white/30 shadow-sm transition-all flex items-center"
                  >
                    <Zap className="h-4 w-4 mr-2 text-white" />
                    Dashboard
                  </Link>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </>
    )
  }

  // For authenticated users on non-public routes, return null (sidebar will handle navigation)
  return null
}

