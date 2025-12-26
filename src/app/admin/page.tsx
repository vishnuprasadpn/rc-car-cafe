"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Users, 
  Gamepad2, 
  Calendar, 
  Trophy, 
  AlertCircle,
  X
} from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalGames: number
  totalBookings: number
  totalRevenue: number
  pendingPoints: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGames: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingPoints: 0
  })
  const [loading, setLoading] = useState(true)
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0)
  const [showPendingBookingsAlert, setShowPendingBookingsAlert] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN") {
      router.push("/dashboard")
    } else if (status === "authenticated") {
      fetchStats()
      fetchPendingBookings()
    }
  }, [status, session, router])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingBookings = async () => {
    try {
      const response = await fetch("/api/admin/bookings")
      if (response.ok) {
        const data = await response.json()
        const pendingCount = (data.bookings || []).filter(
          (booking: { status: string }) => booking.status === "PENDING"
        ).length
        setPendingBookingsCount(pendingCount)
        // Show alert if there are pending bookings
        if (pendingCount > 0) {
          setShowPendingBookingsAlert(true)
        }
      }
    } catch (error) {
      console.error("Error fetching pending bookings:", error)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-fury-orange border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-300 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* Pending Bookings Alert Modal */}
      {showPendingBookingsAlert && pendingBookingsCount > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-lg border border-yellow-500/30 rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mr-4 border border-yellow-500/30">
                  <AlertCircle className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Pending Bookings Alert</h3>
                  <p className="text-sm text-gray-400 mt-1">Action required</p>
                </div>
              </div>
              <button
                onClick={() => setShowPendingBookingsAlert(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-white mb-2">
                You have <span className="font-bold text-yellow-400">{pendingBookingsCount}</span> pending booking{pendingBookingsCount > 1 ? 's' : ''} that need your attention.
              </p>
              <p className="text-gray-300 text-sm">
                Please review and confirm these bookings to ensure smooth operations.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/bookings"
                onClick={() => setShowPendingBookingsAlert(false)}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-yellow-500/25 text-center"
              >
                View Pending Bookings
              </Link>
              <button
                onClick={() => setShowPendingBookingsAlert(false)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-lg font-medium transition-colors border border-white/20"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-400">Welcome back, {session.user.name}! Manage your Fury Road RC Club operations</p>
              </div>
              <div className="hidden md:flex items-center space-x-3">
                <div className="px-4 py-2 bg-fury-orange/20 rounded-lg border border-fury-orange/40 backdrop-blur-sm">
                  <span className="text-sm font-semibold text-fury-orange">ADMIN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users Card */}
            <Link href="/admin/users" className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-bl-full"></div>
              <div className="relative p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Total Users</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </Link>

            {/* Active Games Card */}
            <Link href="/admin/games" className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/10 rounded-bl-full"></div>
              <div className="relative p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Gamepad2 className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Active Games</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalGames}</p>
                </div>
              </div>
            </Link>

            {/* Total Bookings Card */}
            <Link href="/admin/bookings" className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-bl-full"></div>
              <div className="relative p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Total Bookings</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">{stats.totalBookings}</p>
                </div>
              </div>
            </Link>

            {/* Total Revenue Card */}
            <Link href="/admin/reports" className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-300 overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 w-16 h-16 bg-fury-orange/10 rounded-bl-full"></div>
              <div className="relative p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-fury-orange to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-1">Total Revenue</p>
                  <p className="text-lg sm:text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pending Points Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-fury-orange/20 to-primary-600/20 px-6 py-4 border-b border-white/20">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center">
                  <Trophy className="h-5 w-5 text-fury-orange mr-2" />
                  Pending Points Approvals
                </h3>
              </div>
              <div className="px-6 py-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-fury-orange/20 rounded-full mb-4 border border-fury-orange/30">
                    <Trophy className="h-8 w-8 text-fury-orange" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-white mb-1">{stats.pendingPoints}</p>
                  <p className="text-sm text-gray-400 mb-6">points pending approval</p>
                  <Link
                    href="/admin/points"
                    className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-fury-orange to-primary-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-fury-orange/25"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Review Points
                  </Link>
                </div>
              </div>
            </div>

            {/* Pending Bookings Approval Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 px-6 py-4 border-b border-white/20">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center">
                  <Calendar className="h-5 w-5 text-yellow-400 mr-2" />
                  Pending Bookings Approval
                </h3>
              </div>
              <div className="px-6 py-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mb-4 border border-yellow-500/30">
                    <Calendar className="h-8 w-8 text-yellow-400" />
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-white mb-1">{pendingBookingsCount}</p>
                  <p className="text-sm text-gray-400 mb-6">bookings pending approval</p>
                  <Link
                    href="/admin/bookings"
                    className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-yellow-500/25"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Review Bookings
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-white/10 to-white/5 px-6 py-4 border-b border-white/20">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold text-white flex items-center">
                  <Calendar className="h-5 w-5 text-fury-orange mr-2" />
                  Recent Activity
                </h3>
                <Link
                  href="/admin/activity"
                  className="text-sm font-medium text-fury-orange hover:text-primary-600 transition-colors"
                >
                  View all →
                </Link>
              </div>
            </div>
            <div className="px-6 py-8">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-4 border border-white/10">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-400 font-medium">No recent activity</p>
                <p className="text-sm text-gray-500 mt-1">Activity will appear here as it happens</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
