"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

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
  remainingMinutes: number
  remainingSecondsOnly: number
  status: string
  isCombo: boolean
  startTime: string | null
  createdAt: string
}

const TRACK_ORDER = ["FAST_TRACK", "SAND_TRACK", "MUD_TRACK", "CRAWLER_TRACK"]

export default function TimerDisplayPage() {
  const [timers, setTimers] = useState<Timer[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTracks()
    fetchTimers()
    // Poll every 1 second for real-time updates
    const interval = setInterval(fetchTimers, 1000)
    return () => clearInterval(interval)
  }, [])

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
      const response = await fetch("/api/timers")
      if (response.ok) {
        const data = await response.json()
        setTimers(data.timers)
      }
    } catch (err) {
      console.error("Error fetching timers:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTimeColor = (seconds: number, allocated: number) => {
    const percentage = (seconds / (allocated * 60)) * 100
    if (percentage > 50) return "text-green-400"
    if (percentage > 25) return "text-yellow-400"
    return "text-red-400"
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

  // Sort tracks by predefined order
  const sortedTracks = tracks.sort((a, b) => {
    const indexA = TRACK_ORDER.indexOf(a.type as any)
    const indexB = TRACK_ORDER.indexOf(b.type as any)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
          <p className="mt-4 text-gray-300 text-2xl">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2">
            FuryRoad RC Club
          </h1>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold text-fury-orange">
            Timer System
          </h2>
        </div>

        {/* Combo Timers Section */}
        {comboTimers.length > 0 && (
          <div className="mb-8 md:mb-12">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6 text-center">
              Combo Timers (Any Track)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {comboTimers.map(timer => {
                // Use API calculated values (already includes real-time calculation)
                const totalSeconds = timer.remainingMinutes * 60 + timer.remainingSecondsOnly
                return (
                  <div
                    key={timer.id}
                    className="bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-2xl p-4 md:p-6 shadow-2xl"
                  >
                    <div className="text-center">
                      <div className="mb-3 md:mb-4">
                        <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1">
                          {timer.customerName}
                        </h4>
                        <p className="text-gray-400 text-sm md:text-base">Combo Timer</p>
                      </div>
                      <div className="flex items-center justify-center gap-2 md:gap-3 mb-2">
                        <Clock className="h-6 w-6 md:h-8 md:w-8 text-fury-orange" />
                        <span className={`text-3xl md:text-4xl lg:text-5xl font-bold ${getTimeColor(totalSeconds, timer.allocatedMinutes)}`}>
                          {formatTime(totalSeconds)}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className={`px-3 py-1 text-xs md:text-sm font-semibold rounded-full ${
                          timer.status === "RUNNING" ? "bg-green-500/30 text-green-300 border border-green-500/50" :
                          timer.status === "PAUSED" ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50" :
                          "bg-gray-500/30 text-gray-300 border border-gray-500/50"
                        }`}>
                          {timer.status}
                        </span>
                        <span className="text-gray-500 text-xs md:text-sm">
                          / {timer.allocatedMinutes}m
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Track-Specific Timers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {sortedTracks.map(track => {
            const trackTimerList = trackTimers[track.id] || []
            return (
              <div
                key={track.id}
                className="bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-2xl p-4 md:p-6 shadow-2xl"
              >
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-fury-orange mb-4 md:mb-6 text-center border-b border-white/20 pb-2 md:pb-3">
                  {track.name}
                </h3>
                {trackTimerList.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <p className="text-gray-500 text-sm md:text-base">No active timers</p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {trackTimerList.map(timer => {
                      // Use API calculated values (already includes real-time calculation)
                      const totalSeconds = timer.remainingMinutes * 60 + timer.remainingSecondsOnly
                      return (
                        <div
                          key={timer.id}
                          className="bg-black/30 rounded-xl p-3 md:p-4 border border-white/10"
                        >
                          <div className="text-center">
                            <h4 className="text-base md:text-lg lg:text-xl font-semibold text-white mb-2 md:mb-3">
                              {timer.customerName}
                            </h4>
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <Clock className="h-5 w-5 md:h-6 md:w-6 text-fury-orange" />
                              <span className={`text-2xl md:text-3xl lg:text-4xl font-bold ${getTimeColor(totalSeconds, timer.allocatedMinutes)}`}>
                                {formatTime(totalSeconds)}
                              </span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                timer.status === "RUNNING" ? "bg-green-500/30 text-green-300 border border-green-500/50" :
                                timer.status === "PAUSED" ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50" :
                                "bg-gray-500/30 text-gray-300 border border-gray-500/50"
                              }`}>
                                {timer.status}
                              </span>
                              <span className="text-gray-500 text-xs">
                                / {timer.allocatedMinutes}m
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {timers.length === 0 && (
          <div className="text-center py-16 md:py-24">
            <Clock className="h-16 w-16 md:h-24 md:w-24 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl md:text-2xl">No active timers</p>
            <p className="text-gray-500 text-sm md:text-base mt-2">Timers will appear here when started</p>
          </div>
        )}
      </div>
    </div>
  )
}

