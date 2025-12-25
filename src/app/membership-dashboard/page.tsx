"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Trophy, Clock, Calendar, CheckCircle, DollarSign, AlertCircle, Car, Gamepad2, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

interface MembershipSession {
  id: string
  usedAt: string
  usedByName: string | null
  notes: string | null
  booking: {
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

export default function MembershipDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [membership, setMembership] = useState<Membership | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchMembership()
    }
  }, [status, router])

  const fetchMembership = async () => {
    try {
      const response = await fetch("/api/memberships/me")
      if (response.ok) {
        const data = await response.json()
        setMembership(data.membership)
      }
    } catch (error) {
      console.error("Error fetching membership:", error)
    } finally {
      setLoading(false)
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

  const canBook = membership && membership.status === "ACTIVE" && membership.sessionsRemaining > 0

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-fury-orange border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-300 font-medium">Loading membership...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Membership</h1>
          <p className="text-gray-400">View your membership details and session history</p>
        </div>

        {!membership ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-12 text-center">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Active Membership</h3>
            <p className="text-gray-400 mb-6">You don&apos;t have an active membership yet.</p>
            <Link
              href="/membership"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-fury-orange to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-fury-orange/25 font-semibold"
            >
              View Membership Plans
            </Link>
          </div>
        ) : (
          <>
            {/* Membership Status Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {membership.planType === "RC_TRACK" ? (
                    <Car className="h-8 w-8 text-fury-orange mr-3" />
                  ) : (
                    <Gamepad2 className="h-8 w-8 text-fury-orange mr-3" />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {membership.planType.replace("_", " ")} Membership
                    </h2>
                    <p className={`text-sm font-medium ${
                      membership.status === "ACTIVE" ? "text-green-400" :
                      membership.status === "EXPIRED" ? "text-red-400" :
                      "text-gray-400"
                    }`}>
                      Status: {membership.status}
                    </p>
                  </div>
                </div>
                {!canBook && (
                  <div className="flex items-center px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <span className="text-red-400 text-sm font-medium">
                      {membership.status !== "ACTIVE" ? "Membership Expired" : "No Sessions Remaining"}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Clock className="h-5 w-5 text-fury-orange mr-2" />
                    <span className="text-sm text-gray-400">Sessions</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {membership.sessionsRemaining} / {membership.sessionsTotal}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">remaining</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Calendar className="h-5 w-5 text-fury-orange mr-2" />
                    <span className="text-sm text-gray-400">Expires</span>
                  </div>
                  <p className="text-lg font-semibold text-white">
                    {formatDate(membership.expiryDate)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Started: {formatDate(membership.startDate)}
                  </p>
                </div>
                {canBook && (
                  <div className="bg-white/5 rounded-lg p-4 flex items-center justify-center">
                    <Link
                      href="/book"
                      className="w-full px-6 py-3 bg-gradient-to-r from-fury-orange to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-fury-orange/25 font-semibold text-center flex items-center justify-center"
                    >
                      <LinkIcon className="h-5 w-5 mr-2" />
                      Book Session
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Session History */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-fury-orange" />
                Session Usage History
              </h3>
              {membership.sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No sessions used yet
                </div>
              ) : (
                <div className="overflow-x-auto">
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
                      {membership.sessions.map((session) => (
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
                </div>
              )}
            </div>

            {/* Transaction History */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-fury-orange" />
                Transaction History
              </h3>
              {membership.transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No transactions found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Payment Method</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {membership.transactions.map((transaction) => (
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

