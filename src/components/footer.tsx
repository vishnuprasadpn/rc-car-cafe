import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Brand Section */}
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <Image
                src="/header_logo.png"
                alt="Fury Road RC Club"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <span className="ml-3 text-xl font-bold text-white">Fury Road</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Bangalore&apos;s premier RC racing experience. Join us for high-speed racing and competitive fun.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-fury-orange text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-fury-orange text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/tracks" className="text-gray-400 hover:text-fury-orange text-sm transition-colors">
                  Tracks
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-fury-orange text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400 text-sm">
                <MapPin className="h-4 w-4 mr-2 text-fury-orange" />
                Bangalore, Karnataka
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Phone className="h-4 w-4 mr-2 text-fury-orange" />
                <a href="tel:+919876543210" className="hover:text-fury-orange transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center text-gray-400 text-sm">
                <Mail className="h-4 w-4 mr-2 text-fury-orange" />
                <a href="mailto:info@furyroadrc.com" className="hover:text-fury-orange transition-colors">
                  info@furyroadrc.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Fury Road RC Club. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-gray-400 hover:text-fury-orange transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-fury-orange transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-fury-orange transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

