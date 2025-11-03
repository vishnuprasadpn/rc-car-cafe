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
  BarChart3
} from "lucide-react"
import Navigation from "@/components/navigation"

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard")
    } else if (status === "authenticated") {
      fetchStats()
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

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-fury-orange border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />

      <div className="max-w-7xl mx-auto pt-20 py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {session.user.name}! Manage your Fury Road RC Club operations</p>
              </div>
              <div className="hidden md:flex items-center space-x-3">
                <div className="px-4 py-2 bg-fury-orange/10 rounded-lg border border-fury-orange/20">
                  <span className="text-sm font-semibold text-fury-orange">ADMIN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users Card */}
            <div className="group relative bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            {/* Active Games Card */}
            <div className="group relative bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Gamepad2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Active Games</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalGames}</p>
                </div>
              </div>
            </div>

            {/* Total Bookings Card */}
            <div className="group relative bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </div>

            {/* Total Revenue Card */}
            <div className="group relative bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="absolute top-0 right-0 w-20 h-20 bg-fury-orange/10 rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-fury-orange to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Pending Points Card */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-fury-orange/10 to-primary-600/10 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Trophy className="h-5 w-5 text-fury-orange mr-2" />
                  Pending Points Approvals
                </h3>
              </div>
              <div className="px-6 py-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-fury-orange/10 rounded-full mb-4">
                    <Trophy className="h-8 w-8 text-fury-orange" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingPoints}</p>
                  <p className="text-sm text-gray-500 mb-6">points pending approval</p>
                  <Link
                    href="/admin/points"
                    className="inline-flex items-center px-5 py-2.5 bg-fury-orange text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-fury-orange/25"
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Review Points
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 text-fury-orange mr-2" />
                  Quick Actions
                </h3>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/admin/games"
                    className="group flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-fury-orange/10 transition-all duration-300 border border-gray-200 hover:border-fury-orange/30"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Gamepad2 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center">Games</span>
                  </Link>
                  <Link
                    href="/admin/users"
                    className="group flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-fury-orange/10 transition-all duration-300 border border-gray-200 hover:border-fury-orange/30"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center">Users</span>
                  </Link>
                  <Link
                    href="/admin/bookings"
                    className="group flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-fury-orange/10 transition-all duration-300 border border-gray-200 hover:border-fury-orange/30"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center">Bookings</span>
                  </Link>
                  <Link
                    href="/admin/reports"
                    className="group flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-fury-orange/10 transition-all duration-300 border border-gray-200 hover:border-fury-orange/30"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 text-center">Reports</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No recent activity</p>
                <p className="text-sm text-gray-400 mt-1">Activity will appear here as it happens</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
