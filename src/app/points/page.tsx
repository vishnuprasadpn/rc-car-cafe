"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Trophy, Clock, CheckCircle, XCircle, AlertCircle, Gift, ArrowLeft } from "lucide-react"
import Navigation from "@/components/navigation"

interface Point {
  id: string
  amount: number
  reason: string
  status: string
  createdAt: string
  approvedAt: string | null
}

interface UserPoints {
  total: number
  pending: number
  approved: number
  points: Point[]
}

export default function PointsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [pointsData, setPointsData] = useState<UserPoints>({
    total: 0,
    pending: 0,
    approved: 0,
    points: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchPoints()
    }
  }, [status, router])

  const fetchPoints = async () => {
    try {
      const response = await fetch("/api/points")
      if (response.ok) {
        const data = await response.json()
        setPointsData(data)
      }
    } catch (error) {
      console.error("Error fetching points:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-400" />
      case "PENDING":
        return <AlertCircle className="h-5 w-5 text-yellow-400" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto pt-20 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-400 hover:text-fury-orange mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white flex items-center">
                  <Trophy className="h-8 w-8 text-fury-orange mr-3" />
                  My Points
                </h1>
                <p className="text-gray-400 mt-2">View your loyalty points and transaction history</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden hover:bg-white/20 transition-all">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Gift className="h-8 w-8 text-fury-orange" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Total Points
                      </dt>
                      <dd className="text-xl sm:text-2xl font-bold text-white">
                        {pointsData.total}
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
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Approved Points
                      </dt>
                      <dd className="text-xl sm:text-2xl font-bold text-white">
                        {pointsData.approved}
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
                    <Clock className="h-8 w-8 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Pending Points
                      </dt>
                      <dd className="text-xl sm:text-2xl font-bold text-white">
                        {pointsData.pending}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Points History */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-base sm:text-lg leading-6 font-medium text-white mb-4">
                Points History
              </h2>
              
              {pointsData.points.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-400">No points history yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start earning points by booking games!
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Approved At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/5 divide-y divide-white/10">
                      {pointsData.points.map((point) => (
                        <tr key={point.id} className="hover:bg-white/10 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {formatDate(point.createdAt)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {point.reason}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-lg font-semibold text-green-400">
                              +{point.amount}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              point.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              point.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                              {getStatusIcon(point.status)}
                              <span className="ml-1">{point.status}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {point.approvedAt ? formatDate(point.approvedAt) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-500/20 backdrop-blur-sm border border-blue-500/40 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Trophy className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-400">
                  How Points Work
                </h3>
                <div className="mt-2 text-sm text-blue-300">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Points are awarded for bookings and special promotions</li>
                    <li>Points must be approved by an admin before they can be used</li>
                    <li>You can redeem points for extra playtime or discounts</li>
                    <li>Pending points will be reviewed and approved within 24-48 hours</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

