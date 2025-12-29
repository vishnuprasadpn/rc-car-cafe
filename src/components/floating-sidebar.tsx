"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Instagram, Youtube, Globe, X, ChevronLeft } from "lucide-react"

export default function FloatingSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Sidebar */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        {/* Toggle Button - Always visible */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-0 top-0 bg-gradient-to-r from-fury-orange to-primary-600 text-white p-3 rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-300 z-10"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>

        {/* Sidebar Content */}
        <div
          className={`bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-lg border-l border-t border-b border-white/20 rounded-l-2xl shadow-2xl transition-all duration-300 ${
            isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="p-6 space-y-6 min-w-[280px]">
            {/* Location Section */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                <MapPin className="h-4 w-4 text-fury-orange" />
                Location
              </h3>
              <div className="space-y-2">
                <p className="text-gray-300 text-sm leading-relaxed">
                  FuryRoad RC Club, Yelenahalli Main Rd, Akshayanagara East, Akshayanagar, Bengaluru, Karnataka 560114
                </p>
                <a
                  href="tel:+919945576007"
                  className="flex items-center gap-2 text-gray-400 hover:text-fury-orange transition-colors text-sm"
                >
                  <Phone className="h-4 w-4" />
                  +91 99455 76007
                </a>
                <a
                  href="mailto:furyroadrcclub@gmail.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-fury-orange transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  furyroadrcclub@gmail.com
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Social Media Section */}
            <div className="space-y-3">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider">
                Follow Us
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://www.instagram.com/furyroad.club/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group border border-white/10 hover:border-fury-orange/50"
                >
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                    <Instagram className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                    Instagram
                  </span>
                </a>
                <a
                  href="https://www.youtube.com/@furyroad_rc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group border border-white/10 hover:border-red-500/50"
                >
                  <div className="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-lg group-hover:scale-110 transition-transform">
                    <Youtube className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                    YouTube
                  </span>
                </a>
                <a
                  href="https://share.google/bPEKxUEAJnkHwhQf5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all group border border-white/10 hover:border-blue-500/50"
                >
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
                    Google
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar (for mobile devices) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-lg border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <a
              href="tel:+919945576007"
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-fury-orange transition-colors"
            >
              <Phone className="h-5 w-5" />
              <span className="text-xs">Call</span>
            </a>
            <a
              href="https://www.instagram.com/furyroad.club/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-fury-orange transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="text-xs">Instagram</span>
            </a>
            <a
              href="https://www.youtube.com/@furyroad_rc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-fury-orange transition-colors"
            >
              <Youtube className="h-5 w-5" />
              <span className="text-xs">YouTube</span>
            </a>
            <a
              href="https://share.google/bPEKxUEAJnkHwhQf5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-fury-orange transition-colors"
            >
              <Globe className="h-5 w-5" />
              <span className="text-xs">Google</span>
            </a>
            <a
              href="mailto:furyroadrcclub@gmail.com"
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-fury-orange transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="text-xs">Email</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

