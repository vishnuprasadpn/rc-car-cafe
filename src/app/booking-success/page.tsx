"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Navigation from "@/components/navigation"
import { CheckCircle, Calendar, Clock, Users, DollarSign, MapPin, Phone, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Booking {
  id: string
  startTime: string
  endTime: string
  duration: number
  players: number
  totalPrice: number
  status: string
  paymentStatus: string
  game: {
    id: string
    name: string
    description: string | null
    duration: number
    price: number
  }
}

function BookingSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const bookingId = searchParams.get("id")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (!bookingId) {
      setError("Booking ID is missing")
      setLoading(false)
      return
    }

    if (status === "authenticated") {
      fetchBooking()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, status, router])

  const fetchBooking = async () => {
    if (!bookingId) return

    try {
      const response = await fetch("/api/bookings")
      if (response.ok) {
        const data = await response.json()
        const foundBooking = data.bookings.find((b: Booking) => b.id === bookingId)
        
        if (foundBooking) {
          setBooking(foundBooking)
        } else {
          setError("Booking not found")
        }
      } else {
        setError("Failed to fetch booking details")
      }
    } catch {
      setError("An error occurred while fetching booking details")
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <Navigation />
        <div className="max-w-3xl mx-auto pt-16 md:pt-20 py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
                  {error || "Booking not found"}
                </h2>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-fury-orange text-white rounded-lg font-semibold hover:bg-fury-orange/90 transition-all"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const startDate = new Date(booking.startTime)
  const endDate = new Date(booking.endTime)
  const formattedDate = startDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedStartTime = startDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })
  const formattedEndTime = endDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Google Maps embed URL with location and directions
  const mapLocation = "FuryRoad RC Club, Yelenahalli Main Rd, Akshayanagara East, Akshayanagar, Bengaluru, Karnataka 560114"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navigation />

      <div className="max-w-5xl mx-auto pt-16 md:pt-20 py-6 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-400">
            Your booking has been successfully confirmed. We&apos;ll see you soon!
          </p>
        </div>

        {/* Booking Summary */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Booking Summary</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-fury-orange/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Calendar className="h-5 w-5 text-fury-orange" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">Date & Time</div>
                <div className="text-white font-semibold">{formattedDate}</div>
                <div className="text-gray-300">{formattedStartTime} - {formattedEndTime}</div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 bg-fury-orange/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Clock className="h-5 w-5 text-fury-orange" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">Game</div>
                <div className="text-white font-semibold">{booking.game.name}</div>
                {booking.game.description && (
                  <div className="text-gray-300 text-sm mt-1">{booking.game.description}</div>
                )}
                <div className="text-gray-300 text-sm mt-1">Duration: {booking.duration} minutes</div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 bg-fury-orange/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Users className="h-5 w-5 text-fury-orange" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">Players</div>
                <div className="text-white font-semibold">{booking.players} {booking.players === 1 ? "Player" : "Players"}</div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 bg-fury-orange/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <DollarSign className="h-5 w-5 text-fury-orange" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">Total Amount</div>
                <div className="text-white font-semibold text-xl">₹{Number(booking.totalPrice).toLocaleString("en-IN")}</div>
                <div className="text-green-400 text-sm mt-1">Payment Status: {booking.paymentStatus}</div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 bg-fury-orange/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-fury-orange" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">Booking Status</div>
                <div className="text-green-400 font-semibold">{booking.status}</div>
                <div className="text-gray-300 text-sm mt-1">Booking ID: {booking.id}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Location & Contact */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Location & Contact</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-fury-orange/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <MapPin className="h-5 w-5 text-fury-orange" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">Address</div>
                <div className="text-white">{mapLocation}</div>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 bg-fury-orange/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Phone className="h-5 w-5 text-fury-orange" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">Phone</div>
                <a href="tel:+919945576007" className="text-white hover:text-fury-orange transition-colors">
                  +91 99455 76007
                </a>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-10 h-10 bg-fury-orange/20 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                <Mail className="h-5 w-5 text-fury-orange" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">Email</div>
                <a href="mailto:furyroadrcclub@gmail.com" className="text-white hover:text-fury-orange transition-colors">
                  furyroadrcclub@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="w-full h-96 rounded-lg overflow-hidden border border-white/20">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(mapLocation)}&output=embed`}
              title="FuryRoad RC Club Location"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center px-6 py-3 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
          <Link
            href="/book"
            className="flex items-center justify-center px-6 py-3 bg-fury-orange text-white rounded-lg font-semibold hover:bg-fury-orange/90 transition-all"
          >
            Book Another Session
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function BookingSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
            <p className="mt-4 text-gray-300">Loading...</p>
          </div>
        </div>
      }
    >
      <BookingSuccessContent />
    </Suspense>
  )
}
