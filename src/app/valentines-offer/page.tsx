"use client"

import { useSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Clock, Users, Heart, Calendar, Gift, X, Lock, Mail } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { trackBooking, trackFormSubmit, trackButtonClick } from "@/lib/analytics"

const bookingSchema = z.object({
  startTime: z.string().min(1, "Please select a date and time"),
  players: z.number().min(1).max(10),
})

type BookingForm = z.infer<typeof bookingSchema>

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

interface Game {
  id: string
  name: string
  duration: number
  price: number
}

type OfferPlan = "hourly" | "trial"

export default function ValentinesOfferPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<OfferPlan>("hourly")
  const [showLogin, setShowLogin] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingForm>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      players: 1,
    },
  })

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const players = watch("players") || 1

  // Calculate price based on plan and players
  const calculatePrice = () => {
    if (selectedPlan === "hourly") {
      if (players === 1) return 599
      if (players === 2) return 999
      // For 3+ players: base 999 + 499 per extra player
      return 999 + (players - 2) * 499
    } else {
      // Trial Pack
      if (players === 1) return 199
      // For 2+ players: base 199 + 199 per extra player
      return 199 + (players - 1) * 199
    }
  }

  const getOriginalPrice = () => {
    if (selectedPlan === "hourly") {
      if (players === 1) return 749
      if (players === 2) return 1499
      return 1499 + (players - 2) * 499
    } else {
      if (players === 1) return 249
      return 249 + (players - 1) * 199
    }
  }

  const offerPrice = calculatePrice()
  const originalPrice = getOriginalPrice()
  const savings = originalPrice - offerPrice

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games")
      if (response.ok) {
        const data = await response.json()
        setGames(data.games || [])
      }
    } catch (err) {
      console.error("Error fetching games:", err)
    } finally {
      setLoading(false)
    }
  }

  // Find a suitable game for the offer (any 1hr game for hourly, any 15min game for trial)
  const getGameForPlan = () => {
    if (selectedPlan === "hourly") {
      return games.find(g => g.duration === 60) || games[0]
    } else {
      return games.find(g => g.duration === 15) || games[0]
    }
  }

  const onSubmit = async (data: BookingForm) => {
    if (status !== "authenticated" || !session) {
      // Store booking data and show login modal
      sessionStorage.setItem("pendingValentinesBooking", JSON.stringify({
        ...data,
        plan: selectedPlan,
      }))
      setShowLogin(true)
      return
    }

    await submitBooking(data)
  }

  const submitBooking = async (data: BookingForm) => {
    setSubmitting(true)
    setError("")
    trackButtonClick("Book Valentine Offer", "valentines_offer")

    const game = getGameForPlan()
    if (!game) {
      setError("No games available. Please try again later.")
      setSubmitting(false)
      return
    }

    try {
      const startTime = new Date(data.startTime)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: game.id,
          startTime: startTime.toISOString(),
          players: data.players,
          duration: selectedPlan === "hourly" ? 60 : 15,
          totalPrice: offerPrice,
        }),
      })

      if (response.ok) {
        const responseData = await response.json()
        trackBooking("create", game.id, offerPrice)
        trackFormSubmit("valentines_booking_form", true, {
          plan: selectedPlan,
          players: data.players,
          amount: offerPrice,
        })
        router.push(`/booking-success?id=${responseData.booking.id}`)
      } else {
        const errorData = await response.json()
        trackFormSubmit("valentines_booking_form", false, { error: errorData.message })
        setError(errorData.message || "Failed to create booking. Please try again.")
      }
    } catch {
      trackFormSubmit("valentines_booking_form", false, { error: "network_error" })
      setError("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const onLoginSubmit = async (loginData: LoginForm) => {
    setLoginLoading(true)
    setLoginError("")

    try {
      const result = await signIn("credentials", {
        email: loginData.email,
        password: loginData.password,
        redirect: false,
      })

      if (result?.error) {
        setLoginError("Invalid email or password")
      } else {
        setShowLogin(false)
        resetLogin()
        
        const pendingBooking = sessionStorage.getItem("pendingValentinesBooking")
        if (pendingBooking) {
          try {
            const bookingData = JSON.parse(pendingBooking)
            setSelectedPlan(bookingData.plan || "hourly")
            setValue("players", bookingData.players || 1)
            await submitBooking({
              startTime: bookingData.startTime,
              players: bookingData.players,
            })
            sessionStorage.removeItem("pendingValentinesBooking")
          } catch {
            setError("Failed to restore booking data. Please fill the form again.")
          }
        } else {
          router.refresh()
        }
      }
    } catch {
      setLoginError("An error occurred. Please try again.")
    } finally {
      setLoginLoading(false)
    }
  }

  // Check if offer is still valid (till Feb 28)
  const offerEndDate = new Date("2026-02-28T23:59:59")
  const isOfferActive = new Date() <= offerEndDate

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading Valentine&apos;s Offer...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navigation />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_2.jpg"
            alt="Valentine's Day Offer Background"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/60 via-black/80 to-red-900/60"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto pt-24 md:pt-28 px-4 sm:px-6 lg:px-8 pb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/40 mb-6">
              <Heart className="h-5 w-5 text-pink-400 mr-2" />
              <span className="text-pink-200 font-semibold">Valentine&apos;s Day Special</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-white uppercase mb-4">
              Valentine&apos;s Day Offer
            </h1>
            <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mx-auto mb-2">
              Celebrate love with speed! Special pricing on all tracks till <span className="text-pink-400 font-semibold">28th February</span>
            </p>
            {!isOfferActive && (
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 mt-4">
                <span className="text-red-400 font-semibold">This offer has expired</span>
              </div>
            )}
          </div>

          {/* Plan Selection */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Hourly Plan */}
            <button
              type="button"
              onClick={() => { setSelectedPlan("hourly"); setValue("players", 1) }}
              className={`relative text-left rounded-2xl p-6 transition-all duration-300 border-2 ${
                selectedPlan === "hourly"
                  ? "bg-pink-500/20 border-pink-500 shadow-lg shadow-pink-500/20"
                  : "bg-white/5 border-white/20 hover:border-pink-500/50 hover:bg-white/10"
              }`}
            >
              {selectedPlan === "hourly" && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="h-3 w-3 text-white fill-white" />
                </div>
              )}
              <div className="flex items-center mb-3">
                <Clock className="h-6 w-6 text-pink-400 mr-3" />
                <h3 className="font-heading text-xl text-white uppercase">Hourly Plan</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">Access all 4 tracks for 1 hour</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">1 Player</span>
                  <div>
                    <span className="text-gray-500 line-through mr-2">₹749</span>
                    <span className="text-pink-400 font-bold text-lg">₹599</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">2 Players</span>
                  <div>
                    <span className="text-gray-500 line-through mr-2">₹1499</span>
                    <span className="text-pink-400 font-bold text-lg">₹999</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Extra Player</span>
                  <span className="text-pink-400 font-bold">₹499</span>
                </div>
              </div>
            </button>

            {/* Trial Pack */}
            <button
              type="button"
              onClick={() => { setSelectedPlan("trial"); setValue("players", 1) }}
              className={`relative text-left rounded-2xl p-6 transition-all duration-300 border-2 ${
                selectedPlan === "trial"
                  ? "bg-pink-500/20 border-pink-500 shadow-lg shadow-pink-500/20"
                  : "bg-white/5 border-white/20 hover:border-pink-500/50 hover:bg-white/10"
              }`}
            >
              {selectedPlan === "trial" && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                  <Heart className="h-3 w-3 text-white fill-white" />
                </div>
              )}
              <div className="flex items-center mb-3">
                <Gift className="h-6 w-6 text-pink-400 mr-3" />
                <h3 className="font-heading text-xl text-white uppercase">Trial Pack</h3>
              </div>
              <p className="text-gray-300 text-sm mb-4">Try 1 track for 15 minutes</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">1 Player</span>
                  <div>
                    <span className="text-gray-500 line-through mr-2">₹249</span>
                    <span className="text-pink-400 font-bold text-lg">₹199</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Extra Player</span>
                  <span className="text-pink-400 font-bold">₹199</span>
                </div>
              </div>
            </button>
          </div>

          {/* Booking Form */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600/30 to-red-600/30 px-6 py-4 border-b border-white/20">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center">
                <Calendar className="h-5 w-5 text-pink-400 mr-2" />
                Book Your {selectedPlan === "hourly" ? "Hourly Plan" : "Trial Pack"}
              </h2>
            </div>

            <div className="px-4 py-5 sm:p-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-3 rounded-lg mb-6 backdrop-blur-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date & Time <span className="text-pink-400">*</span>
                  </label>
                  <input
                    {...register("startTime")}
                    type="datetime-local"
                    min={new Date().toISOString().slice(0, 16)}
                    max="2026-02-28T23:59"
                    className="w-full px-3 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white bg-white/10 backdrop-blur-sm"
                  />
                  {errors.startTime && (
                    <p className="mt-1 text-sm text-red-400">{errors.startTime.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Players <span className="text-pink-400">*</span>
                  </label>
                  <select
                    {...register("players", { valueAsNumber: true })}
                    className="w-full px-3 py-3 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white bg-white/10 backdrop-blur-sm"
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n} className="bg-gray-800">{n} Player{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  {errors.players && (
                    <p className="mt-1 text-sm text-red-400">{errors.players.message}</p>
                  )}
                </div>

                {/* Price Summary */}
                <div className="bg-gradient-to-r from-pink-500/10 to-red-500/10 border border-pink-500/30 p-5 rounded-xl">
                  <h4 className="font-semibold text-white mb-3 flex items-center">
                    <Heart className="h-4 w-4 text-pink-400 mr-2" />
                    Booking Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Plan</span>
                      <span className="text-white font-medium">
                        {selectedPlan === "hourly" ? "Hourly Plan (1 hr, 4 tracks)" : "Trial Pack (15 mins, 1 track)"}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Players</span>
                      <span className="text-white font-medium">{players}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Duration</span>
                      <span className="text-white font-medium">{selectedPlan === "hourly" ? "60 minutes" : "15 minutes"}</span>
                    </div>
                    {savings > 0 && (
                      <div className="flex justify-between text-gray-400">
                        <span>Original Price</span>
                        <span className="line-through">₹{originalPrice}</span>
                      </div>
                    )}
                    {savings > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>You Save</span>
                        <span className="font-medium">₹{savings}</span>
                      </div>
                    )}
                    <div className="border-t border-pink-500/30 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-white font-semibold text-base">Total</span>
                        <span className="text-pink-400 font-bold text-xl">₹{offerPrice}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !isOfferActive}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-xl font-bold hover:from-pink-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-pink-500/25 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5" />
                      {isOfferActive ? "Book Now" : "Offer Expired"}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Offer Details */}
          <div className="mt-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h3 className="font-heading text-xl text-white uppercase mb-4 flex items-center">
              <Gift className="h-5 w-5 text-pink-400 mr-2" />
              Offer Details
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <Heart className="h-4 w-4 text-pink-400 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Hourly Plan:</strong> Access all 4 RC tracks (Fast Track, Mud Track, Sand Track, Crawler Track) for 1 full hour</span>
              </li>
              <li className="flex items-start">
                <Heart className="h-4 w-4 text-pink-400 mr-2 mt-0.5 flex-shrink-0" />
                <span><strong>Trial Pack:</strong> Try any 1 track for 15 minutes - perfect for first-timers</span>
              </li>
              <li className="flex items-start">
                <Heart className="h-4 w-4 text-pink-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Valid till <strong>28th February 2026</strong></span>
              </li>
              <li className="flex items-start">
                <Heart className="h-4 w-4 text-pink-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Walk-ins welcome, but advance booking recommended</span>
              </li>
              <li className="flex items-start">
                <Heart className="h-4 w-4 text-pink-400 mr-2 mt-0.5 flex-shrink-0" />
                <span>Professional RC cars and equipment provided</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-white/20 w-full max-w-md mx-4 p-6 shadow-2xl">
            <button
              onClick={() => { setShowLogin(false); setLoginError(""); resetLogin() }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Login to Continue</h2>
              <p className="text-gray-400 text-sm">Please login to complete your Valentine&apos;s Day booking</p>
            </div>

            {loginError && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-400 px-4 py-3 rounded-lg mb-4">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...registerLogin("email")}
                    type="email"
                    className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white bg-white/10"
                    placeholder="Enter your email"
                  />
                </div>
                {loginErrors.email && <p className="mt-1 text-sm text-red-400">{loginErrors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    {...registerLogin("password")}
                    type="password"
                    className="w-full pl-10 pr-4 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-white bg-white/10"
                    placeholder="Enter your password"
                  />
                </div>
                {loginErrors.password && <p className="mt-1 text-sm text-red-400">{loginErrors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link href="/auth/forgot-password" className="text-pink-400 hover:text-pink-300" onClick={() => setShowLogin(false)}>
                  Forgot password?
                </Link>
                <Link href="/auth/signup" className="text-gray-400 hover:text-white" onClick={() => setShowLogin(false)}>
                  Create account
                </Link>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-red-700 disabled:opacity-50 transition-all shadow-lg"
              >
                {loginLoading ? "Logging in..." : "Login & Book"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
