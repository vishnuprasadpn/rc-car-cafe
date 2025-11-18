"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Navigation from "@/components/navigation"
import { Zap, Mail, Lock, Trophy, Clock, Users } from "lucide-react"

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type SignInForm = z.infer<typeof signInSchema>

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        const session = await getSession()
        if (session?.user && (session.user as { role?: string }).role === "ADMIN") {
          router.push("/admin")
        } else if (session?.user && (session.user as { role?: string }).role === "STAFF") {
          router.push("/staff")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex min-h-screen">
        {/* Left Section - Form */}
        <div className="flex-1 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-y-auto">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-fury-orange/20 to-primary-600/20 rounded-2xl mb-4 border border-fury-orange/30 backdrop-blur-sm">
                <Trophy className="h-8 w-8 text-fury-orange" />
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl text-white mb-2 uppercase">
                Welcome <span className="bg-gradient-to-r from-fury-orange via-fury-orange to-primary-600 bg-clip-text text-transparent">Back</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-400">
                Sign in to continue your racing journey
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-pulse">
                  <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-300">
                    <Mail className="h-4 w-4 mr-2 text-fury-orange" />
                    Email address
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="flex items-center text-sm font-semibold text-gray-300">
                    <Lock className="h-4 w-4 mr-2 text-fury-orange" />
                    Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3.5 text-sm font-bold rounded-xl text-white bg-gradient-to-r from-fury-orange via-fury-orange to-primary-600 hover:from-primary-600 hover:via-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fury-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-fury-orange/30 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Signing in...
                    </span>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Sign in
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-bold text-fury-orange hover:text-primary-500 transition-colors underline underline-offset-2 decoration-2"
                  >
                    Create one
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_1.jpg"
              alt="RC Car Racing"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-fury-black/80 via-fury-black/70 to-fury-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-fury-orange/10 to-transparent"></div>
          </div>
          <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 text-white h-full w-full">
            <div className="mb-10">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-fury-orange/20 border border-fury-orange/40 backdrop-blur-sm shadow-lg">
                <Trophy className="h-5 w-5 text-fury-orange mr-2" />
                <span className="text-fury-lightGray text-sm font-semibold">Fury Road RC Club</span>
              </div>
            </div>
            <h3 className="font-heading text-3xl sm:text-5xl md:text-6xl mb-6 bg-gradient-to-r from-fury-orange via-fury-orange to-primary-600 bg-clip-text text-transparent uppercase">
              Ready to Race?
            </h3>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-md leading-relaxed mx-auto">
              Get back on the track and experience the thrill of professional RC racing
            </p>
            <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto w-full px-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 min-w-0 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-fury-orange mx-auto mb-2" />
                <div className="text-lg sm:text-xl font-bold text-fury-orange mb-1">4</div>
                <div className="text-[10px] sm:text-xs text-gray-300 text-center whitespace-nowrap font-medium">Tracks</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 min-w-0 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-fury-orange mx-auto mb-2" />
                <div className="text-lg sm:text-xl font-bold text-fury-orange mb-1">20+</div>
                <div className="text-[10px] sm:text-xs text-gray-300 text-center whitespace-nowrap font-medium">Min Sessions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 sm:p-4 border border-white/20 min-w-0 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-fury-orange mx-auto mb-2" />
                <div className="text-lg sm:text-xl font-bold text-fury-orange mb-1">4</div>
                <div className="text-[10px] sm:text-xs text-gray-300 text-center whitespace-nowrap font-medium">Players</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
