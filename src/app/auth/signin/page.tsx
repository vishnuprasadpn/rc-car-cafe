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
    <div className="min-h-screen bg-black overflow-hidden">
      <Navigation />
      <div className="flex min-h-[calc(100vh-80px)] pt-20">
        {/* Left Section - Form */}
        <div className="flex-1 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-y-auto">
          <div className="w-full max-w-md space-y-4">
            <div className="text-center">
              <h2 className="text-xl sm:text-3xl font-bold text-white mb-1">
                Welcome <span className="bg-gradient-to-r from-fury-orange to-primary-600 bg-clip-text text-transparent">Back</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                Sign in to continue your racing journey
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-red-400 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label htmlFor="email" className="flex items-center text-xs font-medium text-gray-300 mb-1.5">
                    <Mail className="h-3.5 w-3.5 mr-1.5 text-fury-orange" />
                    Email address
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    autoComplete="email"
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-0.5 text-xs text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="flex items-center text-xs font-medium text-gray-300 mb-1.5">
                    <Lock className="h-3.5 w-3.5 mr-1.5 text-fury-orange" />
                    Password
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    autoComplete="current-password"
                    className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="mt-0.5 text-xs text-red-400">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-fury-orange to-primary-600 hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fury-orange disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-fury-orange/25 flex items-center justify-center"
                >
                  {isLoading ? (
                    "Signing in..."
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Sign in
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-xs text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="font-semibold text-fury-orange hover:text-primary-600 transition-colors"
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
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-fury-orange/20 border border-fury-orange/40 mb-8 backdrop-blur-sm">
                <Trophy className="h-5 w-5 text-fury-orange mr-2" />
                <span className="text-fury-lightGray text-sm font-medium">Fury Road RC Club</span>
              </div>
            </div>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-fury-orange via-fury-orange to-primary-600 bg-clip-text text-transparent">
              Ready to Race?
            </h3>
            <p className="text-base sm:text-xl text-gray-300 mb-8 max-w-md leading-relaxed mx-auto">
              Get back on the track and experience the thrill of professional RC racing
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto w-full px-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 sm:p-3 border border-white/20 min-w-0">
                <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-fury-orange mx-auto mb-1" />
                <div className="text-base sm:text-lg font-bold text-fury-orange mb-0.5">4</div>
                <div className="text-[9px] sm:text-[10px] text-gray-300 text-center whitespace-nowrap">Tracks</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 sm:p-3 border border-white/20 min-w-0">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-fury-orange mx-auto mb-1" />
                <div className="text-base sm:text-lg font-bold text-fury-orange mb-0.5">20+</div>
                <div className="text-[9px] sm:text-[10px] text-gray-300 text-center whitespace-nowrap">Min Sessions</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 sm:p-3 border border-white/20 min-w-0">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-fury-orange mx-auto mb-1" />
                <div className="text-base sm:text-lg font-bold text-fury-orange mb-0.5">4</div>
                <div className="text-[9px] sm:text-[10px] text-gray-300 text-center whitespace-nowrap">Players</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
