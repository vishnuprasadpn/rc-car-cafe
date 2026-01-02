"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Play, Pause, RotateCcw, Plus, Trash2, Clock, X } from "lucide-react"

interface Track {
  id: string
  name: string
  type: string
}

interface Timer {
  id: string
  customerName: string
  trackId: string | null
  track: Track | null
  allocatedMinutes: number
  remainingSeconds: number
  remainingMinutes?: number
  remainingSecondsOnly?: number
  status: string
  isCombo: boolean
  createdAt: string
}

const TRACKS = [
  { name: "Fast Track", type: "FAST_TRACK" },
  { name: "Sand Track", type: "SAND_TRACK" },
  { name: "Mud Track", type: "MUD_TRACK" },
  { name: "Crawler Track", type: "CRAWLER_TRACK" }
]

const TIME_PACKAGES = [15, 30, 45, 60, 120]

export default function AdminTimerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [tracks, setTracks] = useState<Track[]>([])
  const [timers, setTimers] = useState<Timer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    customerName: "",
    trackId: "",
    allocatedMinutes: 30,
    isCombo: false
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN" && (session?.user as { role?: string })?.role !== "STAFF") {
      router.push("/dashboard")
    } else if (status === "authenticated") {
      fetchTracks()
      fetchTimers()
      // Poll for updates every 2 seconds
      const interval = setInterval(fetchTimers, 2000)
      return () => clearInterval(interval)
    }
  }, [status, session, router])

  const fetchTracks = async () => {
    try {
      const response = await fetch("/api/tracks")
      if (response.ok) {
        const data = await response.json()
        setTracks(data.tracks)
      }
    } catch (err) {
      console.error("Error fetching tracks:", err)
    }
  }

  const fetchTimers = async () => {
    try {
      // Fetch all timers including STOPPED ones for admin/staff
      const response = await fetch("/api/timers?all=true")
      if (response.ok) {
        const data = await response.json()
        console.log("Fetched timers:", data.timers?.length || 0, "timers")
        console.log("Timer statuses:", data.timers?.map((t: Timer) => ({ id: t.id, status: t.status, customer: t.customerName })))
        setTimers(data.timers || [])
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Failed to fetch timers:", response.status, response.statusText, errorData)
      }
    } catch (err) {
      console.error("Error fetching timers:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTimer = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    if (!formData.customerName.trim()) {
      setError("Customer name is required")
      setSubmitting(false)
      return
    }

    if (!formData.isCombo && !formData.trackId) {
      setError("Please select a track or enable combo timer")
      setSubmitting(false)
      return
    }

    try {
      console.log("Creating timer with data:", {
        customerName: formData.customerName.trim(),
        trackId: formData.isCombo ? null : formData.trackId,
        allocatedMinutes: formData.allocatedMinutes,
        isCombo: formData.isCombo
      })

      const response = await fetch("/api/timers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: formData.customerName.trim(),
          trackId: formData.isCombo ? null : formData.trackId,
          allocatedMinutes: formData.allocatedMinutes,
          isCombo: formData.isCombo
        }),
      })

      console.log("Response status:", response.status, response.ok)

      if (response.ok) {
        const result = await response.json()
        console.log("Timer created successfully:", result)
        
        // Clear form and close
        setShowForm(false)
        setFormData({
          customerName: "",
          trackId: "",
          allocatedMinutes: 30,
          isCombo: false
        })
        setError("") // Clear any previous errors
        
        // Refresh the timer list
        await fetchTimers()
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        const errorMessage = errorData.message || `Failed to create timer (Status: ${response.status})`
        setError(errorMessage)
        console.error("Failed to create timer:", response.status, errorMessage, errorData)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again."
      setError(errorMessage)
      console.error("Error creating timer:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleTimerAction = async (timerId: string, action: string, minutes?: number) => {
    setError("")
    try {
      const response = await fetch(`/api/timers/${timerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, minutes }),
      })

      if (response.ok) {
        await fetchTimers()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to update timer")
      }
    } catch {
      setError("An error occurred. Please try again.")
    }
  }

  const handleDelete = async (timerId: string) => {
    if (!confirm("Are you sure you want to delete this timer? This action cannot be undone and will permanently remove it from the database.")) return

    setError("")
    try {
      const response = await fetch(`/api/timers/${timerId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Immediately remove from local state for instant UI update
        setTimers(prevTimers => prevTimers.filter(t => t.id !== timerId))
        // Then refresh from server to ensure consistency
        await fetchTimers()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to delete timer")
        // Refresh to get current state
        await fetchTimers()
      }
    } catch {
      setError("An error occurred. Please try again.")
      // Refresh to get current state
      await fetchTimers()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const isTimeUp = (seconds: number) => seconds <= 0

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

  if (!session || !session.user || ((session.user as { role?: string }).role !== "ADMIN" && (session.user as { role?: string }).role !== "STAFF")) {
    return null
  }

  // Group timers by track
  const trackTimers: Record<string, Timer[]> = {}
  const comboTimers: Timer[] = []

  timers.forEach(timer => {
    if (timer.isCombo) {
      comboTimers.push(timer)
    } else if (timer.trackId) {
      if (!trackTimers[timer.trackId]) {
        trackTimers[timer.trackId] = []
      }
      trackTimers[timer.trackId].push(timer)
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Timer Management</h2>
              <p className="text-gray-400 text-sm mt-1">Manage customer timers for all tracks</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-fury-orange to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-fury-orange/25"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Timer
            </button>
          </div>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="ml-4 text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {showForm && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl mb-6 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-white">Create New Timer</h3>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setFormData({
                      customerName: "",
                      trackId: "",
                      allocatedMinutes: 30,
                      isCombo: false
                    })
                    setError("")
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCreateTimer} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fury-orange text-sm"
                      placeholder="Customer Name"
                      required
                    />
                  </div>

                  {!formData.isCombo && (
                    <div>
                      <select
                        value={formData.trackId}
                        onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-fury-orange text-sm"
                        required={!formData.isCombo}
                      >
                        <option value="">Select Track</option>
                        {tracks.map(track => (
                          <option key={track.id} value={track.id} className="bg-gray-800">
                            {track.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <select
                      value={formData.allocatedMinutes}
                      onChange={(e) => setFormData({ ...formData, allocatedMinutes: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-fury-orange text-sm"
                    >
                      {TIME_PACKAGES.map(mins => (
                        <option key={mins} value={mins} className="bg-gray-800">
                          {mins} min
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="combo-timer"
                    checked={formData.isCombo}
                    onChange={(e) => setFormData({ ...formData, isCombo: e.target.checked, trackId: e.target.checked ? "" : formData.trackId })}
                    className="rounded w-4 h-4"
                  />
                  <label htmlFor="combo-timer" className="text-sm text-gray-300 cursor-pointer">
                    Combo Timer (Any Track)
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setFormData({
                        customerName: "",
                        trackId: "",
                        allocatedMinutes: 30,
                        isCombo: false
                      })
                      setError("")
                    }}
                    className="px-4 py-1.5 border border-white/20 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-1.5 bg-gradient-to-r from-fury-orange to-primary-600 text-white rounded-md text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Combo Timers Section */}
          {comboTimers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-4">Combo Timers (Global)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {comboTimers.map(timer => (
                    <div key={timer.id} className={`bg-white/10 backdrop-blur-lg border rounded-xl p-4 ${
                      isTimeUp(timer.remainingSeconds) 
                        ? "border-orange-500/30 bg-orange-500/5" 
                        : "border-white/20"
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-semibold">{timer.customerName}</h4>
                          <p className="text-gray-400 text-sm">Combo Timer</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          timer.status === "RUNNING" ? "bg-green-500/20 text-green-400" :
                          timer.status === "PAUSED" ? "bg-yellow-500/20 text-yellow-400" :
                          timer.status === "COMPLETED" ? "bg-red-500/20 text-red-400" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {timer.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        {isTimeUp(timer.remainingSeconds) ? (
                          <div className="text-center w-full">
                            <div className="text-lg font-medium text-orange-400 mb-1">
                              Time&apos;s Up
                            </div>
                            <div className="text-xs text-gray-300">
                              {timer.customerName}
                            </div>
                          </div>
                        ) : (
                          <>
                            <Clock className="h-5 w-5 text-fury-orange" />
                            <span className={`text-2xl font-bold ${
                              timer.remainingSeconds < 60 ? "text-red-400" : "text-white"
                            }`}>
                              {formatTime(timer.remainingSeconds)}
                            </span>
                            <span className="text-gray-400 text-sm">/ {timer.allocatedMinutes}m</span>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {timer.status === "COMPLETED" ? (
                          <div className="flex-1 px-3 py-2 bg-red-500/10 text-red-400 rounded-md text-sm font-medium text-center">
                            Timer Completed
                          </div>
                        ) : timer.status === "RUNNING" ? (
                          <button
                            onClick={() => handleTimerAction(timer.id, "pause")}
                            className="flex-1 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-md text-sm font-medium transition-colors"
                          >
                            <Pause className="h-4 w-4 inline mr-1" />
                            Pause
                          </button>
                        ) : (
                          <button
                            onClick={() => handleTimerAction(timer.id, "start")}
                            className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-md text-sm font-medium transition-colors"
                          >
                            <Play className="h-4 w-4 inline mr-1" />
                            Start
                          </button>
                        )}
                        {timer.status !== "COMPLETED" && (
                          <>
                            <button
                              onClick={() => handleTimerAction(timer.id, "reset")}
                              className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-md text-sm font-medium transition-colors"
                            >
                              <RotateCcw className="h-4 w-4 inline mr-1" />
                              Reset
                            </button>
                            <button
                              onClick={() => handleTimerAction(timer.id, "add_time", 5)}
                              className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-md text-sm font-medium transition-colors"
                            >
                              +5m
                            </button>
                            <button
                              onClick={() => handleTimerAction(timer.id, "add_time", 10)}
                              className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-md text-sm font-medium transition-colors"
                            >
                              +10m
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(timer.id)}
                          className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md text-sm font-medium transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
              ))}
              </div>
            </div>
          )}

          {/* Track-Specific Timers */}
          {TRACKS.map(trackType => {
            const track = tracks.find(t => t.type === trackType.type)
            if (!track) return null
            const trackTimerList = trackTimers[track.id] || []
            if (trackTimerList.length === 0 && comboTimers.length === 0 && Object.keys(trackTimers).length === 0) return null

            return (
              <div key={track.id} className="mb-6">
                <h3 className="text-xl font-bold text-white mb-4">{track.name}</h3>
                {trackTimerList.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No active timers</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trackTimerList.map(timer => (
                        <div key={timer.id} className={`bg-white/10 backdrop-blur-lg border rounded-xl p-4 ${
                      isTimeUp(timer.remainingSeconds) 
                        ? "border-orange-500/30 bg-orange-500/5" 
                        : "border-white/20"
                    }`}>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="text-white font-semibold">{timer.customerName}</h4>
                              <p className="text-gray-400 text-sm">{track.name}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              timer.status === "RUNNING" ? "bg-green-500/20 text-green-400" :
                              timer.status === "PAUSED" ? "bg-yellow-500/20 text-yellow-400" :
                              timer.status === "COMPLETED" ? "bg-red-500/20 text-red-400" :
                              "bg-gray-500/20 text-gray-400"
                            }`}>
                              {timer.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            {isTimeUp(timer.remainingSeconds) ? (
                              <div className="text-center w-full">
                                <div className="animate-pulse text-2xl font-bold text-red-600 mb-1">
                                  TIME&apos;S UP!
                                </div>
                                <div className="text-sm text-red-400 font-semibold animate-bounce">
                                  {timer.customerName}
                                </div>
                              </div>
                            ) : (
                              <>
                                <Clock className="h-5 w-5 text-fury-orange" />
                                <span className={`text-2xl font-bold ${
                                  timer.remainingSeconds < 60 ? "text-red-400" : "text-white"
                                }`}>
                                  {formatTime(timer.remainingSeconds)}
                                </span>
                                <span className="text-gray-400 text-sm">/ {timer.allocatedMinutes}m</span>
                              </>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {timer.status === "RUNNING" ? (
                              <button
                                onClick={() => handleTimerAction(timer.id, "pause")}
                                className="flex-1 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-md text-sm font-medium transition-colors"
                              >
                                <Pause className="h-4 w-4 inline mr-1" />
                                Pause
                              </button>
                            ) : (
                              <button
                                onClick={() => handleTimerAction(timer.id, "start")}
                                className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-md text-sm font-medium transition-colors"
                              >
                                <Play className="h-4 w-4 inline mr-1" />
                                Start
                              </button>
                            )}
                            <button
                              onClick={() => handleTimerAction(timer.id, "reset")}
                              className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-md text-sm font-medium transition-colors"
                            >
                              <RotateCcw className="h-4 w-4 inline mr-1" />
                              Reset
                            </button>
                            <button
                              onClick={() => handleTimerAction(timer.id, "add_time", 5)}
                              className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-md text-sm font-medium transition-colors"
                            >
                              +5m
                            </button>
                            <button
                              onClick={() => handleTimerAction(timer.id, "add_time", 10)}
                              className="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-md text-sm font-medium transition-colors"
                            >
                              +10m
                            </button>
                            <button
                              onClick={() => handleDelete(timer.id)}
                              className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md text-sm font-medium transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {timers.length === 0 && !showForm && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No timers created yet</p>
              <p className="text-gray-500 text-sm mt-2">Click &quot;Add Timer&quot; to create your first timer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

