"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Navigation from "@/components/navigation"
import { Zap, Mail, Lock, Trophy, Clock, Users, CheckCircle } from "lucide-react"
import { trackAuth, trackButtonClick } from "@/lib/analytics"

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type SignInForm = z.infer<typeof signInSchema>

function SignInPageContent() {
  const [isLoading, setIsLoading] = useState(false)
  // const [isGoogleLoading, setIsGoogleLoading] = useState(false) // Hidden for now
  const [error, setError] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get("reset") === "success") {
      setResetSuccess(true)
      // Clear the query parameter
      router.replace("/auth/signin", { scroll: false })
    }
    
      // Handle OAuth errors (commented out since Google auth is hidden)
      // const errorParam = searchParams.get("error")
      // if (errorParam) {
      //   if (errorParam === "OAuthSignin") {
      //     setError("Google sign-in failed. Please check your Google OAuth configuration or try again.")
      //   } else if (errorParam === "OAuthCallback") {
      //     setError("OAuth callback error. Please try signing in again.")
      //   } else if (errorParam === "OAuthCreateAccount") {
      //     setError("Failed to create account. Please try again.")
      //   } else if (errorParam === "OAuthAccountNotLinked") {
      //     setError("An account with this email already exists. Please sign in with your password.")
      //   } else {
      //     setError("Authentication error. Please try again.")
      //   }
      //   // Clear the error parameter from URL
      //   router.replace("/auth/signin", { scroll: false })
      // }
  }, [searchParams, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  })

  // Google Sign In Handler - Hidden for now
  // const handleGoogleSignIn = async () => {
  //   setIsGoogleLoading(true)
  //   setError("")
  //   trackButtonClick("Google Sign In", "signin_page")

  //   try {
  //     console.log("🔵 Initiating Google OAuth sign-in...")
  //     console.log("🔵 Window location:", window.location.href)
      
  //     // First, try with redirect: false to catch any immediate errors
  //     console.log("🔵 Calling signIn('google') with redirect: false to check for errors...")
  //     const result = await signIn("google", {
  //       callbackUrl: "/dashboard",
  //       redirect: false, // Don't redirect automatically - we'll handle it
  //     })
      
  //     console.log("🔵 Google signIn result:", result)
      
  //     // Check for errors
  //     if (result?.error) {
  //       console.error("❌ Google sign-in error:", result.error)
  //       console.error("❌ Error details:", result)
  //       setError(`Google sign-in failed: ${result.error}. This usually means:\n1. GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set\n2. Invalid credentials\n3. Redirect URI mismatch\n\nCheck server logs for details.`)
  //       setIsGoogleLoading(false)
  //       return
  //     }
      
  //     // If we got a URL, redirect to it (this is the Google OAuth page)
  //     if (result?.url) {
  //       console.log("✅ Got OAuth URL, redirecting to:", result.url)
  //       trackAuth("sign_in", "google")
  //       window.location.href = result.url
  //       // Don't set loading to false - we're redirecting
  //       return
  //     }
      
  //     // If result.ok is true but no URL, something unexpected happened
  //     if (result?.ok) {
  //       console.log("✅ Sign-in successful but no redirect URL")
  //       trackAuth("sign_in", "google")
  //       router.push("/dashboard")
  //       return
  //     }
      
  //     // Unexpected result
  //     console.warn("⚠️ Unexpected signIn result:", result)
  //     setError("Unexpected response from Google sign-in. Please check console and server logs.")
  //     setIsGoogleLoading(false)
      
  //   } catch (error) {
  //     console.error("❌ Google sign-in exception:", error)
  //     if (error instanceof Error) {
  //       console.error("❌ Error message:", error.message)
  //       console.error("❌ Error stack:", error.stack)
  //       setError(`Failed to sign in with Google: ${error.message}. Check browser console for details.`)
  //     } else {
  //       console.error("❌ Unknown error:", error)
  //       setError("Failed to sign in with Google. Please check your browser console and server logs.")
  //     }
  //     setIsGoogleLoading(false)
  //   }
  // }

  const onSubmit = async (data: SignInForm) => {
    setIsLoading(true)
    setError("")
    trackButtonClick("Email Sign In", "signin_page")

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        trackAuth("sign_in", "email")
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

            <div className="space-y-5">
              {resetSuccess && (
                <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/40 text-green-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Password reset successfully! You can now sign in with your new password.
                </div>
              )}
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                  {error}
                </div>
              )}

              {/* Google Sign In Button - Hidden */}
              {/* <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading || isLoading}
                className="w-full px-6 py-4 text-sm font-semibold rounded-xl text-white bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isGoogleLoading ? (
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
                    Or sign in with email
                  </span>
                </div>
              </div> */}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-300">
                    <Mail className="h-4 w-4 mr-2 text-fury-orange" />
                    Email address
                  </label>
                  <input
                    {...register("email")}
                    id="email"
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
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="flex items-center text-sm font-semibold text-gray-300">
                      <Lock className="h-4 w-4 mr-2 text-fury-orange" />
                      Password
                    </label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-fury-orange hover:text-primary-500 transition-colors font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    {...register("password")}
                    id="password"
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

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <SignInPageContent />
    </Suspense>
  )
}
