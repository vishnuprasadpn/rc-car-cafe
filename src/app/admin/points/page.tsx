"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Check, X, Clock, User, Trophy, Trash2, Edit, Save } from "lucide-react"
import { AUTHORIZED_DELETE_ADMIN_EMAIL } from "@/lib/admin-auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

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

const editPointSchema = z.object({
  amount: z.number().int().positive("Amount must be a positive number"),
  reason: z.string().min(1, "Reason is required"),
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
})

type EditPointForm = z.infer<typeof editPointSchema>

export default function AdminPointsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [points, setPoints] = useState<Point[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("ALL")
  const [error, setError] = useState("")
  const [deletingPointId, setDeletingPointId] = useState<string | null>(null)
  const [editingPointId, setEditingPointId] = useState<string | null>(null)
  
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<EditPointForm>({
    resolver: zodResolver(editPointSchema),
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN") {
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
    } catch {
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
    } catch {
      setError("An error occurred. Please try again.")
    }
  }

  const handleDelete = async (pointId: string) => {
    if (!confirm("Are you sure you want to delete this point entry? This action cannot be undone.")) {
      return
    }

    try {
      setDeletingPointId(pointId)
      const response = await fetch(`/api/admin/points/${pointId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchPoints()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to delete point")
      }
    } catch (error) {
      console.error("Error deleting point:", error)
      setError("An error occurred while deleting the point")
    } finally {
      setDeletingPointId(null)
    }
  }

  const handleEdit = (point: Point) => {
    setEditingPointId(point.id)
    resetEdit({
      amount: point.amount,
      reason: point.reason,
      status: point.status as "PENDING" | "APPROVED" | "REJECTED",
    })
  }

  const handleCancelEdit = () => {
    setEditingPointId(null)
    resetEdit()
  }

  const onSubmitEdit = async (data: EditPointForm) => {
    if (!editingPointId) return

    try {
      setError("")
      const response = await fetch(`/api/admin/points/${editingPointId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchPoints()
        handleCancelEdit()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to update point")
      }
    } catch (error) {
      console.error("Error updating point:", error)
      setError("An error occurred while updating the point")
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

  const pendingPoints = points.filter(p => p.status === "PENDING")
  const approvedPoints = points.filter(p => p.status === "APPROVED")
  const rejectedPoints = points.filter(p => p.status === "REJECTED")

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
            <h2 className="text-lg sm:text-2xl font-bold text-white">Points Management</h2>
            <p className="text-xs sm:text-sm text-gray-400">Review and approve customer points</p>
          </div>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden hover:bg-white/20 transition-all">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Pending Points
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {pendingPoints.length}
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
                    <Check className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Approved Points
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {approvedPoints.length}
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
                    <X className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-400 truncate">
                        Rejected Points
                      </dt>
                      <dd className="text-lg font-medium text-white">
                        {rejectedPoints.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Points List</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter("ALL")}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                      filter === "ALL" 
                        ? "bg-fury-orange/20 text-fury-orange border border-fury-orange/40" 
                        : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("PENDING")}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                      filter === "PENDING" 
                        ? "bg-fury-orange/20 text-fury-orange border border-fury-orange/40" 
                        : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter("APPROVED")}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                      filter === "APPROVED" 
                        ? "bg-fury-orange/20 text-fury-orange border border-fury-orange/40" 
                        : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setFilter("REJECTED")}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                      filter === "REJECTED" 
                        ? "bg-fury-orange/20 text-fury-orange border border-fury-orange/40" 
                        : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    Rejected
                  </button>
                </div>
              </div>

              {points.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No points found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/5 divide-y divide-white/10">
                      {points.map((point) => (
                        <tr key={point.id} className="hover:bg-white/10 transition-colors">
                          {editingPointId === point.id ? (
                            // Edit mode
                            <>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                                      <User className="h-5 w-5 text-blue-400" />
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">
                                      {point.user.name}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {point.user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="number"
                                  {...registerEdit("amount", { valueAsNumber: true })}
                                  className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange"
                                />
                                {editErrors.amount && (
                                  <p className="text-red-400 text-xs mt-1">{editErrors.amount.message}</p>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  {...registerEdit("reason")}
                                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange"
                                />
                                {editErrors.reason && (
                                  <p className="text-red-400 text-xs mt-1">{editErrors.reason.message}</p>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  {...registerEdit("status")}
                                  className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange"
                                >
                                  <option value="PENDING">PENDING</option>
                                  <option value="APPROVED">APPROVED</option>
                                  <option value="REJECTED">REJECTED</option>
                                </select>
                                {editErrors.status && (
                                  <p className="text-red-400 text-xs mt-1">{editErrors.status.message}</p>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {new Date(point.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  onClick={handleSubmitEdit(onSubmitEdit)}
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                  title="Save changes"
                                >
                                  <Save className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="text-gray-400 hover:text-gray-300 transition-colors"
                                  title="Cancel"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </td>
                            </>
                          ) : (
                            // View mode
                            <>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-10 w-10">
                                    <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                                      <User className="h-5 w-5 text-blue-400" />
                                    </div>
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-white">
                                      {point.user.name}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {point.user.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Trophy className="h-4 w-4 text-fury-orange mr-1" />
                                  <span className="text-sm font-medium text-white">
                                    {point.amount}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-300">
                                  {point.reason}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  point.status === 'APPROVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                  point.status === 'REJECTED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                }`}>
                                  {point.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {new Date(point.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  onClick={() => handleEdit(point)}
                                  className="text-blue-400 hover:text-blue-300 transition-colors"
                                  title="Edit point"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                {point.status === "PENDING" && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(point.id)}
                                      className="text-green-400 hover:text-green-300 transition-colors"
                                      title="Approve"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleReject(point.id)}
                                      className="text-red-400 hover:text-red-300 transition-colors"
                                      title="Reject"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                                {session?.user?.email?.toLowerCase() === AUTHORIZED_DELETE_ADMIN_EMAIL.toLowerCase() && (
                                  <button
                                    onClick={() => handleDelete(point.id)}
                                    disabled={deletingPointId === point.id}
                                    className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Delete point (only authorized admin)"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </td>
                            </>
                          )}
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
