"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Instagram, Youtube, Globe, X, MessageCircleMore, MessageCircle, Navigation as NavigationIcon } from "lucide-react"

export default function FloatingSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Sidebar */}
      <div className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden lg:block ${!isOpen ? 'pointer-events-none' : ''}`}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-0 top-0 bg-gradient-to-r from-fury-orange to-primary-600 text-white p-3 rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-300 z-10 pointer-events-auto"
          aria-label={isOpen ? "Close sidebar" : "Contact & Social Links"}
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageCircleMore className="h-5 w-5" />
          )}
        </button>

        {/* Sidebar Content */}
        <div
          className={`bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-lg border-l border-t border-b border-white/20 rounded-l-2xl shadow-2xl transition-all duration-300 ${
            isOpen ? "translate-x-0 opacity-100 pointer-events-auto" : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="p-4 space-y-3 min-w-[250px]">
            {/* Location */}
            <div>
              <p className="text-gray-400 text-xs leading-relaxed mb-2">
                <MapPin className="h-3 w-3 inline mr-1 text-fury-orange" />
                Yelenahalli Main Rd, Akshayanagar, Bengaluru 560114
              </p>
              <a
                href="https://maps.google.com/?q=Fury+Road+RC+Club+Yelenahalli+Main+Rd+Akshayanagar+Bengaluru+Karnataka+560114"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 bg-blue-600/15 hover:bg-blue-600/25 rounded-lg transition-all group border border-blue-500/20 hover:border-blue-500/40"
              >
                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md group-hover:scale-110 transition-transform">
                  <NavigationIcon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-white text-xs font-semibold group-hover:text-blue-300 transition-colors">
                  Open in Google Maps
                </span>
              </a>
            </div>

            {/* Quick Actions Row */}
            <div className="flex gap-2">
              <a
                href="tel:+919945576007"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-fury-orange/40 transition-all group"
              >
                <Phone className="h-3.5 w-3.5 text-fury-orange" />
                <span className="text-gray-300 text-xs group-hover:text-white">Call</span>
              </a>
              <a
                href="mailto:furyroadrcclub@gmail.com"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-fury-orange/40 transition-all group"
              >
                <Mail className="h-3.5 w-3.5 text-fury-orange" />
                <span className="text-gray-300 text-xs group-hover:text-white">Email</span>
              </a>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919945576007?text=Hi%2C%20I%27m%20interested%20in%20booking%20a%20session%20at%20Fury%20Road%20RC%20Club"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2 bg-green-600/15 hover:bg-green-600/25 rounded-lg transition-all group border border-green-500/20 hover:border-green-500/40"
            >
              <div className="p-1.5 bg-gradient-to-br from-green-500 to-green-600 rounded-md group-hover:scale-110 transition-transform">
                <MessageCircle className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-white text-xs font-semibold group-hover:text-green-300 transition-colors">
                Chat on WhatsApp
              </span>
            </a>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Social Links Row */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">Follow</span>
              <div className="flex gap-1.5 ml-auto">
                <a
                  href="https://www.instagram.com/furyroad.club/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/40 hover:to-pink-500/40 rounded-lg border border-white/10 hover:border-pink-500/40 transition-all group"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 text-pink-400 group-hover:text-pink-300 group-hover:scale-110 transition-all" />
                </a>
                <a
                  href="https://www.youtube.com/@furyroad_rc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-red-500/15 hover:bg-red-500/30 rounded-lg border border-white/10 hover:border-red-500/40 transition-all group"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4 text-red-400 group-hover:text-red-300 group-hover:scale-110 transition-all" />
                </a>
                <a
                  href="https://share.google/bPEKxUEAJnkHwhQf5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-500/15 hover:bg-blue-500/30 rounded-lg border border-white/10 hover:border-blue-500/40 transition-all group"
                  aria-label="Google"
                >
                  <Globe className="h-4 w-4 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
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
              href="https://wa.me/919945576007"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-green-400 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="text-xs">WhatsApp</span>
            </a>
            <a
              href="https://www.instagram.com/furyroad.club/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-pink-400 transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="text-xs">Instagram</span>
            </a>
            <a
              href="https://www.youtube.com/@furyroad_rc"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
            >
              <Youtube className="h-5 w-5" />
              <span className="text-xs">YouTube</span>
            </a>
            <a
              href="https://maps.google.com/?q=Fury+Road+RC+Club+Bengaluru"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <MapPin className="h-5 w-5" />
              <span className="text-xs">Maps</span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
