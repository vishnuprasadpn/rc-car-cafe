"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, TrendingUp, Users, Calendar, DollarSign } from "lucide-react"

interface ReportData {
  summary: {
    totalRevenue: number
    totalBookings: number
    completedBookings: number
    cancelledBookings: number
    totalUsers: number
    newUsers: number
    averageBookingValue: number
  }
  gameStats: Array<{
    gameId: string
    bookings: number
    revenue: number
  }>
  dailyRevenue: Array<{
    date: string
    revenue: number
  }>
  topGames: Array<{
    gameId: string
    gameName: string
    _sum: { totalPrice: number }
    _count: { id: number }
  }>
}

export default function AdminReportsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("month")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN") {
      router.push("/dashboard")
    } else if (status === "authenticated") {
      fetchReports()
    }
  }, [status, session, router, period, startDate, endDate])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (period) params.append('period', period)
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)

      const response = await fetch(`/api/admin/reports?${params}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to fetch reports" }))
        console.error("Error fetching reports:", errorData.message)
        setReportData(null)
      }
    } catch (error) {
      console.error("Error fetching reports:", error)
      setReportData(null)
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

  if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center text-gray-400 hover:text-fury-orange mb-2 transition-colors text-sm"
            >
              ← Back to Dashboard
            </Link>
            <h2 className="text-lg sm:text-2xl font-bold text-white">Reports & Analytics</h2>
            <p className="text-xs sm:text-sm text-gray-400">View detailed analytics and performance metrics</p>
          </div>

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl mb-6">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-white mb-4">Filter Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Period
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent transition-all"
                  >
                    <option value="week" className="bg-gray-900">Last 7 days</option>
                    <option value="month" className="bg-gray-900">Last 30 days</option>
                    <option value="custom" className="bg-gray-900">Custom range</option>
                  </select>
                </div>
                {period === "custom" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent transition-all"
                      />
                    </div>
                  </>
                )}
                <div className="flex items-end">
                  <button
                    onClick={fetchReports}
                    className="w-full bg-fury-orange text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-fury-orange/90 transition-all shadow-lg hover:shadow-fury-orange/25 text-xs sm:text-sm font-semibold"
                  >
                    Update Reports
                  </button>
                </div>
              </div>
            </div>
          </div>

          {!reportData && !loading && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-8 text-center">
              <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Data Available</h3>
              <p className="text-gray-400 mb-4">No reports data found for the selected period.</p>
              <button
                onClick={fetchReports}
                className="bg-fury-orange text-white px-4 py-2 rounded-md hover:bg-fury-orange/90 transition-all"
              >
                Refresh Reports
              </button>
            </div>
          )}

          {reportData && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden hover:bg-white/20 transition-all">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <DollarSign className="h-6 w-6 text-green-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            Total Revenue
                          </dt>
                          <dd className="text-lg font-medium text-white">
                            ₹{reportData.summary.totalRevenue.toLocaleString()}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden hover:bg-white/20 transition-all">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Calendar className="h-6 w-6 text-blue-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            Total Bookings
                          </dt>
                          <dd className="text-lg font-medium text-white">
                            {reportData.summary.totalBookings}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden hover:bg-white/20 transition-all">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Users className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            New Users
                          </dt>
                          <dd className="text-lg font-medium text-white">
                            {reportData.summary.newUsers}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden hover:bg-white/20 transition-all">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TrendingUp className="h-6 w-6 text-yellow-400" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-400 truncate">
                            Avg Booking Value
                          </dt>
                          <dd className="text-lg font-medium text-white">
                            ₹{reportData.summary.averageBookingValue.toFixed(0)}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Games */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Top Games by Revenue</h3>
                    <div className="space-y-3">
                      {reportData.topGames.map((game, index) => (
                        <div key={game.gameId} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-fury-orange mr-3">
                              #{index + 1}
                            </span>
                            <span className="font-medium text-white">{game.gameName}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-white">₹{game._sum.totalPrice.toLocaleString()}</p>
                            <p className="text-sm text-gray-400">{game._count.id} bookings</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-white mb-4">Booking Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                        <span className="text-green-400 font-medium">Completed</span>
                        <span className="text-green-400 font-bold">{reportData.summary.completedBookings}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <span className="text-red-400 font-medium">Cancelled</span>
                        <span className="text-red-400 font-bold">{reportData.summary.cancelledBookings}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-lg">
                        <span className="text-gray-300 font-medium">Total</span>
                        <span className="text-white font-bold">{reportData.summary.totalBookings}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Revenue Chart Placeholder */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Daily Revenue Trend</h3>
                  <div className="text-center py-8 text-gray-400">
                    <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p>Chart visualization would be implemented here</p>
                    <p className="text-sm">Data available: {reportData.dailyRevenue.length} days</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
