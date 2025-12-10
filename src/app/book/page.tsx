"use client"

import { Suspense } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Clock, Users, DollarSign } from "lucide-react"
import Navigation from "@/components/navigation"

const bookingSchema = z.object({
  gameId: z.string().min(1, "Please select a game"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  players: z.number().min(1).max(4),
})

type BookingForm = z.infer<typeof bookingSchema>

interface Game {
  id: string
  name: string
  description: string
  duration: number
  price: number
  maxPlayers: number
}

function BookPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
  })

  const selectedGameId = watch("gameId")
  const selectedGame = games.find(game => game.id === selectedGameId)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchGames()
    }
  }, [status, router])

  // Handle track parameter from URL
  useEffect(() => {
    const trackParam = searchParams.get('track')
    if (trackParam && games.length > 0) {
      const matchingGame = games.find(game => 
        game.name.toLowerCase().includes(trackParam.toLowerCase())
      )
      if (matchingGame) {
        setValue('gameId', matchingGame.id)
      }
    }
  }, [searchParams, games, setValue])

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games")
      if (response.ok) {
        const data = await response.json()
        setGames(data.games)
      }
    } catch {
      console.error("Error fetching games")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: BookingForm) => {
    setSubmitting(true)
    setError("")

    try {
      const startTime = new Date(`${data.date}T${data.time}`)
      
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: data.gameId,
          startTime: startTime.toISOString(),
          players: data.players,
        }),
      })

      if (response.ok) {
        router.push("/dashboard?success=booking_created")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to create booking")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
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

      <div className="max-w-3xl mx-auto pt-20 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg sm:text-2xl font-bold text-white mb-6">Book a Race</h2>
              
              {error && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Game
                  </label>
                  <select
                    {...register("gameId")}
                    className="w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white bg-white/10 backdrop-blur-sm"
                  >
                    <option value="">Choose a game...</option>
                    {games.map((game) => (
                      <option key={game.id} value={game.id} className="bg-gray-800">
                        {game.name} - ₹{game.price} ({game.duration} min)
                      </option>
                    ))}
                  </select>
                  {errors.gameId && (
                    <p className="mt-1 text-sm text-red-400">{errors.gameId.message}</p>
                  )}
                </div>

                {selectedGame && (
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <h3 className="font-medium text-white mb-2">{selectedGame.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{selectedGame.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-300">
                        <Clock className="h-4 w-4 text-fury-orange mr-2" />
                        <span>{selectedGame.duration} minutes</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <DollarSign className="h-4 w-4 text-fury-orange mr-2" />
                        <span>₹{selectedGame.price} per player</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <Users className="h-4 w-4 text-fury-orange mr-2" />
                        <span>Max {selectedGame.maxPlayers} players</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      {...register("date")}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white bg-white/10 backdrop-blur-sm"
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-400">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time
                    </label>
                    <input
                      {...register("time")}
                      type="time"
                      className="w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white bg-white/10 backdrop-blur-sm"
                    />
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-400">{errors.time.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Players
                  </label>
                  <select
                    {...register("players", { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white bg-white/10 backdrop-blur-sm"
                  >
                    <option value={1} className="bg-gray-800">1 Player</option>
                    <option value={2} className="bg-gray-800">2 Players</option>
                    <option value={3} className="bg-gray-800">3 Players</option>
                    <option value={4} className="bg-gray-800">4 Players</option>
                  </select>
                  {errors.players && (
                    <p className="mt-1 text-sm text-red-400">{errors.players.message}</p>
                  )}
                </div>

                {selectedGame && (
                  <div className="bg-fury-orange/20 border border-fury-orange/40 p-4 rounded-lg">
                    <h4 className="font-medium text-white mb-2">Booking Summary</h4>
                    <div className="text-sm text-gray-300">
                      <p>Game: {selectedGame.name}</p>
                      <p>Duration: {selectedGame.duration} minutes</p>
                      <p>Players: {watch("players") || 1}</p>
                      <p className="font-semibold text-fury-orange">
                        Total: ₹{selectedGame.price * (watch("players") || 1)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 border border-white/20 rounded-lg text-xs sm:text-sm font-medium text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-fury-orange to-primary-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-fury-orange/25"
                  >
                    {submitting ? "Creating Booking..." : "Create Booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <BookPageContent />
    </Suspense>
  )
}
