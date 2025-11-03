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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-3xl mx-auto pt-20 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book a Race</h2>
              
              {/* Disabled Notice */}
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 mb-1">
                      Booking Temporarily Disabled
                    </h3>
                    <p className="text-sm text-yellow-700">
                      Booking and payment features are currently disabled. Please check back later or contact us for more information.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 opacity-50 pointer-events-none" style={{ position: 'relative' }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Game
                  </label>
                  <select
                    {...register("gameId")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  >
                    <option value="">Choose a game...</option>
                    {games.map((game) => (
                      <option key={game.id} value={game.id}>
                        {game.name} - ₹{game.price} ({game.duration} min)
                      </option>
                    ))}
                  </select>
                  {errors.gameId && (
                    <p className="mt-1 text-sm text-red-600">{errors.gameId.message}</p>
                  )}
                </div>

                {selectedGame && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">{selectedGame.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{selectedGame.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{selectedGame.duration} minutes</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                        <span>₹{selectedGame.price} per player</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span>Max {selectedGame.maxPlayers} players</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      {...register("date")}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      {...register("time")}
                      type="time"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                    />
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Players
                  </label>
                  <select
                    {...register("players", { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white"
                  >
                    <option value={1}>1 Player</option>
                    <option value={2}>2 Players</option>
                    <option value={3}>3 Players</option>
                    <option value={4}>4 Players</option>
                  </select>
                  {errors.players && (
                    <p className="mt-1 text-sm text-red-600">{errors.players.message}</p>
                  )}
                </div>

                {selectedGame && (
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-medium text-indigo-900 mb-2">Booking Summary</h4>
                    <div className="text-sm text-indigo-700">
                      <p>Game: {selectedGame.name}</p>
                      <p>Duration: {selectedGame.duration} minutes</p>
                      <p>Players: {watch("players") || 1}</p>
                      <p className="font-semibold">
                        Total: ₹{selectedGame.price * (watch("players") || 1)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-fury-orange text-white rounded-lg text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 transition-colors"
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <BookPageContent />
    </Suspense>
  )
}
