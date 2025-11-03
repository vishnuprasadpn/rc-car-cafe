"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, X, Clock, User, Trophy } from "lucide-react"

interface Point {
  id: string
  amount: number
  reason: string
  status: string
  createdAt: string
  approvedAt: string | null
  user: {
    id: string
    name: string
    email: string
  }
}

export default function AdminPointsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [points, setPoints] = useState<Point[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")
  const [error, setError] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard")
    } else if (status === "authenticated") {
      fetchPoints()
    }
  }, [status, session, router, filter])

  const fetchPoints = async () => {
    try {
      const url = filter === "ALL" ? "/api/admin/points" : `/api/admin/points?status=${filter}`
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setPoints(data.points)
      }
    } catch (error) {
      console.error("Error fetching points:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (pointId: string) => {
    try {
      const response = await fetch(`/api/admin/points/${pointId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "APPROVED" }),
      })

      if (response.ok) {
        await fetchPoints()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to approve points")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  const handleReject = async (pointId: string) => {
    try {
      const response = await fetch(`/api/admin/points/${pointId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "REJECTED" }),
      })

      if (response.ok) {
        await fetchPoints()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to reject points")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== "ADMIN") {
    return null
  }

  const pendingPoints = points.filter(p => p.status === "PENDING")
  const approvedPoints = points.filter(p => p.status === "APPROVED")
  const rejectedPoints = points.filter(p => p.status === "REJECTED")

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Fury Road RC Club - Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Dashboard
              </Link>
              <span className="text-sm text-gray-700">Welcome, {session.user.name}</span>
              <button
                onClick={() => router.push("/api/auth/signout")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto pt-20 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Points Management</h2>
            <p className="text-gray-600">Review and approve customer points</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Points
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {pendingPoints.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Approved Points
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {approvedPoints.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Rejected Points
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {rejectedPoints.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Points List</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter("ALL")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      filter === "ALL" 
                        ? "bg-fury-orange/20 text-fury-orange border border-fury-orange/30" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("PENDING")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      filter === "PENDING" 
                        ? "bg-fury-orange/20 text-fury-orange border border-fury-orange/30" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter("APPROVED")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      filter === "APPROVED" 
                        ? "bg-fury-orange/20 text-fury-orange border border-fury-orange/30" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setFilter("REJECTED")}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      filter === "REJECTED" 
                        ? "bg-fury-orange/20 text-fury-orange border border-fury-orange/30" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Rejected
                  </button>
                </div>
              </div>

              {points.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No points found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {points.map((point) => (
                        <tr key={point.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-indigo-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {point.user.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {point.user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                {point.amount}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {point.reason}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              point.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                              point.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {point.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(point.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            {point.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() => handleApprove(point.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(point.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </>
                            )}
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
