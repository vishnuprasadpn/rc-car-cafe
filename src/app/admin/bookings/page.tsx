"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Calendar, Clock, Users, CheckCircle, X, AlertCircle, Trophy, Trash2 } from "lucide-react"

interface Booking {
  id: string
  user: {
    name: string
    email: string
    phone?: string
  }
  game: {
    name: string
  }
  startTime: string
  endTime: string
  duration: number
  players: number
  status: string
  paymentStatus: string
  totalPrice: number
  createdAt: string
}

export default function AdminBookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all")
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN") {
      router.push("/dashboard")
    } else if (status === "authenticated") {
      fetchBookings()
    }
  }, [status, session, router])

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to confirm this booking?")) {
      return
    }

    setProcessing(bookingId)
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: "POST",
      })

      if (response.ok) {
        // Refresh bookings list
        fetchBookings()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to confirm booking")
      }
    } catch (error) {
      console.error("Error confirming booking:", error)
      alert("Failed to confirm booking. Please try again.")
    } finally {
      setProcessing(null)
    }
  }

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      return
    }

    setProcessing(bookingId)
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Refresh bookings list
        fetchBookings()
        alert("Booking deleted successfully")
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to delete booking")
      }
    } catch (error) {
      console.error("Error deleting booking:", error)
      alert("Failed to delete booking. Please try again.")
    } finally {
      setProcessing(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "PENDING":
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
      case "CANCELLED":
        return <X className="h-5 w-5 text-red-400" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex px-3 py-1 text-xs font-semibold rounded-full"
    switch (status) {
      case "CONFIRMED":
        return `${baseClasses} bg-green-500/20 text-green-400 border border-green-500/30`
      case "PENDING":
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`
      case "CANCELLED":
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`
      case "COMPLETED":
        return `${baseClasses} bg-blue-500/20 text-blue-400 border border-blue-500/30`
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`
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

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true
    return booking.status.toLowerCase() === filter.toUpperCase()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white mb-2">Manage Bookings</h1>
                <p className="text-xs sm:text-sm text-gray-400">View and confirm customer bookings</p>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "All", value: "all" as const },
                { label: "Pending", value: "pending" as const },
                { label: "Confirmed", value: "confirmed" as const },
                { label: "Cancelled", value: "cancelled" as const },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    filter === option.value
                      ? "bg-fury-orange text-white shadow-lg"
                      : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No bookings found</h3>
              <p className="text-gray-400">
                {filter === "all"
                  ? "No bookings have been created yet."
                  : `No ${filter} bookings found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1 flex items-center">
                            <Trophy className="h-5 w-5 text-fury-orange mr-2" />
                            {booking.game.name}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-400">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{booking.user.name} ({booking.user.email})</span>
                            </div>
                            {booking.user.phone && (
                              <div className="flex items-center">
                                <span className="mr-1">📞</span>
                                <span>{booking.user.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={getStatusBadge(booking.status)}>
                          <span className="flex items-center">
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Date & Time</p>
                          <p className="text-white font-medium">
                            {new Date(booking.startTime).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-gray-300 text-xs">
                            {new Date(booking.startTime).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Duration</p>
                          <p className="text-white font-medium">{booking.duration} min</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Players</p>
                          <p className="text-white font-medium">{booking.players}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Total Price</p>
                          <p className="text-white font-medium">₹{booking.totalPrice}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 lg:ml-4">
                      {booking.status === "PENDING" && (
                        <button
                          onClick={() => handleConfirmBooking(booking.id)}
                          disabled={processing === booking.id}
                          className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processing === booking.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
                              Confirming...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirm Booking
                            </>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteBooking(booking.id)}
                        disabled={processing === booking.id}
                        className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {processing === booking.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

