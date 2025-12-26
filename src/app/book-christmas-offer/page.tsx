"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Clock, Users, DollarSign, Calendar, Gift } from "lucide-react"
import Navigation from "@/components/navigation"
import { trackBooking, trackFormSubmit } from "@/lib/analytics"

const bookingSchema = z.object({
  gameId: z.string().min(1, "Please select a track"),
  startTime: z.string().min(1, "Please select a date and time"),
  players: z.number().min(1).max(2),
})

type BookingForm = z.infer<typeof bookingSchema>

interface Game {
  id: string
  name: string
  duration: number
  price: number
}

export default function BookChristmasOfferPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState(599) // Fixed price for Christmas offer

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      players: 1,
    },
  })

  const selectedGameId = watch("gameId")
  const selectedStartTime = watch("startTime")

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect to sign in with return URL
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent("/book-christmas-offer")}`)
    } else if (status === "authenticated") {
      fetchGames()
    }
  }, [status, router])

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games")
      if (response.ok) {
        const data = await response.json()
        setGames(data.games || [])
      }
    } catch (error) {
      console.error("Error fetching games:", error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: BookingForm) => {
    if (!session?.user) {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent("/book-christmas-offer")}`)
      return
    }

    setSubmitting(true)
    try {
      const startTime = new Date(data.startTime)
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: data.gameId,
          startTime: startTime.toISOString(),
          players: data.players,
          duration: 60, // 1 hour for Christmas offer
          totalPrice: 599, // Fixed price
        }),
      })

      if (response.ok) {
        const responseData = await response.json()
        trackBooking("create", data.gameId, estimatedPrice)
        trackFormSubmit("booking_form", true, {
          gameId: data.gameId,
          players: data.players,
        })
        router.push("/dashboard?booking=success")
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to create booking. Please try again.")
      }
    } catch (error) {
      console.error("Error creating booking:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-fury-orange border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navigation />
      <div className="max-w-4xl mx-auto py-8 sm:px-6 lg:px-8 pt-16 md:pt-20">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-red-600/20 rounded-full mb-4 border border-red-500/30">
              <Gift className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-red-400 font-semibold">CHRISTMAS & NEW YEAR OFFER</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Book Your Christmas Special
            </h1>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-6">
              <div className="space-y-3">
                <div className="flex items-center justify-center text-white">
                  <Clock className="h-5 w-5 mr-2 text-yellow-400" />
                  <span className="text-lg font-semibold">1 Hour of Playtime</span>
                </div>
                <p className="text-gray-300">1 hour of playtime on any track</p>
                <p className="text-yellow-400 font-bold text-2xl">Just ₹599</p>
                <p className="text-gray-400 text-sm">Valid till 1st January 2025</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Track Selection */}
              <div>
                <label htmlFor="gameId" className="block text-sm font-medium text-gray-300 mb-2">
                  Select Track <span className="text-red-400">*</span>
                </label>
                <select
                  id="gameId"
                  {...register("gameId")}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                >
                  <option value="">Choose a track...</option>
                  {games.map((game) => (
                    <option key={game.id} value={game.id} className="bg-gray-900">
                      {game.name}
                    </option>
                  ))}
                </select>
                {errors.gameId && (
                  <p className="mt-1 text-sm text-red-400">{errors.gameId.message}</p>
                )}
              </div>

              {/* Date and Time */}
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Date & Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  {...register("startTime")}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                />
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-400">{errors.startTime.message}</p>
                )}
              </div>

              {/* Number of Players */}
              <div>
                <label htmlFor="players" className="block text-sm font-medium text-gray-300 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  Number of Players <span className="text-red-400">*</span>
                </label>
                <select
                  id="players"
                  {...register("players", { valueAsNumber: true })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                >
                  <option value={1} className="bg-gray-900">1 Player</option>
                  <option value={2} className="bg-gray-900">2 Players</option>
                </select>
                {errors.players && (
                  <p className="mt-1 text-sm text-red-400">{errors.players.message}</p>
                )}
              </div>

              {/* Price Summary */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300">Christmas & New Year Offer</span>
                  <span className="text-white font-semibold">₹599</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Includes 1 hour of playtime on any track
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Processing..." : "Complete Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

