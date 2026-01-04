"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Trophy, Clock, Calendar } from "lucide-react"

interface Booking {
  id: string
  game: {
    name: string
  }
  startTime: string
  endTime: string
  status: string
  totalPrice: number
}

interface UserPoints {
  total: number
  pending: number
  approved: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [points, setPoints] = useState<UserPoints>({ total: 0, pending: 0, approved: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      const [bookingsRes, pointsRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/points")
      ])

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData.bookings || [])
      }

      if (pointsRes.ok) {
        const pointsData = await pointsRes.json()
        setPoints(pointsData)
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">

      <div className="max-w-7xl mx-auto py-8 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-xs sm:text-sm text-gray-400">Welcome back, {session.user?.name || "User"}!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Trophy className="h-6 w-6 text-fury-orange" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Total Points
                    </dt>
                    <dd className="text-base sm:text-lg font-medium text-white">
                      {points.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-fury-orange" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Pending Points
                    </dt>
                    <dd className="text-base sm:text-lg font-medium text-white">
                      {points.pending}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base sm:text-lg leading-6 font-medium text-white mb-4">
                  Recent Bookings
                </h3>
                {bookings.length === 0 ? (
                  <p className="text-gray-400">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                        <div>
                          <p className="font-medium text-white">{booking.game.name}</p>
                          <p className="text-sm text-gray-400">
                            {new Date(booking.startTime).toLocaleDateString()} at{" "}
                            {new Date(booking.startTime).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">₹{booking.totalPrice}</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                            'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <Link
                    href="/bookings"
                    className="text-fury-orange hover:text-primary-600 text-sm font-medium transition-colors"
                  >
                    View all bookings →
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base sm:text-lg leading-6 font-medium text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/book"
                    className="block w-full bg-fury-orange text-white text-center py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-fury-orange/90 transition-all shadow-lg hover:shadow-fury-orange/25 flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Book Now
                  </Link>
                  <Link
                    href="/points"
                    className="block w-full bg-fury-orange text-white text-center py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-fury-orange/90 transition-all shadow-lg hover:shadow-fury-orange/25"
                  >
                    View Points
                  </Link>
                  <Link
                    href="/profile"
                    className="block w-full bg-white/10 border border-white/20 text-white text-center py-2 px-4 sm:py-2.5 sm:px-5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-white/20 transition-all"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
