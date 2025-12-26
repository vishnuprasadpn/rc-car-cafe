"use client"

import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Calendar, Clock, CheckCircle, DollarSign, User, Mail, Phone, Trophy, CalendarCheck, Plus, Receipt, Gift, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface MembershipSession {
  id: string
  usedAt: string
  usedBy: string | null
  usedByName: string | null
  notes: string | null
  booking: {
    id: string
    game: {
      name: string
    }
  } | null
}

interface MembershipTransaction {
  id: string
  amount: number
  paymentMethod: string | null
  status: string
  transactionDate: string
  notes: string | null
}

interface Membership {
  id: string
  planType: string
  startDate: string
  expiryDate: string
  status: string
  sessionsTotal: number
  sessionsUsed: number
  sessionsRemaining: number
  lastBookedDate: string | null
  sessions: MembershipSession[]
  transactions: MembershipTransaction[]
}

interface Booking {
  id: string
  game: {
    name: string
  }
  startTime: string
  players: number
  status: string
  totalPrice: number | null
  paymentStatus: string | null
  createdAt: string
}

interface Point {
  id: string
  amount: number
  reason: string
  status: string
  createdAt: string
}

interface UserDetail {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  createdAt: string
  membership: Membership | null
  bookings?: Booking[]
  points?: Point[]
}

export default function UserDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const userId = params?.id as string

  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [markingSession, setMarkingSession] = useState(false)
  const [showCreateMembership, setShowCreateMembership] = useState(false)
  const [creatingMembership, setCreatingMembership] = useState(false)
  const [editingSession, setEditingSession] = useState<string | null>(null)
  const [deletingSession, setDeletingSession] = useState<string | null>(null)
  const [editSessionForm, setEditSessionForm] = useState({
    usedAt: "",
    notes: ""
  })
  const [membershipForm, setMembershipForm] = useState({
    planType: "RC_TRACK" as "RC_TRACK" | "PS5_GAMER_DUO",
    startDate: new Date().toISOString().split('T')[0],
    sessionsTotal: 16,
    paymentMethod: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN") {
      router.push("/dashboard")
    } else if (status === "authenticated" && userId) {
      fetchUserDetails()
      // Check if URL has hash for create-membership and show form
      if (typeof window !== 'undefined' && window.location.hash === '#create-membership') {
        setShowCreateMembership(true)
        // Scroll to form after a short delay
        setTimeout(() => {
          document.getElementById('create-membership')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [status, session, router, userId])

  const fetchUserDetails = async () => {
    if (!userId) return
    try {
      setLoading(true)
      // Fetch user details with bookings and points
      const userDetailResponse = await fetch(`/api/admin/users/${userId}`)
      if (userDetailResponse.ok) {
        const userDetailData = await userDetailResponse.json()
        const userData = userDetailData.user
        
        // If user has membership, fetch full membership details
        if (userData.memberships && userData.memberships.length > 0) {
          const membershipResponse = await fetch(`/api/admin/memberships/${userData.memberships[0].id}`)
          if (membershipResponse.ok) {
            const membershipData = await membershipResponse.json()
            setUser({
              ...userData,
              membership: membershipData.membership,
              bookings: userData.bookings || [],
              points: userData.points || []
            })
          } else {
            setUser({
              ...userData,
              membership: userData.memberships[0] || null,
              bookings: userData.bookings || [],
              points: userData.points || []
            })
          }
        } else {
          setUser({
            ...userData,
            membership: null,
            bookings: userData.bookings || [],
            points: userData.points || []
          })
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkSessionUsed = async () => {
    if (!user?.membership) return
    
    const confirmMessage = `Mark a session as used for this membership?\n\n` +
      `Current Status:\n` +
      `- Sessions Used: ${user.membership.sessionsUsed} / ${user.membership.sessionsTotal}\n` +
      `- Sessions Remaining: ${user.membership.sessionsRemaining}\n\n` +
      `This will:\n` +
      `- Increment sessions used by 1\n` +
      `- Decrement sessions remaining by 1\n` +
      `- Update last booked date`
    
    if (!confirm(confirmMessage)) {
      return
    }

    try {
      setMarkingSession(true)
      const response = await fetch(`/api/admin/memberships/${user.membership.id}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: `Session marked as used by admin`,
        }),
      })

      if (response.ok) {
        await fetchUserDetails()
        alert("Session marked as used successfully")
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to mark session as used")
      }
    } catch (error) {
      console.error("Error marking session:", error)
      alert("An error occurred")
    } finally {
      setMarkingSession(false)
    }
  }

  const handleEditSession = (session: MembershipSession) => {
    setEditingSession(session.id)
    setEditSessionForm({
      usedAt: new Date(session.usedAt).toISOString().slice(0, 16), // Format for datetime-local input
      notes: session.notes || ""
    })
  }

  const handleSaveSessionEdit = async (sessionId: string) => {
    if (!user?.membership) return

    try {
      const response = await fetch(`/api/admin/memberships/${user.membership.id}/sessions/${sessionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usedAt: editSessionForm.usedAt,
          notes: editSessionForm.notes,
        }),
      })

      if (response.ok) {
        await fetchUserDetails()
        setEditingSession(null)
        setEditSessionForm({ usedAt: "", notes: "" })
        alert("Session updated successfully")
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to update session")
      }
    } catch (error) {
      console.error("Error updating session:", error)
      alert("An error occurred")
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!user?.membership) return

    const confirmMessage = `Are you sure you want to delete this session?\n\n` +
      `This will:\n` +
      `- Decrement sessions used by 1\n` +
      `- Increment sessions remaining by 1\n` +
      `- Remove this session from history\n\n` +
      `This action cannot be undone.`

    if (!confirm(confirmMessage)) {
      return
    }

    try {
      setDeletingSession(sessionId)
      const response = await fetch(`/api/admin/memberships/${user.membership.id}/sessions/${sessionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchUserDetails()
        alert("Session deleted successfully")
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to delete session")
      }
    } catch (error) {
      console.error("Error deleting session:", error)
      alert("An error occurred")
    } finally {
      setDeletingSession(null)
    }
  }

  const handleCreateMembership = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!confirm(`Create ${membershipForm.planType.replace("_", " ")} membership for ${user.name}?`)) {
      return
    }

    try {
      setCreatingMembership(true)
      const response = await fetch("/api/admin/memberships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          planType: membershipForm.planType,
          startDate: membershipForm.startDate,
          sessionsTotal: membershipForm.sessionsTotal,
          paymentMethod: membershipForm.paymentMethod || undefined,
        }),
      })

      if (response.ok) {
        await fetchUserDetails()
        setShowCreateMembership(false)
        alert("Membership created successfully!")
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to create membership")
      }
    } catch (error) {
      console.error("Error creating membership:", error)
      alert("An error occurred while creating membership")
    } finally {
      setCreatingMembership(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-fury-orange border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-300 font-medium">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user as { role?: string })?.role !== "ADMIN") {
    return null
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-400">User not found</p>
            <Link href="/admin/users" className="text-fury-orange hover:text-primary-600 mt-4 inline-block">
              ← Back to Users
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="inline-flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">User Profile & Membership Details</h1>
          <p className="text-gray-400">Manage membership and view user information</p>
        </div>

        {/* User Profile Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-fury-orange" />
            Profile Information
          </h2>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <p className="text-white font-medium text-lg">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </label>
                <p className="text-white font-medium text-lg">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Phone
                </label>
                <p className="text-white font-medium text-lg">{user.phone || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Join Date</label>
                <p className="text-white font-medium text-lg flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Section */}
        {user.membership ? (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-fury-orange" />
                  Membership Details
                </h2>
                {user.membership.status === "ACTIVE" && user.membership.sessionsRemaining > 0 && (
                  <button
                    onClick={handleMarkSessionUsed}
                    disabled={markingSession}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {markingSession ? "Marking..." : "Mark Session Used"}
                  </button>
                )}
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm text-gray-400">Plan Type</label>
                    <p className="text-white font-medium">{user.membership.planType.replace("_", " ")}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Status</label>
                    <p className={`font-medium text-lg ${
                      user.membership.status === "ACTIVE" ? "text-green-400" :
                      user.membership.status === "EXPIRED" ? "text-red-400" :
                      "text-gray-400"
                    }`}>
                      {user.membership.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Sessions</label>
                    <p className="text-white font-medium">
                      {user.membership.sessionsUsed} / {user.membership.sessionsTotal} used
                      <span className="text-fury-orange ml-2">
                        ({user.membership.sessionsRemaining} remaining)
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Start Date
                    </label>
                    <p className="text-white font-medium">{formatDate(user.membership.startDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Expiry Date
                    </label>
                    <p className="text-white font-medium">{formatDate(user.membership.expiryDate)}</p>
                  </div>
                  {user.membership.lastBookedDate && (
                    <div>
                      <label className="text-sm text-gray-400 flex items-center">
                        <CalendarCheck className="h-4 w-4 mr-1" />
                        Last Booked
                      </label>
                      <p className="text-white font-medium">{formatDate(user.membership.lastBookedDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Session History */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Session Usage History</h2>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
                {user.membership.sessions.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    No sessions used yet
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Date & Time</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Game</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Marked By</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Notes</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {user.membership.sessions.map((session) => (
                        <tr key={session.id} className="hover:bg-white/5">
                          {editingSession === session.id ? (
                            <>
                              <td className="px-6 py-4">
                                <input
                                  type="datetime-local"
                                  value={editSessionForm.usedAt}
                                  onChange={(e) => setEditSessionForm({ ...editSessionForm, usedAt: e.target.value })}
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange"
                                />
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">
                                {session.booking?.game.name || "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">
                                {session.usedByName || "System"}
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  type="text"
                                  value={editSessionForm.notes}
                                  onChange={(e) => setEditSessionForm({ ...editSessionForm, notes: e.target.value })}
                                  placeholder="Notes"
                                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleSaveSessionEdit(session.id)}
                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingSession(null)
                                      setEditSessionForm({ usedAt: "", notes: "" })
                                    }}
                                    className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs font-medium transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-6 py-4 text-sm text-white">
                                {formatDateTime(session.usedAt)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">
                                {session.booking?.game.name || "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">
                                {session.usedByName || "System"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-400">
                                {session.notes || "-"}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditSession(session)}
                                    className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded transition-colors"
                                    title="Edit session"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSession(session.id)}
                                    disabled={deletingSession === session.id}
                                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors disabled:opacity-50"
                                    title="Delete session"
                                  >
                                    {deletingSession === session.id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent"></div>
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Membership Transaction History */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-fury-orange" />
                Membership Transaction History
              </h2>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
                {user.membership.transactions.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    No transactions found
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Payment Method</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {user.membership.transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-white/5">
                          <td className="px-6 py-4 text-sm text-white">
                            {formatDate(transaction.transactionDate)}
                          </td>
                          <td className="px-6 py-4 text-sm text-white font-medium">
                            ₹{Number(transaction.amount).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {transaction.paymentMethod || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              transaction.status === "COMPLETED" 
                                ? "bg-green-500/20 text-green-400"
                                : transaction.status === "PENDING"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-red-500/20 text-red-400"
                            }`}>
                              {transaction.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {transaction.notes || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-fury-orange" />
                Membership
              </h2>
              {!showCreateMembership && (
                <button
                  onClick={() => setShowCreateMembership(true)}
                  className="px-4 py-2 bg-gradient-to-r from-fury-orange to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg text-sm font-semibold transition-all flex items-center shadow-lg hover:shadow-fury-orange/25"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Membership
                </button>
              )}
            </div>

            {showCreateMembership ? (
              <div id="create-membership" className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 scroll-mt-8">
                <form onSubmit={handleCreateMembership} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Plan Type <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={membershipForm.planType}
                      onChange={(e) => setMembershipForm({ ...membershipForm, planType: e.target.value as "RC_TRACK" | "PS5_GAMER_DUO" })}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                      required
                    >
                      <option value="RC_TRACK">RC Track Membership (₹6,999/month)</option>
                      <option value="PS5_GAMER_DUO">PS5 Gamer Duo Pass (₹3,499/month)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={membershipForm.startDate}
                      onChange={(e) => setMembershipForm({ ...membershipForm, startDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Expiry date will be automatically set to 1 month from start date</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Total Sessions <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={membershipForm.sessionsTotal}
                      onChange={(e) => setMembershipForm({ ...membershipForm, sessionsTotal: parseInt(e.target.value) || 16 })}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">Default: 16 sessions per month</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={membershipForm.paymentMethod}
                      onChange={(e) => setMembershipForm({ ...membershipForm, paymentMethod: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                    >
                      <option value="">Select payment method</option>
                      <option value="UPI">UPI</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card (Debit/Credit)</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Razorpay">Razorpay</option>
                      <option value="Stripe">Stripe</option>
                      <option value="Other">Other</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1">Optional: Record how the payment was made</p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateMembership(false)
                        setMembershipForm({
                          planType: "RC_TRACK",
                          startDate: new Date().toISOString().split('T')[0],
                          sessionsTotal: 16,
                          paymentMethod: ""
                        })
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingMembership}
                      className="px-6 py-2 bg-gradient-to-r from-fury-orange to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-fury-orange/25 disabled:opacity-50 flex items-center"
                    >
                      {creatingMembership ? "Creating..." : "Create Membership"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-12 text-center">
                <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-2 text-lg">No active membership</p>
                <p className="text-sm text-gray-500">Click &quot;Create Membership&quot; to activate a membership for this user</p>
              </div>
            )}
          </div>
        )}

        {/* Booking History */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Receipt className="h-5 w-5 mr-2 text-fury-orange" />
            Booking History
          </h2>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
            {!user.bookings || user.bookings.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No bookings found
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Game</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Players</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {user.bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-white">
                        {formatDateTime(booking.startTime)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {booking.game.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {booking.players}
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {booking.totalPrice ? `₹${Number(booking.totalPrice).toLocaleString()}` : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === "CONFIRMED" 
                            ? "bg-green-500/20 text-green-400"
                            : booking.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : booking.status === "CANCELLED"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.paymentStatus === "COMPLETED" 
                            ? "bg-green-500/20 text-green-400"
                            : booking.paymentStatus === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}>
                          {booking.paymentStatus || "N/A"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Points History */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Gift className="h-5 w-5 mr-2 text-fury-orange" />
            Points History
          </h2>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
            {!user.points || user.points.length === 0 ? (
              <div className="p-6 text-center text-gray-400">
                No points history found
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Reason</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {user.points.map((point) => (
                    <tr key={point.id} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-white">
                        {formatDate(point.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {point.amount > 0 ? "+" : ""}{point.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {point.reason}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          point.status === "APPROVED" 
                            ? "bg-green-500/20 text-green-400"
                            : point.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {point.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

