"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { signIn } from "next-auth/react"
import Navigation from "@/components/navigation"
import { Zap } from "lucide-react"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("google", {
        callbackUrl: "/dashboard",
        redirect: true,
      })

      if (result?.error) {
        setError("Failed to sign in with Google. Please try again.")
        setIsLoading(false)
      }
    } catch {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex min-h-screen">
        {/* Left Section - Form */}
        <div className="flex-1 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-y-auto pt-28">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-3">
              <h2 className="font-heading text-2xl sm:text-4xl text-white mb-2 uppercase">
                Join <span className="bg-gradient-to-r from-fury-orange via-fury-orange to-primary-600 bg-clip-text text-transparent">Fury Road</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-400">
                Create your account and start racing
              </p>
            </div>

            <div className="space-y-5">
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                  {error}
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full px-6 py-4 text-sm font-semibold rounded-xl text-white bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-800">Continue with Google</span>
                  </>
                )}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-400">
                    Quick and secure signup
                  </span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-xs text-gray-400">
                  By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
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
            </div>
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
