"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { 
  Users, 
  Calendar, 
  Trophy, 
  Plus,
  Clock
} from "lucide-react"
import Navigation from "@/components/navigation"

interface DashboardStats {
  totalBookings: number
  todayBookings: number
  pendingPoints: number
  totalCustomers: number
}

export default function StaffDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    todayBookings: 0,
    pendingPoints: 0,
    totalCustomers: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && session?.user && ((session.user as { role?: string }).role !== "STAFF" && (session.user as { role?: string }).role !== "ADMIN")) {
      router.push("/dashboard")
    } else if (status === "authenticated") {
      fetchStats()
    }
  }, [status, session, router])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/staff/stats")
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
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.user || ((session.user as { role?: string }).role !== "STAFF" && (session.user as { role?: string }).role !== "ADMIN")) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto pt-20 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-lg sm:text-2xl font-bold text-white">Staff Dashboard</h2>
            <p className="text-xs sm:text-sm text-gray-400">Manage customer bookings and points</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-fury-orange" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Total Bookings
                    </dt>
                    <dd className="text-base sm:text-lg font-medium text-white">
                      {stats.totalBookings}
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
                      Today&apos;s Bookings
                    </dt>
                    <dd className="text-base sm:text-lg font-medium text-white">
                      {stats.todayBookings}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Trophy className="h-6 w-6 text-fury-orange" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Pending Points
                    </dt>
                    <dd className="text-base sm:text-lg font-medium text-white">
                      {stats.pendingPoints}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5 hover:bg-white/20 transition-all">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-fury-orange" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Total Customers
                    </dt>
                    <dd className="text-base sm:text-lg font-medium text-white">
                      {stats.totalCustomers}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/staff/register-customer"
                    className="flex items-center p-3 bg-white/5 rounded-lg hover:bg-fury-orange/20 transition-all border border-white/10 hover:border-fury-orange/40"
                  >
                    <Plus className="h-5 w-5 text-fury-orange mr-3" />
                    <span className="text-white">Register New Customer</span>
                  </Link>
                  <Link
                    href="/staff/allocate-points"
                    className="flex items-center p-3 bg-white/5 rounded-lg hover:bg-fury-orange/20 transition-all border border-white/10 hover:border-fury-orange/40"
                  >
                    <Trophy className="h-5 w-5 text-fury-orange mr-3" />
                    <span className="text-white">Allocate Points</span>
                  </Link>
                  <Link
                    href="/staff/bookings"
                    className="flex items-center p-3 bg-white/5 rounded-lg hover:bg-fury-orange/20 transition-all border border-white/10 hover:border-fury-orange/40"
                  >
                    <Calendar className="h-5 w-5 text-fury-orange mr-3" />
                    <span className="text-white">View Bookings</span>
                  </Link>
                  <Link
                    href="/staff/customers"
                    className="flex items-center p-3 bg-white/5 rounded-lg hover:bg-fury-orange/20 transition-all border border-white/10 hover:border-fury-orange/40"
                  >
                    <Users className="h-5 w-5 text-fury-orange mr-3" />
                    <span className="text-white">Manage Customers</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-white mb-4">
                  Recent Activity
                </h3>
                <div className="text-center py-8 text-gray-400">
                  <p>Recent staff activity will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
