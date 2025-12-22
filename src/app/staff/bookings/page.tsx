"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Calendar, Clock, Users, Search, Filter, Eye, CheckCircle, XCircle, AlertCircle, Trash2 } from "lucide-react"

interface Booking {
  id: string
  game: {
    name: string
    duration: number
    price: number
  }
  user: {
    name: string
    email: string
  }
  players: number
  startTime: string
  endTime: string
  status: string
  totalAmount: number
  createdAt: string
}

export default function StaffBookingsPage() {
  const { data: session, status } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [isLoading, setIsLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/staff/bookings")
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return
    }

    setProcessing(bookingId)
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
        method: "POST",
      })

      if (response.ok) {
        // Refresh bookings list
        fetchBookings()
        alert("Booking cancelled successfully")
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to cancel booking")
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      alert("Failed to cancel booking. Please try again.")
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

  useEffect(() => {
    if (status !== "loading" && session && session.user && (session.user as { role?: string }).role === "STAFF") {
      fetchBookings()
    }
  }, [status, session])

  useEffect(() => {
    let filtered = bookings

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.game.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }, [bookings, searchTerm, statusFilter])

  if (status === "loading") {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
        <p className="mt-4 text-gray-300">Loading...</p>
      </div>
    </div>
  }

  if (!session || !session.user || (session.user as { role?: string }).role !== "STAFF") {
    redirect("/auth/signin")
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "PENDING":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
            <p className="mt-4 text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-xl sm:text-3xl font-bold text-white flex items-center">
              <Calendar className="h-8 w-8 text-fury-orange mr-3" />
              Manage Bookings
            </h1>
            <p className="text-gray-400 mt-2">View and manage all customer bookings</p>
          </div>

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                    Search Bookings
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      id="search"
                      placeholder="Search by customer name, email, or game..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                    Filter by Status
                  </label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white transition-all"
                    >
                      <option value="ALL" className="bg-gray-900">All Statuses</option>
                      <option value="PENDING" className="bg-gray-900">Pending</option>
                      <option value="CONFIRMED" className="bg-gray-900">Confirmed</option>
                      <option value="CANCELLED" className="bg-gray-900">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-medium text-white mb-4">
                Bookings ({filteredBookings.length})
              </h3>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-300">No bookings found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || statusFilter !== "ALL" 
                      ? "Try adjusting your search or filter criteria"
                      : "No bookings have been made yet"
                    }
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Game
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Players
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/5 divide-y divide-white/10">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-white/10 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-white">{booking.user.name}</div>
                              <div className="text-sm text-gray-400">{booking.user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{booking.game.name}</div>
                            <div className="text-sm text-gray-400">{booking.game.duration} minutes</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">{formatDateTime(booking.startTime)}</div>
                            <div className="text-sm text-gray-400">
                              Ends: {formatDateTime(booking.endTime)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-white">
                              <Users className="h-4 w-4 mr-1" />
                              {booking.players}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                            ₹{booking.totalAmount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                              'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1">{booking.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleDeleteBooking(booking.id)}
                                disabled={processing === booking.id}
                                className="text-red-400 hover:text-red-300 flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete booking"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                {processing === booking.id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
