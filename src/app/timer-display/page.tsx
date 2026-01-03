"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

const TRACK_ORDER: readonly string[] = ["FAST_TRACK", "SAND_TRACK", "MUD_TRACK", "CRAWLER_TRACK", "PS5_GAMING"] as const

export default function TimerDisplayPage() {
  const [timers, setTimers] = useState<Timer[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [playedBeeps, setPlayedBeeps] = useState<Set<string>>(new Set())

  // Function to play beep sound (beep beep beep pattern for 20 seconds)
  const playBeep = () => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const beepDuration = 0.2 // 200ms beep
      const pauseDuration = 0.3 // 300ms pause
      const totalDuration = 20 // 20 seconds total
      const beepCount = Math.floor(totalDuration / (beepDuration + pauseDuration))

      for (let i = 0; i < beepCount; i++) {
        const startTime = audioContext.currentTime + i * (beepDuration + pauseDuration)
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 800 // Beep frequency
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.3, startTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + beepDuration)

        oscillator.start(startTime)
        oscillator.stop(startTime + beepDuration)
      }
    } catch (error) {
      console.error('Error playing beep:', error)
    }
  }

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
        const newTimers = data.timers || []
        
        // Check for timers that just reached 0 and play beep
        newTimers.forEach((timer: Timer) => {
          const totalSeconds = timer.remainingMinutes * 60 + timer.remainingSecondsOnly
          if (totalSeconds <= 0 && !playedBeeps.has(timer.id)) {
            playBeep()
            setPlayedBeeps(prev => new Set(prev).add(timer.id))
          } else if (totalSeconds > 0 && playedBeeps.has(timer.id)) {
            // Reset beep flag if timer is reset/restarted
            setPlayedBeeps(prev => {
              const newSet = new Set(prev)
              newSet.delete(timer.id)
              return newSet
            })
          }
        })
        
        setTimers(newTimers)
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
    if (seconds <= 0) return "text-red-600"
    const percentage = (seconds / (allocated * 60)) * 100
    if (percentage > 50) return "text-green-400"
    if (percentage > 25) return "text-yellow-400"
    return "text-red-400"
  }

  const isTimeUp = (seconds: number) => seconds <= 0

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

  // Sort tracks by predefined order and filter to only show tracks with active timers
  const sortedTracks = tracks
    .filter(track => {
      const trackTimerList = trackTimers[track.id] || []
      return trackTimerList.length > 0
    })
    .sort((a, b) => {
      const indexA = TRACK_ORDER.indexOf(a.type)
      const indexB = TRACK_ORDER.indexOf(b.type)
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_2.jpg"
          alt="RC Car Racing Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/85 via-black/80 to-gray-900/85"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 2xl:p-12">
        {/* Logo in top left corner */}
        <Link href="/" className="absolute top-4 left-4 md:top-8 md:left-8 2xl:top-12 2xl:left-12 z-20 hover:opacity-80 transition-opacity">
          <Image
            src="/header_logo.png"
            alt="Fury Road RC Club Logo"
            width={100}
            height={100}
            className="object-contain drop-shadow-lg md:w-32 md:h-32 2xl:w-40 2xl:h-40"
            priority
          />
        </Link>
        
        <div className="max-w-7xl 2xl:max-w-[90rem] mx-auto">

        {/* Track-Specific Timers and Combo Timers */}
        {(sortedTracks.length > 0 || comboTimers.length > 0) && (
          <div className="flex flex-wrap gap-4 md:gap-6 2xl:gap-8 justify-center">
            {/* Combo Timers Card */}
            {comboTimers.length > 0 && (
              <div
                className="bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-2xl p-4 md:p-6 2xl:p-8 shadow-2xl w-fit mx-auto"
              >
                <h3 className="text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-bold text-fury-orange mb-4 md:mb-6 2xl:mb-8 text-center border-b border-white/20 pb-2 md:pb-3 2xl:pb-4">
                  Combo Players
                </h3>
                <div className="flex flex-wrap gap-3 md:gap-4 2xl:gap-5 justify-center">
                  {comboTimers.map(timer => {
                    // Use API calculated values (already includes real-time calculation)
                    const totalSeconds = timer.remainingMinutes * 60 + timer.remainingSecondsOnly
                    return (
                      <div
                        key={timer.id}
                        className={`bg-black/30 rounded-xl p-3 md:p-4 2xl:p-5 border flex-shrink-0 ${
                          isTimeUp(totalSeconds) 
                            ? "border-orange-500/30 bg-orange-500/10" 
                            : "border-white/10"
                        }`}
                      >
                        <div className="text-center">
                          <h4 className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-semibold text-white mb-2 md:mb-3 2xl:mb-4">
                            {timer.customerName}
                          </h4>
                          <div className="flex items-center justify-center gap-2 2xl:gap-3 mb-2 2xl:mb-3">
                            <Clock className="h-5 w-5 md:h-6 md:w-6 2xl:h-7 2xl:w-7 text-fury-orange" />
                            <span className={`text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold ${isTimeUp(totalSeconds) ? "text-orange-400" : getTimeColor(totalSeconds, timer.allocatedMinutes)}`}>
                              {formatTime(Math.max(0, totalSeconds))}
                            </span>
                            {isTimeUp(totalSeconds) && (
                              <div className="text-center ml-2 2xl:ml-3">
                                <div className="text-xs md:text-sm lg:text-base 2xl:text-lg font-medium text-orange-400">
                                  Time&apos;s Up
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-center gap-2 2xl:gap-3">
                            <span className={`px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 2xl:px-5 2xl:py-2.5 text-xs md:text-sm lg:text-base 2xl:text-lg font-semibold rounded-full ${
                              timer.status === "RUNNING" ? "bg-green-500/30 text-green-300 border border-green-500/50" :
                              timer.status === "PAUSED" ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50" :
                              timer.status === "COMPLETED" ? "bg-red-500/30 text-red-300 border border-red-500/50" :
                              timer.status === "STOPPED" ? "bg-gray-500/30 text-gray-300 border border-gray-500/50" :
                              "bg-gray-500/30 text-gray-300 border border-gray-500/50"
                            }`}>
                              {timer.status}
                            </span>
                            <span className="text-gray-500 text-xs md:text-sm lg:text-base 2xl:text-lg">
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
            {sortedTracks.map(track => {
              const trackTimerList = trackTimers[track.id] || []
              // Only render track card if it has timers
              if (trackTimerList.length === 0) return null
              
              return (
                <div
                  key={track.id}
                  className="bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-2xl p-4 md:p-6 2xl:p-8 shadow-2xl w-fit mx-auto"
                >
                  <h3 className="text-xl md:text-2xl lg:text-3xl 2xl:text-4xl font-bold text-fury-orange mb-4 md:mb-6 2xl:mb-8 text-center border-b border-white/20 pb-2 md:pb-3 2xl:pb-4">
                    {track.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 md:gap-4 2xl:gap-5 justify-center">
                      {trackTimerList.map(timer => {
                      // Use API calculated values (already includes real-time calculation)
                      const totalSeconds = timer.remainingMinutes * 60 + timer.remainingSecondsOnly
                      return (
                        <div
                          key={timer.id}
                          className={`bg-black/30 rounded-xl p-3 md:p-4 2xl:p-5 border flex-shrink-0 ${
                            isTimeUp(totalSeconds) 
                              ? "border-orange-500/30 bg-orange-500/10" 
                              : "border-white/10"
                          }`}
                        >
                          <div className="text-center">
                            <h4 className="text-base md:text-lg lg:text-xl 2xl:text-2xl font-semibold text-white mb-2 md:mb-3 2xl:mb-4">
                              {timer.customerName}
                            </h4>
                            <div className="flex items-center justify-center gap-2 2xl:gap-3 mb-2 2xl:mb-3">
                              <Clock className="h-5 w-5 md:h-6 md:w-6 2xl:h-7 2xl:w-7 text-fury-orange" />
                              <span className={`text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-bold ${isTimeUp(totalSeconds) ? "text-orange-400" : getTimeColor(totalSeconds, timer.allocatedMinutes)}`}>
                                {formatTime(Math.max(0, totalSeconds))}
                              </span>
                              {isTimeUp(totalSeconds) && (
                                <div className="text-center ml-2 2xl:ml-3">
                                  <div className="text-xs md:text-sm lg:text-base 2xl:text-lg font-medium text-orange-400">
                                    Time&apos;s Up
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-center gap-2 2xl:gap-3">
                              <span className={`px-2 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 2xl:px-5 2xl:py-2.5 text-xs md:text-sm lg:text-base 2xl:text-lg font-semibold rounded-full ${
                                timer.status === "RUNNING" ? "bg-green-500/30 text-green-300 border border-green-500/50" :
                                timer.status === "PAUSED" ? "bg-yellow-500/30 text-yellow-300 border border-yellow-500/50" :
                                "bg-gray-500/30 text-gray-300 border border-gray-500/50"
                              }`}>
                                {timer.status}
                              </span>
                              <span className="text-gray-500 text-xs md:text-sm lg:text-base 2xl:text-lg">
                                / {timer.allocatedMinutes}m
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

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
    </div>
  )
}

