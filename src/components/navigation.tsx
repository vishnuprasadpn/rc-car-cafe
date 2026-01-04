"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Zap, Menu, X } from "lucide-react"
import { trackNavigation, trackButtonClick } from "@/lib/analytics"
import { useState } from "react"

export default function Navigation() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Define public routes where navigation should always show
  const publicRoutes = [
    '/',
    '/contact',
    '/tracks',
    '/book',
    '/membership',
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
              {/* Logo */}
              <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <Image
                  src="/Furyroad.png"
                  alt="Fury Road RC Club Logo"
                  width={150}
                  height={150}
                  className="object-contain"
                  priority
                />
              </Link>
              
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
          
              {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="bg-black/95 backdrop-blur-xl border-t border-white/20 px-4 py-4">
              <div className="flex flex-col space-y-2">
                {pathname !== '/' && (
                  <Link 
                    href="/" 
                    onClick={() => {
                      trackNavigation("/", pathname || "")
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-4 py-3 rounded-lg transition-colors text-white hover:bg-white/10"
                  >
                    Home
                  </Link>
                )}
                {!pathname?.startsWith('/tracks') && (
                  <Link 
                    href="/tracks" 
                    onClick={() => {
                      trackNavigation("/tracks", pathname || "")
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-4 py-3 rounded-lg transition-colors text-white hover:bg-white/10"
                  >
                    Tracks
                  </Link>
                )}
                {!pathname?.startsWith('/membership') && (
                  <Link 
                    href="/membership" 
                    onClick={() => {
                      trackNavigation("/membership", pathname || "")
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-4 py-3 rounded-lg transition-colors text-white hover:bg-white/10"
                  >
                    Membership
                  </Link>
                )}
                {!pathname?.startsWith('/contact') && (
                  <Link 
                    href="/contact" 
                    onClick={() => {
                      trackNavigation("/contact", pathname || "")
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-4 py-3 rounded-lg transition-colors text-white hover:bg-white/10"
                  >
                    Contact
                  </Link>
                )}
                {!pathname?.startsWith('/book') && (
                  <Link 
                    href="/book" 
                    onClick={() => {
                      trackNavigation("/book", pathname || "")
                      trackButtonClick("Book Now", "navigation")
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-4 py-3 rounded-lg bg-fury-orange text-white hover:bg-fury-orange/90 transition-colors font-semibold"
                  >
                    Book Now
                  </Link>
                )}
                {session ? (
                  <Link
                    href="/dashboard"
                    onClick={() => {
                      trackNavigation("/dashboard", pathname || "")
                      trackButtonClick("Dashboard", "navigation")
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-4 py-3 rounded-lg bg-fury-orange/20 text-fury-orange hover:bg-fury-orange/30 transition-colors font-semibold"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/auth/signin"
                    onClick={() => {
                      trackNavigation("/auth/signin", pathname || "")
                      trackButtonClick("Sign In", "navigation")
                      setIsMobileMenuOpen(false)
                    }}
                    className="px-4 py-3 rounded-lg bg-fury-orange/20 text-fury-orange hover:bg-fury-orange/30 transition-colors font-semibold"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Desktop Navigation - Centered, Rounded */}
        <nav className="hidden md:block fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-full shadow-lg border border-white/20 px-6 py-4">
            <div className="flex justify-center items-center gap-8">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center group">
                  <Image
                    src="/Furyroad.png"
                    alt="Fury Road RC Club Logo"
                    width={150}
                    height={150}
                    className="object-contain drop-shadow-lg"
                    priority
                  />
                </Link>
              </div>
              
              {/* Navigation Links */}
              <div className="flex items-center space-x-8">
                {pathname !== '/' && (
                  <Link 
                    href="/" 
                    onClick={() => trackNavigation("/", pathname || "")}
                    className="text-white/90 hover:text-white text-sm font-medium transition-colors"
                  >
                    Home
                  </Link>
                )}
                {!pathname?.startsWith('/tracks') && (
                  <Link 
                    href="/tracks" 
                    onClick={() => trackNavigation("/tracks", pathname || "")}
                    className="text-white/90 hover:text-white text-sm font-medium transition-colors"
                  >
                    Tracks
                  </Link>
                )}
                {!pathname?.startsWith('/membership') && (
                  <Link 
                    href="/membership" 
                    onClick={() => trackNavigation("/membership", pathname || "")}
                    className="text-white/90 hover:text-white text-sm font-medium transition-colors"
                  >
                    Membership
                  </Link>
                )}
                {!pathname?.startsWith('/contact') && (
                  <Link 
                    href="/contact" 
                    onClick={() => trackNavigation("/contact", pathname || "")}
                    className="text-white/90 hover:text-white text-sm font-medium transition-colors"
                  >
                    Contact
                  </Link>
                )}
              </div>
              
              {/* Book Now and Sign In / Sign Up or User Menu */}
              <div className="flex items-center space-x-4">
                {!pathname?.startsWith('/book') && (
                  <Link
                    href="/book"
                    onClick={() => {
                      trackNavigation("/book", pathname || "")
                      trackButtonClick("Book Now", "navigation")
                    }}
                    className="bg-fury-orange text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-fury-orange/90 shadow-lg hover:shadow-fury-orange/25 transition-all"
                  >
                    Book Now
                  </Link>
                )}
                {session ? (
                  <Link
                    href="/dashboard"
                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-white/30 shadow-sm transition-all flex items-center"
                  >
                    <Zap className="h-4 w-4 mr-2 text-white" />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-white/30 shadow-sm transition-all flex items-center"
                    onClick={() => {
                      trackNavigation("/auth/signin", pathname || "")
                      trackButtonClick("Sign In", "navigation")
                    }}
                  >
                    Sign In
                  </Link>
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
