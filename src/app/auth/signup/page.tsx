"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Navigation from "@/components/navigation"
import { Zap, UserPlus, Mail, Lock, Phone, CheckCircle } from "lucide-react"

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignUpForm = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: data.phone,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/auth/signin")
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Registration failed")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-green-500/20 backdrop-blur-lg border border-green-500/40 text-green-400 px-6 py-4 rounded-xl">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <p className="text-lg font-semibold">Registration successful!</p>
            <p className="text-sm text-green-300">Redirecting to sign in...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <Navigation />
      <div className="flex min-h-[calc(100vh-80px)] pt-20">
        {/* Left Section - Form */}
        <div className="flex-1 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-y-auto">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-fury-orange/20 to-primary-600/20 rounded-2xl mb-2 border border-fury-orange/30 backdrop-blur-sm shadow-lg">
                <UserPlus className="h-8 w-8 text-fury-orange" />
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl text-white mb-2 uppercase">
                Join <span className="bg-gradient-to-r from-fury-orange via-fury-orange to-primary-600 bg-clip-text text-transparent">Fury Road</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-400">
                Create your account and start racing
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
                  <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-300">
                    <UserPlus className="h-4 w-4 mr-2 text-fury-orange" />
                    Full Name
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

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
                  <label htmlFor="phone" className="flex items-center text-sm font-semibold text-gray-300">
                    <Phone className="h-4 w-4 mr-2 text-fury-orange" />
                    Phone Number <span className="text-gray-500 text-xs ml-1 font-normal">(Optional)</span>
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    autoComplete="tel"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.phone.message}
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
                    autoComplete="new-password"
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

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="flex items-center text-sm font-semibold text-gray-300">
                    <Lock className="h-4 w-4 mr-2 text-fury-orange" />
                    Confirm Password
                  </label>
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.confirmPassword.message}
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
                      Creating account...
                    </span>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Create account
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-2">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/auth/signin"
                    className="font-bold text-fury-orange hover:text-primary-500 transition-colors underline underline-offset-2 decoration-2"
                  >
                    Sign in
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
              src="/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_2.jpg"
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
                <Zap className="h-5 w-5 text-fury-orange mr-2" />
                <span className="text-fury-lightGray text-sm font-semibold">Welcome to Fury Road</span>
              </div>
            </div>
            <h3 className="font-heading text-3xl sm:text-5xl md:text-6xl mb-6 bg-gradient-to-r from-fury-orange via-fury-orange to-primary-600 bg-clip-text text-transparent uppercase">
              Start Your Racing Journey
            </h3>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-md leading-relaxed mx-auto">
              Join Bangalore&apos;s premier RC racing community and experience the thrill of high-speed racing
            </p>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md mx-auto w-full px-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-2xl sm:text-4xl font-bold text-fury-orange mb-2">500+</div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">Races Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-2xl sm:text-4xl font-bold text-fury-orange mb-2">50+</div>
                <div className="text-xs sm:text-sm text-gray-300 font-medium">Active Members</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
