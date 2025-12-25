"use client"

import { useEffect, useState } from "react"
import { X, Calendar, Clock, CheckCircle, DollarSign, User, Mail, Phone, Trophy, CalendarCheck, Plus } from "lucide-react"

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

interface UserDetail {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  createdAt: string
  membership: Membership | null
}

interface UserDetailModalProps {
  userId: string | null
  onClose: () => void
}

export default function UserDetailModal({ userId, onClose }: UserDetailModalProps) {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [markingSession, setMarkingSession] = useState(false)
  const [showCreateMembership, setShowCreateMembership] = useState(false)
  const [creatingMembership, setCreatingMembership] = useState(false)
  const [membershipForm, setMembershipForm] = useState({
    planType: "RC_TRACK" as "RC_TRACK" | "PS5_GAMER_DUO",
    startDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    sessionsTotal: 16
  })

  useEffect(() => {
    if (userId) {
      fetchUserDetails()
    }
  }, [userId])

  const fetchUserDetails = async () => {
    if (!userId) return
    try {
      setLoading(true)
      // First get user info
      const userResponse = await fetch(`/api/admin/users`)
      if (userResponse.ok) {
        const userData = await userResponse.json()
        const foundUser = userData.users.find((u: any) => u.id === userId)
        if (foundUser && foundUser.membership) {
          // Fetch full membership details
          const membershipResponse = await fetch(`/api/admin/memberships/${foundUser.membership.id}`)
          if (membershipResponse.ok) {
            const membershipData = await membershipResponse.json()
            setUser({
              ...foundUser,
              membership: membershipData.membership
            })
          } else {
            setUser(foundUser)
          }
        } else {
          setUser(foundUser)
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
    
    if (!confirm("Mark a session as used for this membership?")) {
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

  if (!userId || !user) {
    return null
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity bg-black/75" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-gradient-to-br from-gray-900 to-black rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full border border-white/20">
          <div className="bg-white/10 backdrop-blur-lg px-6 py-4 border-b border-white/20 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">User Profile & Membership Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-fury-orange border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-300">Loading...</p>
            </div>
          ) : (
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {/* User Profile Section */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2 text-fury-orange" />
                  Profile Information
                </h4>
                <div className="bg-white/5 rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Name</label>
                      <p className="text-white font-medium">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </label>
                      <p className="text-white font-medium">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        Phone
                      </label>
                      <p className="text-white font-medium">{user.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Join Date</label>
                      <p className="text-white font-medium flex items-center">
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
                      <h4 className="text-lg font-semibold text-white flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-fury-orange" />
                        Membership Details
                      </h4>
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
                    <div className="bg-white/5 rounded-lg p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm text-gray-400">Plan Type</label>
                          <p className="text-white font-medium">{user.membership.planType.replace("_", " ")}</p>
                        </div>
                        <div>
                          <label className="text-sm text-gray-400">Status</label>
                          <p className={`font-medium ${
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
                    <h4 className="text-lg font-semibold text-white mb-4">Session Usage History</h4>
                    <div className="bg-white/5 rounded-lg overflow-hidden">
                      {user.membership.sessions.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                          No sessions used yet
                        </div>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-white/5">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Date & Time</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Game</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Marked By</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {user.membership.sessions.map((session) => (
                              <tr key={session.id} className="hover:bg-white/5">
                                <td className="px-4 py-3 text-sm text-white">
                                  {formatDateTime(session.usedAt)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-300">
                                  {session.booking?.game.name || "N/A"}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-300">
                                  {session.usedByName || "System"}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-400">
                                  {session.notes || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-fury-orange" />
                      Transaction History
                    </h4>
                    <div className="bg-white/5 rounded-lg overflow-hidden">
                      {user.membership.transactions.length === 0 ? (
                        <div className="p-6 text-center text-gray-400">
                          No transactions found
                        </div>
                      ) : (
                        <table className="w-full">
                          <thead className="bg-white/5">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Date</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Amount</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Payment Method</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/10">
                            {user.membership.transactions.map((transaction) => (
                              <tr key={transaction.id} className="hover:bg-white/5">
                                <td className="px-4 py-3 text-sm text-white">
                                  {formatDate(transaction.transactionDate)}
                                </td>
                                <td className="px-4 py-3 text-sm text-white font-medium">
                                  ₹{Number(transaction.amount).toLocaleString()}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-300">
                                  {transaction.paymentMethod || "N/A"}
                                </td>
                                <td className="px-4 py-3 text-sm">
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
                                <td className="px-4 py-3 text-sm text-gray-400">
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
                    <h4 className="text-lg font-semibold text-white flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-fury-orange" />
                      Membership
                    </h4>
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
                    <div className="bg-white/5 rounded-lg p-6">
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

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => {
                              setShowCreateMembership(false)
                              setMembershipForm({
                                planType: "RC_TRACK",
                                startDate: new Date().toISOString().split('T')[0],
                                sessionsTotal: 16
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
                    <div className="bg-white/5 rounded-lg p-6 text-center">
                      <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-400 mb-2">No active membership</p>
                      <p className="text-sm text-gray-500">Click "Create Membership" to activate a membership for this user</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

