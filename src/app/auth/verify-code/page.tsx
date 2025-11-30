"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Navigation from "@/components/navigation"
import { Lock, ArrowLeft, CheckCircle, KeyRound } from "lucide-react"

const verifyCodeSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits").regex(/^\d+$/, "Code must contain only numbers"),
})

type VerifyCodeForm = z.infer<typeof verifyCodeSchema>

function VerifyCodePageContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    } else {
      router.push("/auth/forgot-password")
    }
  }, [searchParams, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyCodeForm>({
    resolver: zodResolver(verifyCodeSchema),
  })

  const onSubmit = async (data: VerifyCodeForm) => {
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/verify-reset-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: data.code,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Redirect to reset password page after 1 second
        setTimeout(() => {
          router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(data.code)}`)
        }, 1000)
      } else {
        setError(result.message || "Invalid or expired code")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return null
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
                <KeyRound className="h-8 w-8 text-fury-orange" />
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl text-white mb-2 uppercase">
                Verify <span className="bg-gradient-to-r from-fury-orange via-fury-orange to-primary-600 bg-clip-text text-transparent">Code</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-400">
                Enter the 6-digit code sent to <span className="text-fury-orange font-semibold">{email}</span>
              </p>
            </div>

            {success ? (
              <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/40 text-green-400 px-4 py-3 rounded-xl text-sm">
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Code verified! Redirecting to reset password...
                </p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="code" className="flex items-center text-sm font-semibold text-gray-300">
                    <Lock className="h-4 w-4 mr-2 text-fury-orange" />
                    Reset Code
                  </label>
                  <input
                    {...register("code")}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300 text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                      e.target.value = value
                      register("code").onChange(e)
                    }}
                  />
                  {errors.code && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.code.message}
                    </p>
                  )}
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
                        Verifying...
                      </span>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Verify Code
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-2 space-y-2">
                  <p className="text-xs text-gray-500">
                    Didn&apos;t receive the code?{" "}
                    <Link
                      href="/auth/forgot-password"
                      className="text-fury-orange hover:text-primary-500 transition-colors font-semibold"
                    >
                      Request a new one
                    </Link>
                  </p>
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-fury-orange transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <VerifyCodePageContent />
    </Suspense>
  )
}

