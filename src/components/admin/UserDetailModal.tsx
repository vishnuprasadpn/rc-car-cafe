"use client"

import { useEffect, useState } from "react"
import { X, Calendar, Phone, Mail, Trophy, Clock, Crown, CheckCircle, XCircle } from "lucide-react"

interface UserDetail {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  createdAt: string
  lastLoginAt: string | null
  bookings: Array<{
    id: string
    game: { name: string }
    startTime: string
    endTime: string
    status: string
    totalPrice: number
    createdAt: string
  }>
  points: Array<{
    id: string
    amount: number
    reason: string
    status: string
    createdAt: string
  }>
  memberships: Array<{
    id: string
    type: string
    status: string
    totalSessions: number
    usedSessions: number
    startDate: string
    expiryDate: string
    purchasePrice: number
    sessions: Array<{
      id: string
      usedDate: string
      players: number
      playerNames: string | null
      notes: string | null
    }>
  }>
}

interface UserDetailModalProps {
  userId: string | null
  onClose: () => void
}

export default function UserDetailModal({ userId, onClose }: UserDetailModalProps) {
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchUserDetail()
    }
  }, [userId])

  const fetchUserDetail = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/users/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUserDetail(data.user)
      }
    } catch (error) {
      console.error("Error fetching user detail:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!userId) return null

  const activeMembership = userDetail?.memberships.find(
    m => m.status === "ACTIVE" && 
    m.usedSessions < m.totalSessions && 
    new Date(m.expiryDate) > new Date()
  )

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-white/20">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fury-orange mx-auto"></div>
              <p className="mt-4 text-gray-300">Loading user details...</p>
            </div>
          ) : userDetail ? (
            <>
              {/* Header */}
              <div className="bg-gradient-to-r from-fury-orange to-primary-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {userDetail.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{userDetail.name}</h3>
                    {activeMembership && (
                      <div className="flex items-center gap-2 mt-1">
                        <Crown className="h-4 w-4 text-yellow-300" />
                        <span className="text-xs text-yellow-200 font-semibold">ACTIVE MEMBER</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                {/* User Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400">Email</span>
                    </div>
                    <p className="text-white">{userDetail.email}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400">Phone</span>
                    </div>
                    <p className="text-white">{userDetail.phone || "Not provided"}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400">Joined</span>
                    </div>
                    <p className="text-white">{new Date(userDetail.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-400">Last Login</span>
                    </div>
                    <p className="text-white">
                      {userDetail.lastLoginAt 
                        ? new Date(userDetail.lastLoginAt).toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>
                </div>

                {/* Active Membership */}
                {activeMembership && (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-6 mb-6 border border-yellow-500/30">
                    <div className="flex items-center gap-2 mb-4">
                      <Crown className="h-5 w-5 text-yellow-400" />
                      <h4 className="text-lg font-semibold text-white">Active Membership</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Type</p>
                        <p className="text-white font-medium">{activeMembership.type.replace("_", " ")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Remaining Sessions</p>
                        <p className="text-white font-medium">
                          {activeMembership.totalSessions - activeMembership.usedSessions} / {activeMembership.totalSessions}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Expires</p>
                        <p className="text-white font-medium">
                          {new Date(activeMembership.expiryDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Price</p>
                        <p className="text-white font-medium">₹{activeMembership.purchasePrice}</p>
                      </div>
                    </div>

                    {/* Used Sessions */}
                    {activeMembership.sessions.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-400 mb-2">Used Sessions</p>
                        <div className="space-y-2">
                          {activeMembership.sessions.map((session) => (
                            <div key={session.id} className="bg-white/5 rounded p-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-white">
                                  {new Date(session.usedDate).toLocaleDateString()} at{" "}
                                  {new Date(session.usedDate).toLocaleTimeString()}
                                </span>
                                <span className="text-gray-400">
                                  {session.players} {session.players === 1 ? "person" : "people"}
                                  {session.playerNames && ` (${session.playerNames})`}
                                </span>
                              </div>
                              {session.notes && (
                                <p className="text-xs text-gray-500 mt-1">{session.notes}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bookings */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Bookings ({userDetail.bookings.length})
                  </h4>
                  {userDetail.bookings.length === 0 ? (
                    <p className="text-gray-400 text-sm">No bookings yet</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {userDetail.bookings.map((booking) => (
                        <div key={booking.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{booking.game.name}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(booking.startTime).toLocaleDateString()} at{" "}
                                {new Date(booking.startTime).toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-medium">₹{booking.totalPrice}</p>
                              <span className={`inline-flex px-2 py-0.5 text-xs rounded-full ${
                                booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                                booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Points */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Points ({userDetail.points.length})
                  </h4>
                  {userDetail.points.length === 0 ? (
                    <p className="text-gray-400 text-sm">No points yet</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {userDetail.points.map((point) => (
                        <div key={point.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{point.reason}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(point.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">+{point.amount}</span>
                              {point.status === 'APPROVED' ? (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              ) : point.status === 'REJECTED' ? (
                                <XCircle className="h-4 w-4 text-red-400" />
                              ) : (
                                <Clock className="h-4 w-4 text-yellow-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-400">Failed to load user details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

